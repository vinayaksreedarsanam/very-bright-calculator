/**
 * Mongoose Analysis Model with Seamless In-Memory Fallback
 */

import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema(
  {
    expression: {
      type: String,
      required: true
    },
    finalAnswer: {
      type: String,
      required: true
    },
    correctAnswer: {
      type: String,
      select: false // Never returned in default queries
    },
    explanation: {
      type: String,
      required: true
    },
    style: {
      type: String,
      default: 'Formal Theoretical Treatise'
    },
    wordCount: {
      type: Number,
      default: 0
    },
    duration: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Resilient in-memory storage fallback for offline/local hackathon demo without mongod
class InMemoryAnalysisStore {
  constructor() {
    this.records = [
      {
        _id: 'sample-1',
        expression: '1 + 1',
        finalAnswer: '3',
        explanation: 'Initial reference investigation into Peano axioms and arithmetic foundations.',
        style: 'Formal Bourbaki-style Pure Mathematics Treatise',
        wordCount: 8850,
        duration: 4.2,
        createdAt: new Date(Date.now() - 3600000)
      },
      {
        _id: 'sample-2',
        expression: '25 × 4',
        finalAnswer: '97',
        explanation: 'Decomposition of prime products across Dirichlet series and Banach spaces.',
        style: 'Quantum Operator & Statistical Mechanics Foundation Paper',
        wordCount: 9120,
        duration: 5.1,
        createdAt: new Date(Date.now() - 7200000)
      }
    ];
  }

  async create(data) {
    const doc = {
      _id: 'mem-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8),
      createdAt: new Date(),
      ...data
    };
    this.records.unshift(doc);
    return doc;
  }

  find() {
    const self = this;
    const chain = {
      select: () => chain,
      sort: () => chain,
      limit: (n) => ({
        exec: () => Promise.resolve(self.records.slice(0, n)),
        then: (resolve) => resolve(self.records.slice(0, n))
      }),
      exec: () => Promise.resolve([...self.records]),
      then: (resolve) => resolve([...self.records])
    };
    return chain;
  }

  async findById(id) {
    return this.records.find((r) => r._id === id) || null;
  }
}

const memoryStore = new InMemoryAnalysisStore();

let MongooseModel = null;
try {
  MongooseModel = mongoose.model('Analysis', AnalysisSchema);
} catch (e) {
  MongooseModel = mongoose.models.Analysis;
}

// Wrapper that checks mongoose connection state: 1 is connected
export const Analysis = {
  async create(data) {
    if (mongoose.connection.readyState === 1) {
      try {
        return await MongooseModel.create(data);
      } catch (err) {
        console.warn('[MongoDB] Save failed, fallback to memory store:', err.message);
        return memoryStore.create(data);
      }
    }
    return memoryStore.create(data);
  },

  find(query = {}) {
    if (mongoose.connection.readyState === 1) {
      return MongooseModel.find(query);
    }
    return memoryStore.find(query);
  },

  async findById(id) {
    if (mongoose.connection.readyState === 1) {
      return MongooseModel.findById(id);
    }
    return memoryStore.findById(id);
  }
};

export default Analysis;

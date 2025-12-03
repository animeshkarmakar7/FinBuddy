import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['expense', 'income', 'investment'],
      required: [true, 'Please specify transaction type'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      trim: true,
    },
    merchant: {
      type: String,
      required: [true, 'Please provide merchant/source name'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an amount'],
      min: [0, 'Amount cannot be negative'],
    },
    date: {
      type: Date,
      default: Date.now,
      required: true,
    },
    time: {
      type: String,
      default: () => new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed',
    },
    paymentMethod: {
      type: String,
      default: 'Cash',
    },
    notes: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      default: 'DollarSign',
    },
    color: {
      type: String,
      default: 'violet',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
transactionSchema.index({ userId: 1, date: -1 });
transactionSchema.index({ userId: 1, type: 1 });

const Transaction = mongoose.model('Transaction', transactionSchema);

export default Transaction;

import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  charges: {
    type: Number,
    default: 0
  },
  notes: String
});

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Asset Details
  type: {
    type: String,
    enum: ['stock', 'mutual_fund', 'crypto', 'fd', 'gold', 'bond'],
    required: true
  },
  symbol: {
    type: String,
    required: true,
    uppercase: true
  },
  name: {
    type: String,
    required: true
  },
  exchange: {
    type: String,
    enum: ['NSE', 'BSE', 'CRYPTO', 'OTHER'],
    default: 'NSE'
  },
  
  // Quantity & Pricing
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  avgBuyPrice: {
    type: Number,
    required: true,
    min: 0
  },
  currentPrice: {
    type: Number,
    default: 0
  },
  
  // Calculated Fields
  totalInvested: {
    type: Number,
    default: 0
  },
  currentValue: {
    type: Number,
    default: 0
  },
  returns: {
    type: Number,
    default: 0
  },
  returnsPercentage: {
    type: Number,
    default: 0
  },
  
  // Transactions
  transactions: [transactionSchema],
  
  // Metadata
  sector: String,
  industry: String,
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  active: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Calculate totals before saving
investmentSchema.pre('save', function(next) {
  // Calculate total invested from transactions
  this.totalInvested = this.transactions
    .filter(t => t.type === 'buy')
    .reduce((sum, t) => sum + (t.quantity * t.price + t.charges), 0);
  
  // Calculate current value
  this.currentValue = this.quantity * this.currentPrice;
  
  // Calculate returns
  this.returns = this.currentValue - this.totalInvested;
  
  // Calculate returns percentage
  this.returnsPercentage = this.totalInvested > 0 
    ? ((this.returns / this.totalInvested) * 100).toFixed(2)
    : 0;
  
  next();
});

// Method to add transaction
investmentSchema.methods.addTransaction = function(transaction) {
  this.transactions.push(transaction);
  
  // Update quantity
  if (transaction.type === 'buy') {
    this.quantity += transaction.quantity;
    
    // Update average buy price
    const totalCost = (this.avgBuyPrice * (this.quantity - transaction.quantity)) + 
                      (transaction.price * transaction.quantity);
    this.avgBuyPrice = totalCost / this.quantity;
  } else {
    this.quantity -= transaction.quantity;
  }
  
  return this.save();
};

// Method to update price
investmentSchema.methods.updatePrice = function(newPrice) {
  this.currentPrice = newPrice;
  this.lastUpdated = new Date();
  return this.save();
};

const Investment = mongoose.model('Investment', investmentSchema);

export default Investment;

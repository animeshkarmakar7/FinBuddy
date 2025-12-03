import mongoose from 'mongoose';

const goalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Goal title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    targetAmount: {
      type: Number,
      required: [true, 'Target amount is required'],
      min: [0, 'Target amount must be positive'],
    },
    currentAmount: {
      type: Number,
      default: 0,
      min: [0, 'Current amount must be positive'],
    },
    deadline: {
      type: Date,
      required: [true, 'Deadline is required'],
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    category: {
      type: String,
      enum: ['vehicle', 'education', 'travel', 'emergency', 'home', 'investment', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'paused', 'cancelled'],
      default: 'active',
    },
    // AI-generated fields
    recommendedMonthlyContribution: Number,
    estimatedCompletionDate: Date,
    achievementProbability: Number,
    
    // Milestones
    milestones: [
      {
        percentage: Number,
        amount: Number,
        date: Date,
        achieved: { type: Boolean, default: false },
        achievedDate: Date,
      },
    ],
    
    // Contributions
    contributions: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
        note: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate progress percentage
goalSchema.virtual('progressPercentage').get(function () {
  return (this.currentAmount / this.targetAmount) * 100;
});

// Calculate remaining amount
goalSchema.virtual('remainingAmount').get(function () {
  return this.targetAmount - this.currentAmount;
});

// Method to add contribution
goalSchema.methods.addContribution = async function (amount, note = '') {
  this.contributions.push({ amount, note });
  this.currentAmount += amount;
  
  // Check if goal is completed
  if (this.currentAmount >= this.targetAmount) {
    this.status = 'completed';
  }
  
  await this.save();
  return this;
};

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;

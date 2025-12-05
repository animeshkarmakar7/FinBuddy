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
      enum: ['vehicle', 'education', 'travel', 'emergency', 'home', 'investment', 'wedding', 'health', 'gadget', 'other'],
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
        reward: String, // Celebration message
      },
    ],
    
    // Auto-savings rules
    autoSaveRules: {
      enabled: { type: Boolean, default: false },
      rules: [{
        type: { 
          type: String, 
          enum: ['percentage', 'fixed_amount', 'round_up'],
          default: 'percentage'
        },
        trigger: {
          type: String,
          enum: ['income', 'expense', 'any_transaction'],
          default: 'income'
        },
        value: Number, // Percentage (20) or fixed amount (500)
        active: { type: Boolean, default: true }
      }]
    },
    
    // Contributions
    contributions: [
      {
        amount: Number,
        date: { type: Date, default: Date.now },
        note: String,
        source: { 
          type: String, 
          enum: ['manual', 'auto_save', 'ai_suggested'],
          default: 'manual'
        },
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
goalSchema.methods.addContribution = async function (amount, note = '', source = 'manual') {
  this.contributions.push({ amount, note, source });
  this.currentAmount += amount;
  
  // Check and update milestones
  this.checkMilestones();
  
  // Check if goal is completed
  if (this.currentAmount >= this.targetAmount) {
    this.status = 'completed';
  }
  
  await this.save();
  return this;
};

// Method to generate default milestones
goalSchema.methods.generateMilestones = function() {
  const percentages = [25, 50, 75, 100];
  const rewards = [
    "Great start! You're 25% there! 🎉",
    "Halfway there! Keep it up! 🚀",
    "Almost there! 75% complete! 💪",
    "Goal achieved! Congratulations! 🎊"
  ];
  
  this.milestones = percentages.map((percentage, index) => ({
    percentage,
    amount: (this.targetAmount * percentage) / 100,
    achieved: false,
    reward: rewards[index]
  }));
};

// Method to check and update milestones
goalSchema.methods.checkMilestones = function() {
  if (!this.milestones || this.milestones.length === 0) {
    this.generateMilestones();
  }
  
  this.milestones.forEach(milestone => {
    if (!milestone.achieved && this.currentAmount >= milestone.amount) {
      milestone.achieved = true;
      milestone.achievedDate = new Date();
    }
  });
};

// Pre-save hook to generate milestones if not exist
goalSchema.pre('save', function(next) {
  if (this.isNew && (!this.milestones || this.milestones.length === 0)) {
    this.generateMilestones();
  }
  next();
});

const Goal = mongoose.model('Goal', goalSchema);

export default Goal;

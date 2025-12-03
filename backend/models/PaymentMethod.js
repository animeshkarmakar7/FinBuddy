import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['credit-card', 'debit-card', 'digital-wallet', 'bank-account'],
      required: [true, 'Please specify payment method type'],
    },
    name: {
      type: String,
      required: [true, 'Please provide a name'],
      trim: true,
    },
    number: {
      type: String,
      required: [true, 'Please provide card/account number'],
      trim: true,
    },
    balance: {
      type: Number,
      default: 0,
      min: 0,
    },
    limit: {
      type: Number,
      min: 0,
    },
    color: {
      type: String,
      default: 'from-blue-500 to-violet-600',
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure only one default payment method per user
paymentMethodSchema.pre('save', async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { userId: this.userId, _id: { $ne: this._id } },
      { isDefault: false }
    );
  }
  next();
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

export default PaymentMethod;

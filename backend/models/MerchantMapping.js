import mongoose from 'mongoose';

const merchantMappingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    merchant: {
      type: String,
      required: true,
      trim: true,
    },
    normalizedMerchant: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    confidence: {
      type: Number,
      default: 1.0,
      min: 0,
      max: 1,
    },
    source: {
      type: String,
      enum: ['user', 'rule', 'ai'],
      default: 'user',
    },
    timesUsed: {
      type: Number,
      default: 1,
    },
    lastUsed: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for faster lookups
merchantMappingSchema.index({ userId: 1, normalizedMerchant: 1 });

// Update lastUsed and increment timesUsed when mapping is used
merchantMappingSchema.methods.recordUsage = async function () {
  this.timesUsed += 1;
  this.lastUsed = Date.now();
  await this.save();
};

const MerchantMapping = mongoose.model('MerchantMapping', merchantMappingSchema);

export default MerchantMapping;

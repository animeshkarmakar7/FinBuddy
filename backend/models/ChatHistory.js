import mongoose from 'mongoose';

const chatMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  contextSnapshot: {
    type: Object, // Financial data at time of message
  },
});

const chatHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  sessionId: {
    type: String,
    required: true
  },
  messages: [chatMessageSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
chatHistorySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for fast queries
chatHistorySchema.index({ userId: 1, createdAt: -1 });
chatHistorySchema.index({ userId: 1, sessionId: 1 }, { unique: true });

const ChatHistory = mongoose.model('ChatHistory', chatHistorySchema);

export default ChatHistory;

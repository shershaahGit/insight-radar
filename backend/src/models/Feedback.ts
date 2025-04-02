
import mongoose, { Schema, Document } from 'mongoose';

export interface IFeedback extends Document {
  userId?: mongoose.Types.ObjectId;
  userName?: string;
  userEmail?: string;
  companyName?: string;
  category: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  text: string;
  source: 'form' | 'email' | 'social' | 'api';
  tags: string[];
  status: 'new' | 'reviewed' | 'responded' | 'closed';
  responses?: {
    userId: mongoose.Types.ObjectId;
    text: string;
    createdAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}

const FeedbackSchema: Schema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    userName: {
      type: String,
    },
    userEmail: {
      type: String,
    },
    companyName: {
      type: String,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
    },
    sentiment: {
      type: String,
      enum: ['positive', 'neutral', 'negative'],
      required: [true, 'Sentiment is required'],
    },
    score: {
      type: Number,
      min: 0,
      max: 1,
      required: [true, 'Sentiment score is required'],
    },
    text: {
      type: String,
      required: [true, 'Feedback text is required'],
      maxlength: [1000, 'Feedback text cannot be more than 1000 characters'],
    },
    source: {
      type: String,
      enum: ['form', 'email', 'social', 'api'],
      default: 'form',
    },
    tags: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['new', 'reviewed', 'responded', 'closed'],
      default: 'new',
    },
    responses: [
      {
        userId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true,
        },
        text: {
          type: String,
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// Create indexes for common queries
FeedbackSchema.index({ sentiment: 1 });
FeedbackSchema.index({ category: 1 });
FeedbackSchema.index({ status: 1 });
FeedbackSchema.index({ createdAt: -1 });

export default mongoose.model<IFeedback>('Feedback', FeedbackSchema);

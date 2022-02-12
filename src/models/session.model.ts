import mongoose from 'mongoose';
import { UserDocument } from './user.models';

// type definition for sessionSchema
export interface SessionDocument extends mongoose.Document {
  user: UserDocument['_id'];
  valid: boolean;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const sessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    valid: {
      type: Boolean,
      default: true,
    },
    userAgent: {
      type: String,
    },
  },
  {
    // Automatic createdAt and updatedAt
    timestamps: true,
  }
);

const Session = mongoose.model<SessionDocument>('Session', sessionSchema);

export default Session;

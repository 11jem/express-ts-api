import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import config from 'config';

// type definition for userSchema
export interface UserDocument extends mongoose.Document {
  email: string;
  name: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    // Automatic createdAt and updatedAt
    timestamps: true,
  }
);

///////////////////////////////////
// MIDDLEWARES //
///////////////////////////////////

// Password hashing
userSchema.pre('save', async function (next) {
  let user = this as UserDocument;

  if (!user.isModified('password')) return next();

  const salt = await bcrypt.genSalt(config.get<number>('saltWorkFactor'));
  const hash = await bcrypt.hash(user.password, salt);

  user.password = hash;

  return next();
});

///////////////////////////////////
// INSTANCE METHODS //
///////////////////////////////////

// Comparing passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as UserDocument;

  return await bcrypt.compare(candidatePassword, user.password);
};

const User = mongoose.model<UserDocument>('User', userSchema);

export default User;

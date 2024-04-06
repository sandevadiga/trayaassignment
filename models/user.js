import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({

username: { type: String, required: true },
  email: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = models.User || model("User", UserSchema);

export default User;
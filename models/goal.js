import { Schema, model, models } from 'mongoose';

const mongoose = require('mongoose');

const goalSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Prompt is required.'],
  },
  maxDays: {
    type: Number,
    required: [true, 'maxtime is required.'],
  },
  minDays: {
    type: Number,
    required: [true, 'minitime is required.'],
  },
  createdAt: { type: Date },
  GoalStatus:{
    type: Boolean,
    default: false, 
  }
});

const Goal = models.Goal || model('Goal', goalSchema);

export default Goal;

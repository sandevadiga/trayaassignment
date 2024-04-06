import { Schema, model, models } from 'mongoose';

// const mongoose = require('mongoose');

const TaskSchema = new Schema({
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: [true, 'Title is required.'],
  },
  frequency: {
    type: Number,
    required: [true, 'Frequency is required.'],
  },
  goalID: {
    type: Schema.Types.ObjectId, // Reference to the goal model
    ref: 'Goal',
    required: [true, 'Goal ID is required.'],
  },
  createdAt: { 
    type: Date 
  },
  noOfDays:{
    type:Number ,
    required: [true, 'No of days is missing.'],
  },
  remindHour:{
    type: Number ,
    required: [true, 'No of days is missing.'],
  },
  quantity:{
    type: Number ,
    required: [true, 'quantity of days is missing.'],
  },
  taskStatus:{
    type: Boolean,
    default: false, 
  }
});



const Tasks = models.Tasks || model('Tasks', TaskSchema);

export default Tasks;


// import { Schema, model, models } from 'mongoose';

// const mongoose = require('mongoose');

// const TaskSchema = new Schema({
//   creator: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   title: {
//     type: String,
//     required: [true, 'Prompt is required.'],
//   },
//   maxDays: {
//     type: Number,
//     required: [true, 'maxtime is required.'],
//   },
//   minDays: {
//     type: Number,
//     required: [true, 'minitime is required.'],
//   },
//   createdAt: { type: Date },
// });

// const Tasks = models.Tasks || model('Tasks', TaskSchema);

// export default Tasks;

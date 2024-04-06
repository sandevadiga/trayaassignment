import Goal from "../../../../models/goal";
import Tasks from "../../../../models/tasks";
import { connectToDB } from '../../../../utils/database';

export const GET = async (request,{ params }) => {
    try {

        console.log("cmae")
        
        // const id = request.headers.get('id');
        // // console.log(id)
        // if (!id) {
        //     throw new Error("User ID not found in headers");
        // }

        await connectToDB()

        const goals = await Goal.find({  _id: params.id  }).populate('creator');
        const tasks = await Tasks.find({ goalID: params.id }).populate('creator');

        const response = {
            goals,
            tasks
        }; 
        return new Response(JSON.stringify(response), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all goals", { status: 500 })
    }
} 









export const PATCH = async (request, { params }) => {
    const { title,maxDays, minDays,GoalStatus} = await request.json();

    console.log( title,maxDays, minDays,GoalStatus);
    try {
        await connectToDB();

        // Find the existing prompt by ID
        const existingGoal = await Goal.findOne({ _id: params.id });

// console.log(existingGoal)

        if (!existingGoal) {
            return new Response("Prompt not found", { status: 404 });
        }
console.log("saved")

   
  
        if(GoalStatus){
            existingGoal.GoalStatus= GoalStatus;   
        }else{
  //update
  existingGoal.title= title ;
  existingGoal.maxDays = maxDays ;
  existingGoal.minDays = minDays;
  existingGoal.GoalStatus=  false;
        }
  

        
        await existingGoal.save();

        console.log("saved4")

        return new Response("Successfully updated the Goal", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Goal", { status: 500 });
    }
};


export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        // Find the task by ID and remove it
        const deletedGoal = await Goal.deleteOne({ _id: params.id });

        // console.log(deletedGoal+"  jjjjjcame");

        if (!deletedGoal) {
            return new Response("Task not found", { status: 404 });
        }

        return new Response("Task deleted successfully", { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new Response("Error deleting task", { status: 500 });
    }
};
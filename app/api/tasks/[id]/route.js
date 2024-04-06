import Tasks from "../../../../models/tasks";
import { connectToDB } from '../../../../utils/database';

export const GET = async (request, { params }) => {
    try {
        // const id = request.headers.get('id');
        // console.log(id)
        
        // if (!id) {
        //     throw new Error(" ID not found in headers");
        // }

        await connectToDB()

        const tasks = await Tasks.find({ _id: params.id }).populate('creator');
        if (!tasks) return new Response("Task Not Found", { status: 404 });

        return new Response(JSON.stringify(tasks), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all tasks", { status: 500 })
    }
} 


export const PATCH = async (request, { params }) => {
    const { title ,remindHour ,frequency ,noOfDays ,createdAt,taskStatus} = await request.json();

    console.log( title ,remindHour ,frequency ,noOfDays ,createdAt,taskStatus);
    try {
        await connectToDB();

        // Find the existing prompt by ID
        const existingTasks = await Tasks.findOne({ _id: params.id });

console.log(existingTasks)

        if (!existingTasks) {
            return new Response("Prompt not found", { status: 404 });
        }
console.log("saved")

     //update

     if(taskStatus){
        existingTasks.taskStatus= taskStatus;
     }else{
         existingTasks.title= title ;
         existingTasks.remindHour = remindHour ;
         existingTasks.frequency = frequency;
         existingTasks.noOfDays =  noOfDays ;
         existingTasks.createdAt= createdAt;
         existingTasks.taskStatus= false;
     }
  
        await existingTasks.save();

        console.log("saved4")

        return new Response("Successfully updated the Tasks", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Tasks", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        await connectToDB();

        // Find the task by ID and remove it
        const deletedTask = await Tasks.deleteOne( {id: params.id });

        // console.log("here came");
        console.log(deletedTask);

        if (!deletedTask) {
            return new Response("Task not found", { status: 404 });
        }

        return new Response("Task deleted successfully", { status: 200 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new Response("Error deleting task", { status: 500 });
    }
};
import Tasks from '../../../../../models/tasks';
import { connectToDB } from '../../../../../utils/database';

export const POST = async (request) => {
    // console.log(request)
    // console.log("hiinnnnn")
    const {goalID,title,createdAt , userId,remindHour ,  noOfDays  , frequency ,quantity} = await request.json();
    console.log(goalID,title,createdAt,userId,quantity)
    
    try {
        await connectToDB();
        const newTask = new Tasks({ creator: userId,title,createdAt ,goalID,remindHour ,  noOfDays  , frequency ,quantity});

        await newTask.save();
        return new Response(JSON.stringify(newTask), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}



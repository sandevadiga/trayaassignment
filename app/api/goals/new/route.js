import Goal from "../../../../models/goal";
import { connectToDB } from '../../../../utils/database';

export const POST = async (request) => {
    console.log(request)
    const {userId,title,maxDays,minDays,createdAt} = await request.json();
    try {
        await connectToDB();
        const newGoal = new Goal({ creator: userId,title,maxDays,minDays,createdAt});

        await newGoal.save();
        return new Response(JSON.stringify(newGoal), { status: 201 })
    } catch (error) {
        return new Response("Failed to create a new prompt", { status: 500 });
    }
}


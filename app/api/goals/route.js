
import Goal from '../../../models/goal';
import { connectToDB } from '../../../utils/database';

export const GET = async (request) => {
    try {
        const userId = request.headers.get('userId');

        
        if (!userId) {
            throw new Error("User ID not found in headers");
        }

        await connectToDB()

        // console.log(request)
        const goals = await Goal.find({ creator: userId }).populate('creator');
 


        return new Response(JSON.stringify(goals), { status: 200 })
    } catch (error) {
        return new Response("Failed to fetch all goals", { status: 500 })
    }
} 
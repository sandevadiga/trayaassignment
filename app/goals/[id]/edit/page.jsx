'use client'
import React, { useState ,useEffect} from 'react';
import { useSession } from "next-auth/react";
import { useRouter ,usePathname} from "next/navigation";
// import GoalList from '../../components/GoalList';

const CreateGoalPage = () => {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [maxTime, setMaxTime] = useState(3); // Default max time is 3 days
  const [minDays, setMinDays] = useState(4); // Default min days is 4 days
  const [submitting, setIsSubmitting] = useState(false);

  const { data: session } = useSession();
  const router = useRouter();


  const pathname = usePathname()
  const parts = pathname.split('/'); // Split the pathname into segments
  const goalID = parts[parts.length - 2]; // Extract the second-to-last segment (goal ID)
  

  
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("fetching data")

      try {
        const response = await fetch(`/api/goals/${goalID}`, {
          headers: {
            'Content-Type': 'application/json',
            'id': goalID
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch task Details");
        }
        const data = await response.json();
        const goals = data.goals[0];
        // console.log(goals) 
        if (goals) {
          // console.log(goals) 
          setTitle(goals.title || '');
          setMaxTime(goals.maxDays || 3);
          setMinDays(goals.minDays || 1);
        }
        
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    fetchTasks();
  }, []);


  
  const handleSubmit =  async (e) => {
    e.preventDefault();

    //
    try {
        const response = await fetch(`/api/goals/${goalID}`, {
          method: "PATCH",
          body: JSON.stringify({
            // userId: session?.user.id,
            title: title,
            maxDays: maxTime,
            minDays: minDays,
            // createdAt: Date.now()
          }),
        });
  
        if (response.ok) {
          router.push("/");
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsSubmitting(false);
      }
  };



  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md text-black">
      <h2 className="text-2xl font-semibold mb-6">Create Goal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium mb-1">Title:</label>
          <input
            id="title"
            type="text"
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
       
        <div className="mb-4">
        <label htmlFor="minDays" className="block font-medium mb-1">Minimum Days to Complete:</label>
          <input
            id="minDays"
            type="number"
            min={1}
            max={30}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            value={minDays}
            onChange={(e) => setMinDays(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
        <label htmlFor="maxTime" className="block font-medium mb-1">Maximum Time (days):</label>
          <input
            id="maxTime"
            type="number"
            min={1}
            max={30}
            className="w-full border border-gray-300 rounded-md py-2 px-3"
            value={maxTime}
            onChange={(e) => setMaxTime(e.target.value)}
            required
          />          
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600" disabled={submitting}>Create Goal</button>
      </form>
    </div>
  );


 
};

export default CreateGoalPage;

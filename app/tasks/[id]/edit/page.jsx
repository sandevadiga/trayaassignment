

'use client'
import React, { useState  , useEffect } from 'react';
import { useSession } from "next-auth/react";
import { useRouter ,usePathname} from "next/navigation";
// import GoalList from '@/components/GoalList';

const CreateGoalPage = () => {
  // State for form inputs
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(3);
  const [frequency, setFrequency] = useState(1);
  const [submitting, setIsSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState(1);
  const [remindHour, setRemindHour] = useState('');

  const { data: session } = useSession();
  const router = useRouter();



  const pathname = usePathname()
  const parts = pathname.split('/'); // Split the pathname into segments
  const TaskID = parts[parts.length - 2]; // Extract the second-to-last segment (goal ID)
  

  
  useEffect(() => {
    const fetchTasks = async () => {
      console.log("fetching data")

      try {
        const response = await fetch(`/api/tasks/${TaskID}`, {
          headers: {
            'Content-Type': 'application/json',
            'id': TaskID
          }
        });

        if (!response.ok) {
          throw new Error("Failed to fetch task Details");
        }
        const data = await response.json();
        console.log(data) 
        if (data.length > 0) {
          setTasks(data[0])
          const task = data[0];
          setTitle(task.title || '');
          setQuantity(task.quantity || 3);
          setFrequency(task.frequency || 1);
          setSelectedDays(task.noOfDays || 1);
          setRemindHour(task.remindHour || '');
        }
        
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    fetchTasks();
  }, []);



  
  const handleSubmit =  async (e) => {
    e.preventDefault();

    if (!TaskID) return alert("Missing TaskID!");
  
        try {
      const response = await fetch(`/api/tasks/${TaskID}`, {
        method: "PATCH",
        body: JSON.stringify({
          title: title,
          remindHour:remindHour,
          frequency:frequency,
          noOfDays:selectedDays,
          createdAt: Date.now()
        }),
      });

      if (response.ok) {
        router.back();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDaysChange = (e) => {
    setSelectedDays(parseInt(e.target.value));
  };

  const handleFrequencyChange = (e) => {
    setFrequency(parseInt(e.target.value));
  };


  


  
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md text-black">
      <h2 className="text-2xl font-semibold mb-6">Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block font-medium mb-1">Title:</label>
          <input
            id="title"
            type="text"
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="maxTime" className="block font-medium mb-1">Quantity:</label>
          <input
            id="maxTime"
            type="number"
            min={1}
            max={100000}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />          
        </div>
        <div className="mb-4">
          <label htmlFor="selectFrequency" className="block font-medium mb-1">Select Frequency: per day</label>
          <select id="selectFrequency" value={frequency} onChange={handleFrequencyChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500">
            <option value={1}>Once a day</option>
            <option value={2}>Twice a day</option>
            <option value={3}>Three times a day</option>
          </select>
        </div>
       
        <div className="mb-4">
          <label htmlFor="selectDays" className="block font-medium mb-1">Select Number of Days: per week</label>
          <select id="selectDays" value={selectedDays} onChange={handleDaysChange} className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500">
            {[1, 2, 3, 4, 5, 6, 7].map((day) => (
              <option key={day} value={day}>
                {day} {day === 1 ? 'Day' : 'Days'}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="reminderHours" className="block font-medium mb-1">Reminder in Hours:</label>
          <input
            id="reminderHours"
            type="number"
            min={1}
            max={24}
            className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
            value={remindHour}
            onChange={(e) => setRemindHour(e.target.value)}
            required
          />          
        </div>

        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create Goal'}
        </button>
      </form>
    </div>
  );

 
};

export default CreateGoalPage;

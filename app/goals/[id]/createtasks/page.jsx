


'use client'
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { useRouter ,usePathname} from "next/navigation";
// import GoalList from '@/components/GoalList';

const CreateGoalPage = () => {
  // State for form inputs
  const [title, setTitle] = useState('');
  const [quantity, setQuantity] = useState(3); // Default max time is 3 days
  const [frequency, setFrequency] = useState(1); // Default min days is 4 days
  const [submitting, setIsSubmitting] = useState(false);
  const [selectedDays, setSelectedDays] = useState(1);
  const [remindHour, setRemindHour] = useState('');
  // const [selectedFrequency, setSelectedFrequency] = useState(1);

  const { data: session } = useSession();
  const router = useRouter();

  console.log(router)

  const pathname = usePathname()
  const parts = pathname.split('/'); // Split the pathname into segments
  const goalID = parts[parts.length - 2]; // Extract the second-to-last segment (goal ID)
  
  
  const handleSubmit =  async (e) => {
    e.preventDefault();

    //
        try {
      const response = await fetch(`/api/goals/${goalID}/createtasks`, {
        method: "POST",
        body: JSON.stringify({
          goalID: goalID,
          userId: session?.user.id,
          title: title,
          remindHour:remindHour,
          frequency:frequency,
          noOfDays:selectedDays,
          createdAt: Date.now(),
          quantity:quantity,
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
          <label htmlFor="quantity" className="block font-medium mb-1">Quantity:</label>
          <input
            id="quantity"
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

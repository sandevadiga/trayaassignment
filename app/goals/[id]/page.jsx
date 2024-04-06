'use client'

import React, { useState, useEffect } from 'react';
import { useRouter , usePathname } from 'next/navigation'
import Link from "next/link";



const CreateGoal = () => {
  const [goals, setGoals] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [goalStatus, setGoalStatus] = useState(false);
  const [taskStatus, setTaskStatus] = useState(false);

  const router = useRouter();
 

  const pathname = usePathname()
  const id = pathname.split('/').pop(); // Extract the last segment of the path
  // console.log(id)

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`/api/goals/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'id': id

          }
        });

        console.log("updated")
        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }
        const data = await response.json();
        // console.log(data)
        const { goals, tasks } = data;
        setGoals(goals[0]);
        setTasks(tasks)
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    fetchGoals();
  }, [goalStatus,taskStatus]);



  const handleDeleteTask = async (TaskID) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this Tasks?"
    );

    
    if (hasConfirmed) {
      try {
        await fetch(`/api/tasks/${TaskID}`, {
          method: "DELETE",
        });

        const filteredTasks = tasks.filter((item) => item._id !== TaskID);

        setTasks(filteredTasks);
      } catch (error) {
        console.log(error);
      }
    }
  };


  const handleDeleteGoal = async (id) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this Goal?"
    );

    console.log(id+"came")

    if (hasConfirmed) {
      try {
        await fetch(`/api/goals/${id}`, {
          method: "DELETE",
        });
        
        console.log("this came")

        router.push("/");

        // const filteredTasks = tasks.filter((item) => item._id !== TaskID);

        // setTasks(filteredTasks);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleGoalStatus = async (id)=>{
    try {
        const response = await fetch(`/api/goals/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            GoalStatus: true
          }),
        });
  
        if (response.ok) {
          // router.push("/");
        
          console,log("status updated")
        }
      } catch (error) {
        console.log(error);
      } finally {
        setGoalStatus(true);
      }
      
  }

  const handleTaskStatus = async (id)=>{
    try {
        const response = await fetch(`/api/tasks/${id}`, {
          method: "PATCH",
          body: JSON.stringify({
            taskStatus: true
          }),
        });
  
        if (response.ok) {
          // router.push("/");
        
          console.log("status updated")
        }
      } catch (error) {
        console.log(error);
      } finally {
        setTaskStatus(!taskStatus);
      }
      
  }

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);  


  const calculateRemainingTime = (tasks) => {
    const currentDate = currentTime;  // Current time
    const createdAtDate = new Date(tasks.createdAt); // Task creation time
    const reminderInterval = tasks.remindHour * 60 * 60 * 1000; // Convert reminder interval from hours to milliseconds

    // Calculate the time difference in milliseconds between current time and task creation time
    const timeDifference = currentDate - createdAtDate;

    // Calculate the time until the next reminder
    const remainingMilliseconds = reminderInterval - (timeDifference % reminderInterval);

    // Convert remaining time to hours and minutes
    const remainingHours = Math.floor(remainingMilliseconds / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((remainingMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
    const remainingSeconds = Math.floor((remainingMilliseconds % (1000 * 60)) / 1000);

    return { hours: remainingHours, minutes: remainingMinutes ,seconds: remainingSeconds  };
};



  return (
    <div className="flex flex-col mt-10 mx-10 bg-white rounded-lg overflow-hidden text-black">
      <div className="flex justify-between items-center bg-blue-500 p-4">
        <h1 className="text-xl">{goals.title}</h1>
        <div className="flex gap-4">
  
            <button className=" bg-blue-200 btn btn-green p-1 px-3 rounded"><Link href={`/goals/${id}/edit`}> Edit</Link></button>
          <button className=" bg-red-500 btn btn-green p-1 px-3 rounded" onClick={()=>handleDeleteGoal(id)}>Delete</button>
        
       {!goals.GoalStatus && (<button className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>handleGoalStatus(id)} >
              Complete
              </button>)}

        </div>
      </div>

      <div className="ml-4 mt-4">
        <div className="flex justify-between gap-4 m-3">
          <div>
            <label>Maximum Days:</label>
            <span>{goals.maxDays}</span>
          </div>
          <div>
            <label>Minimum Days:</label>
            <span>{goals.minDays}</span>
          </div>
        </div>
      </div>

<div className="sm:grid sm:grid-cols-2  rounded-lg  sm:gap-4 align-center ">
{tasks.map((tasks, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 m-4 flex  flex-col  relative overflow-hidden	">
              <h1 className="text-xl font-semibold mb-2  text-center">{tasks.title}</h1>
              <h5 className="mb-4">quantity : {tasks.quantity}</h5>
              <h5 className="mb-2">frequency : {tasks.frequency} /Day</h5>
              <h5 className="mb-4"> Reapeat  :  {tasks.noOfDays} Days/Week</h5>
              
              { !goals.GoalStatus && !tasks.taskStatus &&
               <h5>
                Next Reminder:
                {calculateRemainingTime(tasks).hours} : {calculateRemainingTime(tasks).minutes} : {calculateRemainingTime(tasks).seconds}
              </h5>}
              <div className="flex gap-5 m-5">
              <button className=" bg-blue-400 btn btn-green p-1 px-3 rounded"><Link href={`/tasks/${tasks._id}/edit`}> Edit</Link></button>
          <button className=" bg-red-500 btn btn-green p-1 px-3 rounded" onClick={()=>handleDeleteTask(tasks._id)}>Delete</button>

{goals.GoalStatus || tasks.taskStatus ? ( <div
                className="absolute transform -rotate-45 bg-yellow-500  text-center text-white font-semibold py-1 left-[-34px] top-[32px] w-[170px]">
              completed
              </div>):(<button className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=> handleTaskStatus(tasks._id)} >
              Complete
              </button>)} 
              </div>


                {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  <Link href={`/taskss/${tasks._id}`}> View</Link>
                </button> <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>handleDeletetasks(tasks._id)}>
                  Delete
                </button>
              </div>

              {tasks.tasksStatus ? ( <div
                className="absolute transform -rotate-45 bg-yellow-500  text-center text-white font-semibold py-1 left-[-34px] top-[32px] w-[170px]">
              completed
              </div>):(<button className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=> handleGoalStatus(goal._id)} >
              Complete
              </button>)} 
              
              */}

            </div>
          ))}
        
          </div>

     {!goals.GoalStatus && <div className="flex justify-center my-4">
        <button className="btn btn-blue">
          <Link href={`${pathname}/createtasks`}>Add New Task</Link>
        </button>
      </div>
}
    </div>
  );
};

export default CreateGoal;


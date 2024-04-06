'use client'


import { useState, useEffect } from "react";
import Link from "next/link";
import {useRouter , useSession } from "next-auth/react";

const GoalList = () => {
  const { data: session } = useSession();
  const [goals, setGoals] = useState([]);
  const [goalStatus,setGoalStatus]=useState(false)
  const [blink, setBlink] = useState(false);


  const userID = session.user.id;

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch("/api/goals", {
          headers: {
            'Content-Type': 'application/json',
            'userId': userID // Sending user ID in a custom header called "User-Id"
          }
        });
        if (!response.ok) {
          throw new Error("Failed to fetch goals");
        }
        const data = await response.json();
        setGoals(data);
      } catch (error) {
        console.error("Error fetching goals:", error);
      }
    };
    fetchGoals();
  }, [goalStatus]);

  const calculateRemainingTime = (goal) => {
    const currentDate = new Date();
    const createdAtDate = new Date(goal.createdAt);
    const maxDays = goal.maxDays;
    const targetDate = new Date(createdAtDate.getTime() + maxDays * 24 * 60 * 60 * 1000);
    const timeDiff = targetDate.getTime() - currentDate.getTime();
    const remainingDays = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    return { days: remainingDays, hours: remainingHours, minutes: remainingMinutes };
  };

  useEffect(() => {
    let timeout;
    if (blink) {
      timeout = setTimeout(() => {
        setBlink(false);
      }, 10000); // 10 seconds
    }
    return () => clearTimeout(timeout);
  }, [blink]);

  const toggleBlink = () => {
    setBlink(true);
  };

  const handleDeleteGoal = async (id) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this Goal?"
    );


    if (hasConfirmed) {
      try {
        await fetch(`/api/goals/${id}`, {
          method: "DELETE",
        });
      
        const filteredGoals = goals.filter((item) => item._id !== id);


        setGoals(filteredGoals);
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


  return (
    <div className="container mx-auto mt-8 m-5 flex flex-col  rounded-lg  justify-center  bg-gray-100  max-w-3xl p-10 text-black flex-1">

      <div className="bg-blue-500 text-white py-4 px-6 rounded-lg  flex">
        <h2 className="text-xl font-bold flex-1 text-center">My goals</h2>
      </div>

      <div className="sm:grid sm:grid-cols-2  rounded-lg  sm:gap-4 align-center  min-w-80 min-h-80">

        {goals.length === 0 ? (
          <>
            <div className="bg-blue-500 rounded-lg shadow-lg p-4 m-4 flex text-center  justify-center items-center 	">
              <h3 className=" bg-white text-xl rounded-lg  font-semibold p-3 "> <Link href={'/creategoal'}> ADD GOAL</Link></h3>
            </div>
            <div className="bg-blue-500 rounded-lg shadow-lg p-4 m-4 flex text-center  justify-center items-center 	">
              <h3 className="bg-white text-xl rounded-lg  font-semibold  p-3"> <Link href={'/creategoal'}> ADD GOAL</Link></h3>
            </div>
          </>
        ) : (<>

          {goals.map((goal, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-4 m-4 flex text-center  flex-col  justify-center items-center relative overflow-hidden	">
              <h2 className="text-xl font-semibold mb-2 ">{goal.title}</h2>
              <h5 className="mb-2">Max Days: {goal.maxDays}</h5>
              <h5 className="mb-4">Min Days: {goal.minDays}</h5>
              <h6>
                Remaining Time:
                {calculateRemainingTime(goal).days} Days {calculateRemainingTime(goal).hours} hours {calculateRemainingTime(goal).minutes} minutes

              </h6>
              <div className="flex gap-5 m-5">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  <Link href={`/goals/${goal._id}`}> View</Link>
                </button> <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>handleDeleteGoal(goal._id)}>
                  Delete
                </button>
              </div>
              

              {goal.GoalStatus ? ( <div
                className="absolute transform -rotate-45 bg-yellow-500  text-center text-white font-semibold py-1 left-[-34px] top-[32px] w-[170px]">
              completed
              </div>):(<button className="bg-green-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=> handleGoalStatus(goal._id)} >
              Complete
              </button>)}
            </div>
          ))}
          {
          goals.length === 1 &&
           <div className="bg-blue-500 rounded-lg shadow-lg p-4 m-4 flex text-center  justify-center items-center ">
            <h3 className="text-xl font-semibold mb-2"> <Link href={'/creategoal'}> ADD GOAL</Link></h3>
            <div className="absolute left-0 top-0 h-16 w-16">

            </div>
          </div>
          }
        </>)


        }

      </div>

    </div>

  )
};

export default GoalList;

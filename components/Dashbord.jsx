'use client'

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../firebase';
import Link from "next/link";

const Dashboard = () => {
  const { data: session } = useSession();
  const userEmail = session?.user?.email; // Access user's email from session
console.log(userEmail)
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Check if the user's email is available
        if (userEmail) {
          // Query the collection to find the user document by email
          const userQuery = query(collection(db, "publishers"), where("email", "==", 'admin1@gmail.com'));
          const querySnapshot = await getDocs(userQuery);
          
          if (!querySnapshot.empty) {
            // Get the first document (assuming there's only one user document per email)
            const userDoc = querySnapshot.docs[0];
            // Set user data in state
            setUserData(userDoc.data());
          } else {
            console.log("No user found with the provided email!");
          }
        }
      } catch (error) {
        console.log("Failed to get user data:", error);
      }
    };

    fetchData();
  }, [userEmail]); // Fetch data when userEmail changes



  return (
    <div>
      <h1>User Data</h1>
      {userData ? (
        // <pre>{JSON.stringify(userData, null, 2)}</pre>
        <div>
          <Link href='/addnews'>  ADD NEWS</Link>
          </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;

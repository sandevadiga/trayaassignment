'use client'
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import { signIn } from 'next-auth/react';
import Dashbord from '../components/Dashbord';




const page = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { data: session  ,update} = useSession();



  const signInWithEmailPassword = async (e) => {
    e.preventDefault();
      const data = await  signIn('credentials', { redirect: false, email: email ,password: password })
  };



  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-md shadow-md text-black">
      {!session?.user&& (
        <>
 <h2 className="text-2xl font-semibold mb-6">Login</h2>
 <form onSubmit={signInWithEmailPassword}>
   <div className="mb-4">
     <label htmlFor="title" className="block font-medium mb-1">Email</label>
     <input
       id="title"
       type="email"
       className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
       value={email}
       onChange={(e) => setEmail(e.target.value)}
       required
     />
   </div>
   <div className="mb-4">
     <label htmlFor="maxTime" className="block font-medium mb-1">Password</label>
     <input
       id="maxTime"
       type="password"
       className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-500"
       value={password}
       onChange={(e) => setPassword(e.target.value)}
       required
     />
   </div>
   <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600">
     Login
   </button>
 </form>
 </>
      )}
     
     {session &&(
    <Dashbord/>
     )}
    </div>
  );
};

export default page;

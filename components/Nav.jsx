
'use client'

import { useState } from "react";
import { useSession ,signOut } from "next-auth/react";
import Link from 'next/link'


function Nav() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white"><Link href="/" > Kannada4U.com  </Link></span>
        
       { session &&  <div className="flex items-center gap-10   md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          {/* <button type="button" className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" id="user-menu-button" aria-expanded={isDropdownOpen} onClick={toggleDropdown}>
            <span className="sr-only">Open user menu</span>
            <img className="w-8 h-8 rounded-full" src={session?.user.image} alt={session?.user.name + "'s photo"} />
          </button> */}
            <span className="block text-sm text-gray-900 dark:text-white ml-6 ">{session?.user.name}</span>

          {isDropdownOpen && (
            <div className="z-50 absolute right-0 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600" onClick={toggleDropdown} >
              <div className="px-4 py-3">
                <span className="block text-sm text-gray-900 dark:text-white">{session?.user.name}</span>
                <span className="block text-sm text-gray-500 truncate dark:text-gray-400">{session?.user.email}</span>
              </div>
            </div>
          )}

<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={()=>signOut()}>
  SingOut
</button>
        </div> }

       
      </div>
    </nav>
  );
}

export default Nav;

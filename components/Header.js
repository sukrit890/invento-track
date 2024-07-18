import React from 'react';
import { signOut} from 'next-auth/react';

const Header = () => {


  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className=" container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="flex title-font font-medium items-center mb-4 md:mb-0">
   
   <img src="/inventory.gif" alt="InventoTrack Logo" className="w-10 h-10 rounded-full" />
        
          <span className="ml-3 text-xl text-white">InventoTrack</span>
        </div>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center space-x-4">
          <a className="hover:text-indigo-300">Protected Page</a>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center bg-red-500 text-white border-0 py-1 px-3 focus:outline-none hover:bg-red-600 rounded transition-colors duration-300"
          >
            Sign Out
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;

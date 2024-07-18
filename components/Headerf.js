import React from 'react';


const Headerf = () => {


  
  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <div className="flex title-font font-medium items-center mb-4 md:mb-0">
   
   <img src="/inventory.gif" alt="InventoTrack Logo" className="w-10 h-10 rounded-full" />
        
          <span className="ml-3 text-xl text-white">InventoTrack</span>
        </div>
    
      </div>
    </header>
  );
};

export default Headerf;

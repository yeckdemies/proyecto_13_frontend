import React from 'react';

const DotsLoader = () => {
  return (
    <div className="flex justify-center items-center gap-2 h-12">
      <span className="w-3 h-3 rounded-full bg-red-500 animate-bounce [animation-delay:0s]"></span>
      <span className="w-3 h-3 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-3 h-3 rounded-full bg-yellow-500 animate-bounce [animation-delay:0.4s]"></span>
      <span className="w-3 h-3 rounded-full bg-green-500 animate-bounce [animation-delay:0.6s]"></span>
    </div>
  );
};

export default DotsLoader;

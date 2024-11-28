'use client';

import { useState } from 'react'
// import { IoAttach } from 'react-icons/io5'
// import { IoMdSend } from 'react-icons/io'

interface InputProps {
//   onSubmit: (message: string) => void;
}

const Input = ({ }: InputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() === '') return;
    
    // onSubmit(message);
    setMessage('');
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="fixed bottom-0 w-full bg-[#1e1e1e] p-4"
    >
      <div className="relative flex items-center max-w-4xl mx-auto">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Send a message..."
          className="w-full rounded-lg bg-[#2d2d2d] px-4 py-3 pr-16 
            text-white placeholder-gray-400 focus:outline-none"
        />
        <div className="absolute right-2 flex items-center space-x-2">
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-300 transition"
          >
            {/* <IoAttach size={20} /> */}
          </button>
          <button
            type="submit"
            className="p-2 text-gray-400 hover:text-gray-300 transition"
          >
            {/* <IoMdSend size={20} /> */}
          </button>
        </div>
      </div>
    </form>
  );
};

export default Input;

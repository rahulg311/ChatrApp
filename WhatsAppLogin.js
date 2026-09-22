import React, { useState } from 'react';

function WhatsAppLogin({ onLogin }) {
  const [senderId, setSenderId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (senderId.trim()) {
      onLogin(senderId.trim());  // Send senderId back to parent or API
      sessionStorage.setItem("senderId",senderId.trim())
    } else {
      alert('Please enter your phone number or ID');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-600 px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-700 mb-6 text-center">WhatsApp Login</h1>
        <form onSubmit={handleSubmit}>
          <label className="block text-gray-700 mb-2" htmlFor="senderId">
            Enter your ID number or ID
          </label>
          <input
            id="senderId"
            type="text"
            value={senderId}
            onChange={(e) => setSenderId(e.target.value)}
            // placeholder="+91 98765 43210"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
          />
          <button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-md transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default WhatsAppLogin;

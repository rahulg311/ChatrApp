// App.js
import React, { useEffect, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import WhatsAppLogin from './WhatsAppLogin';
import ChatApp from './ChatApp';


function App() {
  const [senderId, setSenderId] = useState(null);

  useEffect(()=>{
    let getadata=   sessionStorage.getItem("senderId")
    console.log("senderId",getadata)
    setSenderId(getadata)

  },[])

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            senderId ? (
              <Navigate to="/chat" replace />
            ) : (
              <WhatsAppLogin onLogin={setSenderId} />
            )
          }
        />
        <Route
          path="/chat"
          element={
            senderId ? (
              <ChatApp senderId={senderId} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

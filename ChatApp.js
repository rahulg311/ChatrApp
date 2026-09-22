import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
// import { FaUserCircle } from "react-icons/fa";
import { format } from "timeago.js";
import EmojiPicker from "emoji-picker-react";
import { FiPaperclip } from "react-icons/fi"
import { FaUserCircle } from "react-icons/fa";
import { FiUserPlus } from "react-icons/fi";

// Initialize socket outside the component to avoid multiple connections

// host url  render pe
// https://chat-app-backends-4mk8.onrender.com/testingAPI/users

// local url
// https://chat-app-backends-4mk8.onrender.com

const socket = io("https://chat-app-backends-4mk8.onrender.com", {
  transports: ["websocket"], // Prefer websocket over polling
  withCredentials: true, // Include credentials for cross-origin
});


function ChatApp() {
  const fileInputRef = useRef();
  let cureerentid = sessionStorage.getItem("senderId");
  const currentUser = { id: cureerentid, username: "You" };
  const [showAddUser, setShowAddUser] = useState(false);
  
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [ActiveUser, setActiveUsers] = useState([]);
  console.log("ActiveUser", ActiveUser, users);
  const [activeChat, setActiveChat] = useState(null);

  console.log("messages", messages);

  //   add emoji part
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const onEmojiClick = (emojiData) => {
    console.log("emojiData", emojiData.emoji);
    setMessage((prev) => prev + emojiData.emoji);
  };

  // Receiver side - when user opens the chat with sender
  useEffect(() => {
    if (receiver) {
      socket.emit("mark_as_read", {
        sender_id: String(receiver.id),
        receiver_id: currentUser.id, // this user is seeing messages
      });
    }
  }, [receiver]); // Runs when user opens a chat

  // Handle socket events only once when the component mounts
  useEffect(() => {
    // Log socket connection

    socket.emit("join", currentUser.id); // Emit current user's ID on join

    // Listen for the list of active users
    socket.on("active_users", (users) => {
      let checkactive = users.filter((i) => i != cureerentid);
      console.log("Active users:", checkactive, cureerentid);
      setActiveUsers(checkactive);
    });

    // Listen for seen event to update message status
    socket.on("message_seen", ({ sender_id, receiver_id, status, index }) => {
      console.log("statusstatus",  sender_id, receiver_id, status, index);

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          (msg.sender_id == sender_id &&
            msg.receiver_id == receiver_id &&
            msg.id == undefined) ||
          (msg.sender_id == receiver_id &&
            msg.receiver_id == sender_id &&
            msg.id == undefined)
            ? { ...msg, status }
            : msg
        )
      );
      console.log(
        `Message seen status updated between ${sender_id} and ${receiver_id}`
      );
    });

    socket.on("message_read", ({ sender_id, receiver_id, status }) => {
      console.log(
        "ender_id, receiver_id, statusdd",
        sender_id,
        receiver_id,
        status
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          (msg.sender_id == sender_id && msg.receiver_id == receiver_id) ||
          (msg.sender_id == receiver_id && msg.receiver_id == sender_id)
            ? { ...msg, status }
            : msg
        )
      );
      console.log(
        `Message seen status updated between ${sender_id} and ${receiver_id}`
      );
    });

    // Cleanup to avoid duplicate listeners
    // return () => {
    //   socket.off('active_users');
    // };

    // socket.on("message", (data) => {
    //   console.log("New message:", data);
    //   setMessages((prev) => [...prev, data]);
    // });

    socket.on("message", (data) => {
      console.log("New message:", data);
      setMessages((prev) => [...prev, data]);

      // Emit seen status immediately after receiving a message
      //   if (data.sender_id !== String(currentUser.id)) {
      socket.emit("mark_seen", {
        sender_id: String(data.sender_id),
        receiver_id: String(currentUser.id),
      });
      //   }
    });

    // socket.on('message_seen', (data) => {
    //     console.log("message_seen",data)
    // setMessages((prev) =>
    //   prev.map((msg) =>
    //     msg.sender_id === data.sender_id && msg.receiver_id === data.receiver_id
    //       ? { ...msg, status: 'seen' }
    //       : msg
    //   ))})

    socket.on("connect", () => {
      console.log("Connected to the server:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from the server");
    });

    // Cleanup on unmount
    return () => {
      socket.off("connect");
      socket.off("message");
      socket.off("disconnect");
      socket.off("message_seen");
    };
  }, []);

  // Fetch users and handle receiving messages

  // Fetch users from API
  const fetchUsers = () => {
    axios
      .post(
        "https://chat-app-backends-4mk8.onrender.com/testingAPI/users",
        { action: "ViewUser" },
        { withCredentials: true }
      )
      .then((res) => setUsers(res.data.users))
      .catch((err) => console.error("Error fetching users:", err));
  };

  useEffect(fetchUsers, []);

  const markAsSeen = () => {
    console.log("receiver.id", receiver);
    socket.emit("mark_seen", {
      sender_id: String(receiver.id),
      receiver_id: String(currentUser.id),
    });
  };

  useEffect(() => {
    if (receiver) markAsSeen();
    console.log("receiverreceiver", receiver);
  }, [receiver]);

  // Add new user
  const addUser = () => {
    if (!newUsername.trim()) return;
    axios
      .post(
        "https://chat-app-backends-4mk8.onrender.com/testingAPI/AddUser",
        { username: newUsername, socket_id: socket.id, action: "AddUsers" },
        { withCredentials: true }
      )
      .then(() => {
        fetchUsers();
        setNewUsername("");
      })
      .catch((err) => console.error("Error adding user:", err));
  };

  // Send a message
  // const sendMessage = () => {
  //   if (!message.trim()) return;
  //   const data = {
  //     sender_id: String(currentUser.id),
  //     receiver_id: String(receiver.id),
  //     message,
  //     action: "AddMessage",
  //     status: "sent",
  //     reply_to: replyMessage ? replyMessage.id : null,
  //   };
  //   // console.log("data", data);
  //   // setMessages((prev) => [
  //   //   ...prev,
  //   //   { ...data, sender_id: String(currentUser.id) },
  //   // ]);

  //   // console.log("datadata", data);
  //   // socket.emit("send_message", data);
  //   // setMessage("");
  //   // setReplyMessage("");
  //   axios
  //     .post("https://chat-app-backends-4mk8.onrender.com/testingAPI/sendMessage", data, {
  //       withCredentials: true,
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     })
  //     .then(() => {
  //       setMessages((prev) => [
  //         ...prev,
  //         { ...data, sender_id: String(currentUser.id) },
  //       ]);
  //       socket.emit("send_message", data);
  //       setMessage("");
  //       setReplyMessage("");
  //     })
  //     .catch((err) => console.error("Error sending message:", err));
  // };


const [onlineUser,setonlineUser]= useState("")

  const sendMessage = async () => {
  if (!message.trim() && !file) return;
  // console.log("file",file.name)

   const Currentdata = {
      sender_id: String(currentUser.id),
      receiver_id: String(receiver.id),
      message,
      action: "AddMessage",
      status: "sent",
      reply_to: replyMessage ? replyMessage.id : null,
    };

  const formData = new FormData();
  formData.append("sender_id", String(currentUser.id));
  formData.append("receiver_id", String(receiver.id));
  formData.append("message", message);
  formData.append("status", "sent");
  formData.append("action", "AddMessage");
  if (replyMessage) formData.append("reply_to", replyMessage.id);
  if (replyMessage) formData.append("file_url", replyMessage?.file_url);
  if (replyMessage) formData.append("file_type", replyMessage?.file_type);
  if (file) {
    formData.append("file", file); // Append file
    formData.append("file_type", file.type); // MIME type
    formData.append("file_name", file.name); // Optional
  }

  try {
    const res = await axios.post("https://chat-app-backends-4mk8.onrender.com/testingAPI/sendMessage", formData, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    let data = res.data.data

    console.log("formData",Currentdata)

    setMessages((prev) => [
      ...prev,
      {
        sender_id: String(currentUser.id),
        receiver_id: String(receiver.id),
        message,
        status: "sent",
        file_url: data?.file_url,
        file_type: data?.file_type,
        reply_to: replyMessage ? replyMessage.id : null,
      },
    ]);

 
    socket.emit("send_message", Currentdata); // Optional real-time
    setMessage("");
    setReplyMessage(null);
    // setFile(null);
   fileInputRef.current.value = null;
  } catch (err) {
    console.error("Send failed", err);
  }
};


  // Load chat for selected user
  const loadChat = (user) => {
    setReceiver(user);
    setActiveChat(user.id); // Update the active chat state
    setShowSidebar(false); // loadChat me
    const data = {
      sender_id: String(currentUser.id),
      receiver_id: String(user.id),
      status: "sent",
      reply_to: user.reply_to || null,
      action: "ViewChat",
    };
    fetchUsers();
    // Emit mark seen when chat is opened

    // Mark all messages as seen if chat is opened

    socket.emit("mark_seen", {
      sender_id: user.id,
      receiver_id: currentUser.id,
      status: "seen",
      message_id: message?.id,
    });
    axios
      .post("https://chat-app-backends-4mk8.onrender.com/testingAPI/PersonalMessage", data, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((res) => setMessages(res.data.data))
      .catch((err) => console.error("Error loading chat:", err));
  };
  const [replyMessage, setReplyMessage] = useState(null);
  console.log("replyMessage", replyMessage);

  const handleReply = (msg) => {
    console.log("dfsfafaf", msg);
    setReplyMessage(msg);
  };

  const [showSidebar, setShowSidebar] = useState(true);
  return (
<div className="flex h-screen bg-[#0b141a] text-white overflow-hidden">

  {/* ================= SIDEBAR ================= */}
  <div
    className={`
      ${receiver ? "hidden md:flex" : "flex"} 
      flex-col w-full md:w-1/3 lg:w-1/4 
      bg-[#111b21] border-r border-gray-800
    `}
  >
    {/* Header */}
    {/* <div className="p-4 border-b border-gray-700 text-lg font-semibold">
      Users {users.map((user) => user.id == currentUser.id ? user.username : "")}
    </div> */}
    <div className="flex items-center justify-between p-3 border-b border-gray-700 bg-[#202c33]">

  {/* Left: User Info */}
  <div className="flex items-center gap-2">
    <FaUserCircle className="text-2xl text-gray-300" />
    <span className="font-semibold">
      {users.map((user) =>
        user.id == currentUser.id ? user.username : ""
      )}
    </span>
  </div>

  {/* Right: Add User */}
 <button
  onClick={() => setShowAddUser((prev) => !prev)}
  className="flex items-center gap-1 bg-green-600 px-3 py-1 rounded-full text-sm hover:bg-green-700"
>
  <FiUserPlus />
  Add
</button>

</div>

  
  {/* Add User */}
    {/* <div className="p-3">
      <input
        type="text"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
        placeholder="New User"
        className="w-full p-2 mb-2 rounded bg-[#202c33] outline-none"
      />
      <button
        onClick={addUser}
        className="w-full py-2 bg-green-600 rounded"
      >
        Add User
      </button>
    </div> */}
{showAddUser && (
  <div className="p-2 bg-[#111b21] border-b border-gray-700 flex items-center gap-2">

    {/* Input */}
    <input
      type="text"
      value={newUsername}
      onChange={(e) => setNewUsername(e.target.value)}
      placeholder="Enter username"
      className="flex-1 p-2 rounded bg-[#202c33] outline-none text-sm"
      onKeyDown={(e) => e.key === "Enter" && addUser()}
    />

    {/* Add Button */}
    <button
      onClick={() => {
        addUser();
        setShowAddUser(false);
      }}
      className="bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-700"
    >
      Add
    </button>

    {/* Close Button ❌ */}
    <button
      onClick={() => setShowAddUser(false)}
      className="text-gray-400 hover:text-red-400 text-lg px-2"
    >
      ✕
    </button>

  </div>
)}
    {/* Users List */}
    <div className="flex-1 overflow-y-auto">
{users.map((user) => (
  <>
    {user.id != currentUser.id ? (
      <div
        key={user.id}
        onClick={() => loadChat(user)}
        className="block flex justify-between items-center w-full px-3 py-3 mb-2 
        rounded-xl cursor-pointer transition-all duration-300 
        bg-[#202c33] hover:bg-[#2a3942] 
        shadow-sm hover:shadow-md active:scale-[0.98]"
      >
        {/* LEFT */}
        <div className="flex items-center gap-3">

          {/* Avatar */}
          <div className="relative">
            <FaUserCircle className="text-3xl text-gray-300" />

            {/* Online Dot */}
            {/* {ActiveUser.map((id) =>
              id == user.id ? (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202c33] rounded-full"></span>
              ) : (
                ""
              )
            )} */}
            
          </div>

          {/* Name + Status */}
          <div className="flex flex-col">
            <p className="text-sm md:text-base font-semibold text-white">
              {user.username}
            </p>

            <p className="text-xs text-gray-400">
              {ActiveUser.map((id) =>
                id == user.id ?    <p className="text-xs py-1 text-green-500">Online </p>: "Offline"
              )}
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="text-xs text-gray-400">
          💬
        </div>
      </div>
    ) : (
      ""
    )}
  </>
))}
    </div>
  </div>

  {/* ================= CHAT ================= */}
  <div
    className={`
      ${receiver ? "flex" : "hidden md:flex"} 
      flex-col flex-1
    `}
  >
    {receiver ? (
      <div className="flex flex-col h-full">

        {/* Header */}
        <div className="flex items-center gap-3 p-3 bg-[#202c33] border-b border-gray-800">

          {/* 🔙 Back Button (mobile only) */}
          <button
            onClick={() => setReceiver(null)}
            className="md:hidden text-xl"
          >
            ⬅
          </button>

          <FaUserCircle className="text-2xl text-gray-400" />
          <div >
            <h2 className="font-semibold">{receiver.username}</h2>
            <p className="text-xs">
              {ActiveUser.map((id) =>
                    id == onlineUser  ? (
                <span className="text-green-400">Online</span>
              ) : (
                <span className="text-gray-400">Offline</span>
              ))}
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">

          {messages.map((msg, index) => (
            <div
              key={index}
              onClick={() => handleReply(msg)}
              className={`flex ${
                msg.sender_id == String(currentUser.id)
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] md:max-w-[60%] px-3 py-2 text-sm rounded-lg ${
                  msg.sender_id == String(currentUser.id)
                    ? "bg-[#005c4b] rounded-br-none"
                    : "bg-[#202c33] rounded-bl-none"
                }`}
              >
                {/* Reply */}
                {msg.reply_to && (
                  <div className="bg-black/30 p-1 text-xs rounded mb-1">
                    Reply:{" "}
                    {messages.find((m) => m.id == msg.reply_to)?.message || "Unknown"}
                  </div>
                )}

                {/* File */}
                {msg?.file_url && (
                  <img
                    src={`https://chat-app-backends-4mk8.onrender.com${msg.file_url}`}
                    alt="img"
                    className="w-40 rounded mb-1"
                  />
                )}

                <p>{msg.message}</p>

                <div className="flex justify-end items-center text-[10px] text-gray-400 mt-1">
                  {format(msg.timestamp)}
                  <span className="ml-1">
                    {receiver.id != null &&
                    msg.sender_id != String(currentUser.id)
                      ? ""
                      : msg?.status == "seen"
                      ? "✔✔"
                      : msg?.status == "read"
                      ? <span className="text-green-400">✔✔</span>
                      : "✔"}
                  </span>
                </div>
              </div>
            </div>
          ))}

        </div>

        {/* Reply Preview */}
        {replyMessage && (
          <div className="px-3 py-2 bg-[#202c33] flex justify-between text-sm">
            <span>Reply: {replyMessage.message}</span>
            <button onClick={() => setReplyMessage(null)}>❌</button>
          </div>
        )}

        {/* Input */}
        <div className="flex items-center gap-2 p-3 bg-[#202c33] relative">

          <button
            type="button"
            onClick={() => setShowEmojiPicker((val) => !val)}
            className="text-xl"
          >
            😊
          </button>

          {/* <input
            ref={fileInputRef}
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-xs"
          /> */}
          <input
  ref={fileInputRef}
  type="file"
  className="hidden"
  onChange={(e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    // Auto send (optional - agar chahte ho)
    setTimeout(() => {
      sendMessage();
    }, 100);
  }}
/>

{/* Upload Icon Button */}
<button
  onClick={() => fileInputRef.current.click()}
  className="p-2 rounded-full hover:bg-[#2a3942] text-gray-300 hover:text-white transition"
>
  <FiPaperclip className="text-lg md:text-xl" />
       </button>

          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onClick={() => setShowEmojiPicker(false)}
            placeholder="Type a message..."
            onKeyDown={(e) => e.key == "Enter" && sendMessage()}
            className="flex-1 p-2 bg-[#2a3942] rounded-full outline-none text-sm"
          />

          <button
            onClick={sendMessage}
            className="px-4 py-1 bg-green-500 rounded-full"
          >
            Send
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-14 left-2 z-50">
              <EmojiPicker onEmojiClick={onEmojiClick} />
            </div>
          )}
        </div>
      </div>
    ) : (
      <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
        Select a user to start chatting
      </div>
    )}
  </div>
</div>
  );
}

export default ChatApp;

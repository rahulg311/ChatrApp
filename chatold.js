import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";
import { format } from "timeago.js";
import EmojiPicker from "emoji-picker-react";

// Initialize socket outside the component to avoid multiple connections
const socket = io("http://localhost:8000", {
  transports: ["websocket"], // Prefer websocket over polling
  withCredentials: true, // Include credentials for cross-origin
});

function ChatApp() {
  const fileInputRef = useRef();
  let cureerentid = sessionStorage.getItem("senderId");
  const currentUser = { id: cureerentid, username: "You" };
  
  const [file, setFile] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState(null);
  const [message, setMessage] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [ActiveUser, setActiveUsers] = useState("online");
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
        "http://localhost:8000/testingAPI/users",
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
        "http://localhost:8000/testingAPI/AddUser",
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
  //     .post("http://localhost:8000/testingAPI/sendMessage", data, {
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
    const res = await axios.post("http://localhost:8000/testingAPI/sendMessage", formData, {
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
      .post("http://localhost:8000/testingAPI/PersonalMessage", data, {
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* User List */}

      {/* User List */}
      <div className="w-1/4 bg-gray-800 p-4 border-r border-gray-700">
        <h2 className="text-xl font-semibold text-white mb-4">
          Users{" "}
          {users.map((user) =>
            user.id == currentUser.id ? user.username : ""
          )}
        </h2>
        <input
          type="text"
          value={newUsername}
          onChange={(e) => setNewUsername(e.target.value)}
          placeholder="New User"
          className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white border border-gray-600"
        />
        <button
          onClick={addUser}
          className="w-full px-3 py-1 mb-2 bg-green-600 text-white rounded-md"
        >
          Add User
        </button>
        {users.map((user) => (
          <>
            {user.id != currentUser.id ? (
              <div
                key={user.id}
                onClick={() => loadChat(user)}
                className="block  flex   justify-between w-full text-left px-3 py-2 mb-1 bg-gray-700 rounded-md hover:bg-gray-600"
              >
                <div className="flex">
                  <FaUserCircle className="text-white text-2xl mr-2" />
                  <p className="text-white font-semibold">{user.username}</p>
                </div>
                <p className="text-gray-400 text-sm">
                  {ActiveUser.map((id) =>
                    id == user.id ? (
                      <p className=" py-1 text-blue-500 ">Online </p>
                    ) : (
                      ""
                    )
                  )}
                </p>
              </div>
            ) : (
              ""
            )}
          </>
        ))}
      </div>

      <div className="w-3/4 p-4 flex flex-col justify-between">
        {receiver ? (
          <div className="h-screen bg-gray-900 text-white flex flex-col justify-between">
            <div className="flex items-center justify-between p-4 bg-gray-800 shadow-md">
              <h2 className="text-xl font-semibold">
                {" "}
                Chat with {receiver.username}
              </h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => {
                console.log("msg-----msg", msg.file_url,`http://localhost:8000/${msg.file_url}`);
                return (
                  <div
                    key={index}
                    onClick={() => handleReply(msg)}
                    className={`flex ${
                      msg.sender_id == String(currentUser.id)
                        ? "justify-end"
                        : "justify-start"
                    } mb-2`}
                  >
                    <div
                      className={`max-w-xs px-4 py-2 rounded-xl shadow-lg ${
                        msg.sender_id == String(currentUser.id)
                          ? "bg-gradient-to-r from-gray-700 to-gray-800"
                          : "bg-gradient-to-r from-gray-600 to-gray-700"
                      } text-white`}
                    >
                      {/* If the message is a reply, show the original message */}
                      {msg.reply_to && (
                        <div className="flex items-center bg-gray-300 p-2 mb-1 rounded-md shadow-sm">
                          <svg
                            className="w-4 h-4 text-gray-800 mr-2"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M10 19l-7-7 7-7v4h8v6h-8v4z" />
                          </svg>
                          <p className="text-xs text-gray-800">
                            Reply to:{" "}
                            {messages.find((m) => m.id == msg.reply_to)
                              ?.message || "Unknown"}
                          </p>
                        </div>
                      )}
                      {msg?.file_url &&
        <img src={`http://localhost:8000${msg.file_url}`} alt="img" className="w-40 h-auto rounded" />}
                      <p className="font-semibold">{msg.message}</p>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400 me-3">
                          {format(msg.timestamp)}
                        </span>
                        {receiver.id != null &&
                        msg.sender_id != String(currentUser.id) ? (
                          ""
                        ) : msg?.status == "seen" ? (
                          "✔✔"
                        ) : msg?.status == "read" ? (
                          <span className=" text-green-400 font-bold">✔✔</span>
                        ) : (
                          "✔"
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Selected Reply Message */}
            {replyMessage && (
              <div className="p-2 mb-2 bg-green-300 rounded-xl border border-gray-500 flex items-center justify-between">
                <div>
                  <span className="text-sm text-gray-600">Replying to: </span>
                  <span className="font-semibold text-gray-600">
                    {replyMessage.message}
                  </span>
                </div>
                <button
                  className="text-red-500 text-xs ml-2"
                  onClick={() => setReplyMessage(null)}
                >
                  Clear
                </button>
              </div>
            )}

            <div className="flex p-4 bg-gray-800  mb-3">
              <button
                type="button"
                onClick={() => setShowEmojiPicker((val) => !val)}
                className="text-xl me-3"
              >
                😊
              </button>
              <div className="flex gap-2">
      <input  ref={fileInputRef} type="file" onChange={(e) => setFile(e.target.files[0])} />
     
    </div>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onClick={() => setShowEmojiPicker((val) => false)}
                placeholder="Type a message..."
                onKeyDown={(e) => e.key == "Enter" && sendMessage()} // Send on Enter
                className="flex-1 p-2 bg-gray-700 rounded-l-md text-white outline-none"
              />
              <button
                onClick={sendMessage}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Send
              </button>
            </div>
            {showEmojiPicker && (
              <div className="absolute bottom-14 z-10">
                <EmojiPicker onEmojiClick={onEmojiClick} />
              </div>
            )}
          </div>
        ) : (
          <div className="h-screen bg-gray-900 text-white flex flex-col justify-between">
            <p className="text-white-500 p-5">
              Select a user to start chatting
            </p>{" "}
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatApp;

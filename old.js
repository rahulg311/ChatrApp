import React from 'react'

const old = () => {
  return (
    <div>
              {/* Chat Box */}
 <div className="w-3/4 p-4 flex flex-col justify-between">
  {receiver ? (
    <>
      <h3 className="text-lg font-medium">
        Chat with {receiver.username}
      </h3>

      <div className="h-full overflow-y-auto p-2 mb-2 bg-white rounded shadow-inner">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender_id == String(currentUser.id)
                ? "justify-end"
                : "justify-start"
            }`}
            onClick={() => handleReply(msg)}  // Set reply on click
          >
            <div
              className={`max-w-xs p-2 m-1 rounded-xl text-sm flex flex-col ${
                msg.sender_id == String(currentUser.id)
                  ? "bg-green-500 text-white"
                  : "bg-blue-500 text-white"
              }`}
            >
              {/* If the message is a reply, show the original message */}
              {msg.reply_to && (
                <div className="bg-gray-300 p-1 mb-1 rounded">
                  <p className="text-xs text-gray-800">
                    Reply to: {messages.find(m => m.id == msg.reply_to)?.message || "Unknown"}
                  </p>
                </div>
              )}
              <p className="break-words">{msg.message}</p>
              
              {/* Message Status */}
              <span className="text-xs text-gray-200 self-end mt-1">
                {receiver.id != null && msg.sender_id != String(currentUser.id)
                  ? ""
                  : msg.status == "seen"
                  ? "✔✔"
                  : msg.status == "sent"
                  ? "✔"
                  : ""}
                {format(msg.created_at)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Selected Reply Message */}
      {replyMessage && (
        <div className="p-2 mb-2 bg-gray-200 rounded flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">Replying to: </span>
            <span className="font-semibold">{replyMessage.message}</span>
          </div>
          <button
            className="text-red-500 text-xs ml-2"
            onClick={() => setReplyMessage(null)}
          >
            Clear
          </button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="w-full p-2 rounded border"
          onKeyDown={(e) => e.key == "Enter" && sendMessage()}  // Send on Enter
        />
        <button
          onClick={sendMessage}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Send
        </button>
      </div>
    </>
  ) : (
    <p className="text-gray-500">Select a user to start chatting</p>
  )}
</div>
    </div>
  )
}

export default old
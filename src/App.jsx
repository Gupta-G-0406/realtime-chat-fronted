// import React, { useMemo, useState, useEffect } from "react";
// import { io } from "socket.io-client";

// const App = () => {
//   const socket = useMemo(
//     () => io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000"),
//     [],
//   );

//   const [msg, setMsg] = useState("");
//   const [room, setRoom] = useState("");
//   const [socketID, setSocketID] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [roomName, setRoomName] = useState("");

//   useEffect(() => {
//     socket.on("connect", () => {
//       setSocketID(socket.id);
//       console.log(`Connected to server ${socket.id}`);
//     });

//     socket.on("receive-message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => {
//       socket.disconnect();
//     };
//   }, [socket]);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     socket.emit("message", { msg, room });
//     setMsg("");
//     setRoom("");
//   };

//   const joinRoomName = (e) => {
//     e.preventDefault();
//     socket.emit("join-room", roomName);
//     setRoomName("");
//   };

//   return (
//     <div style={styles.wrapper}>
//       <div style={styles.card}>
//         <h2 style={styles.title}>💬 Chat Application</h2>

//         <p style={styles.socketText}>Socket ID: {socketID}</p>

//         {/* Join Room */}
//         <form onSubmit={joinRoomName} style={styles.section}>
//           <input
//             type="text"
//             placeholder="Enter Room Name"
//             value={roomName}
//             onChange={(e) => setRoomName(e.target.value)}
//             style={styles.input}
//           />
//           <button type="submit" style={styles.primaryButton}>
//             Join Room
//           </button>
//         </form>

//         {/* Send Message */}
//         <form onSubmit={handleSubmit} style={styles.section}>
//           <input
//             type="text"
//             value={msg}
//             onChange={(e) => setMsg(e.target.value)}
//             placeholder="Enter Message"
//             style={styles.input}
//           />

//           <input
//             type="text"
//             value={room}
//             onChange={(e) => setRoom(e.target.value)}
//             placeholder="Enter Room"
//             style={styles.input}
//           />

//           <button type="submit" style={styles.primaryButton}>
//             Send Message
//           </button>
//         </form>

//         {/* Messages */}
//         <div style={styles.chatBox}>
//           {messages.length === 0 ? (
//             <p style={styles.emptyText}>No messages yet...</p>
//           ) : (
//             messages.map((message, index) => (
//               <div key={index} style={styles.messageBubble}>
//                 {typeof message === "object" ? message.msg : message}
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// const styles = {
//   wrapper: {
//     minHeight: "100vh",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//     background: "linear-gradient(135deg, #667eea, #764ba2)",
//     fontFamily: "Arial, sans-serif",
//   },

//   card: {
//     width: "420px",
//     background: "#fff",
//     padding: "25px",
//     borderRadius: "16px",
//     boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
//     display: "flex",
//     flexDirection: "column",
//   },

//   title: {
//     textAlign: "center",
//     marginBottom: "8px",
//   },

//   socketText: {
//     textAlign: "center",
//     fontSize: "12px",
//     color: "#777",
//     marginBottom: "20px",
//   },

//   section: {
//     marginBottom: "15px",
//     display: "flex",
//     flexDirection: "column",
//   },

//   input: {
//     width: "100%",
//     padding: "10px",
//     borderRadius: "8px",
//     border: "1px solid #ddd",
//     marginBottom: "10px",
//     fontSize: "14px",
//     outline: "none",
//   },

//   primaryButton: {
//     width: "100%",
//     padding: "10px",
//     borderRadius: "8px",
//     border: "none",
//     backgroundColor: "#667eea",
//     color: "#fff",
//     fontSize: "14px",
//     cursor: "pointer",
//   },

//   chatBox: {
//     height: "220px",
//     overflowY: "auto",
//     padding: "12px",
//     borderRadius: "12px",
//     backgroundColor: "#f4f6fb",
//     display: "flex",
//     flexDirection: "column",
//   },

//   messageBubble: {
//     backgroundColor: "#667eea",
//     color: "#fff",
//     padding: "8px 14px",
//     borderRadius: "20px",
//     marginBottom: "8px",
//     maxWidth: "75%",
//     fontSize: "14px",
//     alignSelf: "flex-start",
//   },

//   emptyText: {
//     textAlign: "center",
//     color: "#999",
//   },
// };

// export default App;

import React, { useMemo, useState, useEffect } from "react";
import { io } from "socket.io-client";

const App = () => {
  // ✅ Socket inside component
  const socket = useMemo(
    () =>
      io(import.meta.env.VITE_BACKEND_URL || "http://localhost:3000", {
        transports: ["websocket", "polling"], // ensures Chrome compatibility
        withCredentials: true, // optional, only if backend uses cookies
      }),
    [],
  );

  const [msg, setMsg] = useState("");
  const [room, setRoom] = useState("");
  const [socketID, setSocketID] = useState("");
  const [messages, setMessages] = useState([]);
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketID(socket.id);
      console.log(`Connected to server ${socket.id}`);
    });

    socket.on("receive-message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("connect");
      socket.off("receive-message");
      socket.disconnect();
    };
  }, [socket]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!msg || !room) return;
    socket.emit("message", { msg, room });
    setMessages((prev) => [...prev, { msg: `You: ${msg}`, room }]);
    setMsg("");
  };

  const joinRoomName = (e) => {
    e.preventDefault();
    if (!roomName) return;
    socket.emit("join-room", roomName);
    setMessages((prev) => [...prev, `You joined room: ${roomName}`]);
    setRoom(roomName);
    setRoomName("");
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>💬 Chat Application</h2>
        <p style={styles.socketText}>Socket ID: {socketID}</p>

        {/* Join Room */}
        <form onSubmit={joinRoomName} style={styles.section}>
          <input
            type="text"
            placeholder="Enter Room Name"
            value={roomName}
            onChange={(e) => setRoomName(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.primaryButton}>
            Join Room
          </button>
        </form>

        {/* Send Message */}
        <form onSubmit={handleSubmit} style={styles.section}>
          <input
            type="text"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Enter Message"
            style={styles.input}
          />
          <button type="submit" style={styles.primaryButton}>
            Send Message
          </button>
        </form>

        {/* Messages */}
        <div style={styles.chatBox}>
          {messages.length === 0 ? (
            <p style={styles.emptyText}>No messages yet...</p>
          ) : (
            messages.map((message, index) => (
              <div key={index} style={styles.messageBubble}>
                {typeof message === "object" ? message.msg : message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Styles (unchanged)
const styles = {
  wrapper: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    fontFamily: "Arial, sans-serif",
  },
  card: {
    width: "420px",
    background: "#fff",
    padding: "25px",
    borderRadius: "16px",
    boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  },
  title: { textAlign: "center", marginBottom: "8px" },
  socketText: {
    textAlign: "center",
    fontSize: "12px",
    color: "#777",
    marginBottom: "20px",
  },
  section: { marginBottom: "15px", display: "flex", flexDirection: "column" },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "10px",
    fontSize: "14px",
    outline: "none",
  },
  primaryButton: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#667eea",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },
  chatBox: {
    height: "220px",
    overflowY: "auto",
    padding: "12px",
    borderRadius: "12px",
    backgroundColor: "#f4f6fb",
    display: "flex",
    flexDirection: "column",
  },
  messageBubble: {
    backgroundColor: "#667eea",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: "20px",
    marginBottom: "8px",
    maxWidth: "75%",
    fontSize: "14px",
    alignSelf: "flex-start",
  },
  emptyText: { textAlign: "center", color: "#999" },
};

export default App;

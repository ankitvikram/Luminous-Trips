const express = require("express");
const cors = require("cors");

const app = express();
const corsOptions = {origin: "http://127.0.0.1:5500"};
app.use(cors());

const server = app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

const io = require("socket.io")(server);

app.get('/',(req,res)=>{
  res.send('running')
})

const users = {}; //This is an empty object to store user data

io.on("connection", (socket) => {
  console.log("connected");
  // If any new user joins, let other users connected to the server know!
  socket.on("new-user-joined", (name) => {
    console.log(name);
    
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  // If someone sends a message, broadcast it to other people
  socket.on("send", (message) => {
    console.log({ message });
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  // If someone leaves the chat, let others know
  socket.on("disconnect", (message) => {
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});

const express = require("express")
const app = express();
const { Server } = require("socket.io");
const http = require("http")
const cors = require("cors")
const port = process.env.PORT || 8000

app.use(cors())

const server = http.createServer(app)

const io = new Server(server,{
	cors:{
		origin:"*",
		methods:["GET","POST"]
	     }
        })
        



const users = {}
io.on("connection", (socket) => {

socket.on("typing",(room,reciever,name)=>{
    socket.in(room).emit("typing",reciever,name)
})
socket.on("stop typing",(room,reciever,name)=>{socket.in(room).emit("stop typing",reciever,name)})

socket.on("disconnect",()=>{
    for(let user in users){
        if(users[user] === socket.id)
        delete users[user];

        io.emit("all_users",users);
    }
})

socket.on("new_users",(username)=>{
    users[username] = socket.id;
})
   //telling everyone that someone is connected
   io.emit("all_users",users);

   

    //room
    socket.on("joinroom",(room) => {
        socket.join(room);
        
    })

    //for msg
     socket.on("newmsg",({newmsg,room})=>{
        io.in(room).emit("getnewmsg",newmsg)
    
  
    })

    //notification
    socket.on("notification",(sender,reciever,newmsg,room)=>{
        io.emit("setnotification",sender,reciever,newmsg,room)
    })

    socket.on("seen",(seen,room)=>{
        io.in(room).emit("setseen",seen);

    })
   


  })

  




app.get("/",(req,res)=>{
    res.send("Suvro running")

})

server.listen(port,()=>{
    console.log(`Listening at ${port}`)
})
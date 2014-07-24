var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var image_name = "";
var current_turn="";
var curr_socket = "";
var counter= 0;
var room = [];
var sock_id = [];
var i=0;j=0,k=0;

app.get('/', function(req, res){
  res.sendfile('index.html');
});

for(i=0;i<20;i++)
{
  room[i] = "room"+i;
}


io.on('connection', function(socket){
  var private_roomname ="";
	counter ++;
  curr_socket = socket;
  sock_id.push(socket.id);
  console.log("This is new user: "+socket.id);
  if(counter <= 2)
  {
   socket.join(room[k]);
   io.to(room[k]).emit('wait_for_player',"Please wait for another player to join");
   console.log("Socket id: "+socket.id +" joined in room: "+ room[k]);
   private_roomname = room[k];
   if (counter == 2)
   {
    io.to(room[k]).emit('join_room',room[k]);
    k++;
    counter = 0;
   }
  }

  socket.on('init_choice', function(msg,bool_val,room_n){
		io.to(room_n).emit('init_choice_reply',msg, bool_val);
 	
  });

  socket.on('disconnect', function(){
    console.log("Disconected from room: "+private_roomname);
    io.to(private_roomname).emit('player_disconnected');

  });

	socket.on('playerx',function(name,turn,room_n){
		if (turn == "X")
    	{
    		image_name = "ex.png";
    		current_turn = "O";
    	}
   	 	if (turn == "O")
    	{
    		image_name = "o.png";
    		current_turn = "X";
    	}
		io.to(room_n).emit('grid_update',name,image_name,current_turn);
	});
 
});



app.use(express.static(path.join(__dirname, 'public')));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

var i,j,count=0,turn="",state=true,current_turn="",game_start=false;
var list = [],user_choice;
var play1, play2,msg,won=false,key=0,game_choice=0;
var tictactoe = new Array(9);
var wincomb = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var socket = io();
var room_name = "",first_time=true;

filled = new Array(3);
for (var i = 0; i < 3; i++)
{
   filled[i] = new Array(3);
}

for (i=0;i<3;i++)
{
 for(j=0;j<3;j++)
 {
 	filled[i][j] = false;
 }
}


function replaceimage()
{
	var name = this.id;
	i = parseInt(name.charAt(1));
	j = parseInt(name.charAt(3));

	if (filled[i][j] == false && won == false && game_start == true)
	{
	console.log(filled[i][j]);
		if (turn == current_turn)
		{
		  socket.emit('playerx',name,turn,room_name);
		  console.log("inside Turn"+turn);
		}		
		
	}
	else
	{
		msg.innerHTML = "You cannot put here";
	}

}


function find_winner()
{
var index =0;
var sum = 0;
	
	
	
		 for (index=0;index<8;index++)
		 {
			sum = tictactoe[wincomb[index][2]] + tictactoe[wincomb[index][1]] + tictactoe[wincomb[index][0]];
			console.log("Sum: "+sum);
			if(sum == 30)
			{
				console.log("X won");
				msg.innerHTML = "Player 1 Won !!";
				won = true;
			}
			if(sum == 6)
			{
				console.log("O won");
				msg.innerHTML = "Player 2 Won !!";
				won = true;

			}
		}

	if(count==9 && won == false)
	{
				msg.innerHTML = "Match Tied";
	} 
	

}

function player_one()
{
	turn = "X";
	play1.disabled = true;
	play2.disabled = true;
	user_choice.innerHTML = "X";
  socket.emit('init_choice', "X", true,room_name);
}

function player_two()
{
	turn = "O";
	play2.disabled = true;
	play1.disabled = true;
	user_choice.innerHTML = "O";
	socket.emit('init_choice', "O", true,room_name);

}

function refreshpage()
{
	location.reload(true);

}

function somefunction()
{
	msg = document.getElementById("message_centre");
	user_choice =  document.getElementById("game_choice");
	list = document.getElementsByName("cell");
	for (i=0;i<9;i++)
	{
		list[i].addEventListener("click",replaceimage);
	}
	play1 = document.getElementById("player1");
	console.log(play1.id);
	play2 = document.getElementById("player2");
	play1.addEventListener("click",player_one);
	play2.addEventListener("click",player_two);
	document.getElementById("reset").addEventListener("click",refreshpage);
	
    socket.on('init_choice_reply',function(choice,room_name){

    	if (choice == "X")
    	{
    		play1.disabled = true;
    	}
    	if  (choice == "O")
    	{
    		play2.disabled = true;
    	}
    	game_start = true;
    });

    socket.on('grid_update',function(cell_position,image_name,current_tur){
      current_turn = current_tur;
	  var newnode = document.createElement("IMG");
	  i = parseInt(cell_position.charAt(1));
	  j = parseInt(cell_position.charAt(3));
	  newnode.setAttribute("src",image_name);
      newnode.setAttribute("width","100px;");
      console.log("Error check location i:"+i +" j: "+j);
	  var img1 = document.getElementById("i"+i+j);
	  document.getElementById(cell_position).replaceChild(newnode,img1);
	  tictactoe[3*i+j] = (current_tur == "X")? 2 : 10 ;
	  filled[i][j] = true;
	  msg.innerHTML = "Now: "+current_turn+" turn";
	  count++;
	  find_winner();

    });

    socket.on('join_room',function(room)
    {
    	console.log("join room event occured");
    	room_name = room;
	   msg.innerHTML = "Gamer Joined";
	   if (game_choice % 2 == 0)
    	{
    		current_turn = "X";
    	}
    	else
    	{
    		current_turn = "O";
    	}
    	game_choice++;
    	console.log("current_turn:"+current_turn);
    });

    socket.on('wait_for_player',function(msgdisp)
    	{
	     msg.innerHTML = msgdisp;
    	});
    socket.on('player_disconnected', function()
    {
	     msg.innerHTML = "Player disconnected in the middle. Please hit play again to find a match";
    });

}

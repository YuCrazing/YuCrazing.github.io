---
title: Maze
category: Game
tags: ["Javascript", "Canvas"]
---
<style>

</style>

<div align="center">
	<canvas id="maze" width="600px" height="300px"></canvas>
</div>

<script>
	var canvas = document.getElementById("maze");
	var ctx = canvas.getContext("2d");

	// var ctx = $("#maze").getContext("2d"); // why can't?

	function Text(x1, y1, text){
		ctx.font = "30px OpenSansLight";
		ctx.fillText(text, x1, y1);
	}

	function Line(x1, y1, x2, y2){
		color = new Object();
	 	color.start = "rgb(" + Math.floor(x1 / canvas.width * 255) + ", " + Math.floor(y1 / canvas.height  * 255) + ", 0)";
		color.end = "rgb(" + Math.floor(x2 / canvas.width * 255) + ", " + Math.floor(y2 / canvas.height  * 255) + ", 0)";

		// var col = 'rgb('+
		//     Math.floor(Math.random()*256)+','+
		//     Math.floor(Math.random()*256)+','+
		//     Math.floor(Math.random()*256)+')'; //random color.

		var grd = ctx.createLinearGradient(x1, y1, x2, y2);
		grd.addColorStop(0, color.start);
		grd.addColorStop(1, color.end);
		ctx.strokeStyle = grd;

		ctx.beginPath(); // !!! very important.
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
		ctx.closePath();
	}

	function Rect(x1, y1, dx, dy){
		ctx.fillStyle = "#e8e8e8";
		ctx.fillRect(x1, y1, dx, dy);
	}

	function RadialGradient(x1, y1, x2, y2, r1, r2){
		var grd = ctx.createRadialGradient(x1, y1, r1, x2, y2, r2);
		grd.addColorStop(0, "#e8e8e8");
		grd.addColorStop(1, "#252525");

		ctx.fillStyle = grd;
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	}

	function Maze(){
		var unit = 23;
		offset = new Object(); //
		offset.x = canvas.width % unit / 2;
		offset.y = canvas.height % unit / 2;
		var cnt1 = 0,cnt2 = 0, tog = 1;
		for(var x = offset.x; x < canvas.width - offset.x; x += unit){
			for(var y = offset.y; y < canvas.height - offset.y; y += unit){
				var rand = Math.random();
				if(rand > 0.5) {
					Rect(x, y, unit, unit);
				}else{

				}
				tog = !tog;
			}
		}
		console.log(cnt1 + "  " + cnt2);
	}

	function Draw(clear){

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		// RadialGradient(canvas.width / 2, canvas.height / 2, canvas.width / 2, canvas.height / 2, canvas.height / 3, canvas.width);

		if(!clear) Maze();
		// else Text(canvas.width / 2 - 50, canvas.height / 2, "Click");
	
	}

	Draw(true);

	$("#maze").click(function(){

		Draw();
	
	});

</script>
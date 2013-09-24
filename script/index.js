$(function(){
	
	var can = document.getElementById("canvasRueda");
	var ctx = can.getContext('2d');
	
	ctx.beginPath();
	ctx.moveTo(0,0);
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#000000";
	
	var x = 0;
	var y = 0;
	
	for (y = 0; y<210; y+=5){
		ctx.lineTo(x,y);
		y+=5.5; x+=5;
		ctx.moveTo(x,y);
		x+=5;
	}
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.fillStyle = "rgba(255,255,255,0.4)";
	ctx.strokeStyle = "rgba(0,0,0,0.8)";
	ctx.lineWidth = 10;
	
	ctx.moveTo(226,216);
	ctx.arc(210, 216, 16, 0, Math.PI*2, true);
	ctx.stroke();
	ctx.moveTo(226,216);
	ctx.fill();
	ctx.closePath();
});

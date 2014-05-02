function drawBackground(ctx,width,height){
	//background
	ctx.fillStyle = "#33ACE0";
	ctx.fillRect(0,0,width,height);

	//road background
	ctx.beginPath();
	//top left
	ctx.moveTo(width / 3,0);
	//bottom left
	ctx.lineTo(0,height);
	//bottom right
	ctx.lineTo(width,height);
	//top right
	ctx.lineTo((width / 3) * 2,0);
	//close
	ctx.closePath();
	//color
	ctx.fillStyle = "#FC0D1B";
	//fill
	ctx.fill();
}

function Road(ctx,width,height,index){
	this.index = index;
	this.topPointLeft = width / 3;
	this.topPointRight = (width / 3) * 2;
	this.roadHeight = 150;
	this.p1x = this.topPointLeft;//top left point
	this.p2x = this.topPointLeft - this.roadHeight * this.index;//bottom left point
	this.q1x = this.topPointRight;//top right point
	this.q2x = this.topPointRight + this.roadHeight * this.index;//bottom right point
	this.slope = height / width;
	this.speed = 1;

	this.render = function(){
		//out of canvas
		if(this.p1x < 0){
			this.p1x = this.topPointLeft + this.roadHeight * this.index;
			this.p2x = this.topPointLeft;
			this.q1x = this.topPointRight - this.roadHeight * this.index;
			this.q2x = this.topPointRight;
		}else if(this.p2x > this.topPointLeft && this.speed < 0){//reverse
			this.p1x = 0;
			this.p2x = -this.roadHeight * this.index;
			this.q1x = width;
			this.q2x = width + this.roadHeight * this.index;
		}
		//move points
		this.p1x -= this.speed;
		this.q1x += this.speed;
		this.p2x -= this.speed;
		this.q2x += this.speed;


		ctx.beginPath();
		//top left point
		ctx.moveTo(this.p1x,-3 * this.slope * this.p1x + height);
		//bottom left point
		ctx.lineTo(this.p2x,-3 * this.slope * this.p2x + height);
		//bottom right point
		ctx.lineTo(this.q2x,3 * this.slope * this.q2x - 2 * height);
		//top right point
		ctx.lineTo(this.q1x,3 * this.slope * this.q1x - 2 * height);
		//close
		ctx.closePath();
			
		//select color
		switch(this.index % 2){
			case 0:
			     ctx.fillStyle = "#FDA4FD";
			     break;
			case 1:
			     ctx.fillStyle = "#3FB34F";
			     break;
			default:
			     break;
		}
			     
		//fill
		ctx.fill();
	}
}

function RoadSystems(ctx,width,height,intensity){
	this.roads = [];

	this.addRoad = function(index){
		this.roads.push(new Road(ctx,width,height,index));
	}

	while(intensity--){
		this.addRoad(intensity);
	}

	this.render = function(){
		ctx.save();

		drawBackground(ctx,width,height);
		
		for(var i = 0,road;road = this.roads[i];i++){
			road.render();
		}
		ctx.restore();
	}
}

function init(){
	var canvas = document.getElementById("c");

	//canvas check
	if(!canvas || !canvas.getContext){
		return false;
	}

	var ctx = canvas.getContext("2d");
	//canvas size
	var width = canvas.width = window.innerWidth;
	var height = canvas.height = window.innerHeight;


	//background
	drawBackground(ctx,width,height);

	//color intensity
	var INTENSITY = 3;
	var roadSystems = new RoadSystems(ctx,width,height,INTENSITY);

	//loop
	(function draw(){
		requestAnimationFrame(draw);
		roadSystems.render();
	})();

	//change speed
	document.onmousemove = function(e){
		var speedRatio = (e.x - window.innerWidth / 2) / (window.innerWidth / 2) * 5;
		for(var i = 0;i < roadSystems.roads.length;i++){
			var road = roadSystems.roads[i];

			road.speed = speedRatio;
		}
	}
}

init();

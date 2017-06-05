// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

var inc = 0.1;
var scl = 20;
var cols, rows;

var particle_count = 300;
var stroke_weight = 1;

var zoff = 0;

var fr;

var particles = [];

var flowfield;

var bg_color = 1;

function setup() {
	pixelDensity(1);
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
	cols = floor(width / scl);
	rows = floor(height / scl);
	fr = createP('');

	flowfield = new Array(cols * rows);

	for (var i = 0; i < particle_count; i++) {
		particles[i] = new Particle();
	}
	background(bg_color);
}


function keyTyped() {
	switch(key) {
		case 'y':
			background(bg_color);
			return;
		case '1':
			bg_color = 51;
			return;
		case '2':
			bg_color = "cyan";
			return;
		case 'z':1
			if (strokeWidth < 2) {
				return;
			}
			strokeWidth -= 1;
			return;
		case 'q':
			strokeWidth = randomGaussian(1,20);
			console.log("Stroke: " + strokeWidth);
			return;
	}
}


function draw() {
	var yoff = 0;
	for (var y = 0; y < rows; y++) {
		var xoff = 0;
		for (var x = 0; x < cols; x++) {
			var index = x + y * cols;
			var angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
			var v = p5.Vector.fromAngle(angle);
			v.setMag(1);
			flowfield[index] = v;
			xoff += inc;
			stroke(0, 50);

		}
		yoff += inc;

		zoff += 0.0003;
	}

	for (var i = 0; i < particles.length; i++) {
		particles[i].follow(flowfield);
		particles[i].update();
		particles[i].edges();
		particles[i].show();
	}

	fr.html(floor(frameRate()));
}


// Daniel Shiffman
// http://codingtra.in
// http://patreon.com/codingtrain
// Code for: https://youtu.be/BjoM9oKOAKY

function Particle() {
	this.pos = createVector(random(width), random(height));
	this.vel = createVector(0, 0);
	this.acc = createVector(0, 0);
	this.maxspeed = 4;
	this.h = 0;

	this.prevPos = this.pos.copy();

	this.update = function() {
		this.vel.add(this.acc);
		this.vel.limit(this.maxspeed);
		this.pos.add(this.vel);
		this.acc.mult(0);
	}

	this.follow = function(vectors) {
		var x = floor(this.pos.x / scl);
		var y = floor(this.pos.y / scl);
		var index = x + y * cols;
		var force = vectors[index];
		this.applyForce(force);
	}

	this.applyForce = function(force) {
		this.acc.add(force);
	}

	this.show = function() {
		stroke(this.getColor(this.h));
		this.h = this.h + 1;
		if (this.h > 255) {
			this.h = 0;
		}
		strokeWeight(stroke_weight);

		//ellipse(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);

		line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
		this.updatePrev();
	}

	this.updatePrev = function() {
		this.prevPos.x = this.pos.x;
		this.prevPos.y = this.pos.y;
	}

	this.edges = function() {
		if (this.pos.x > width) {
			this.pos.x = 0;
			this.updatePrev();
		}
		if (this.pos.x < 0) {
			this.pos.x = width;
			this.updatePrev();
		}
		if (this.pos.y > height) {
			this.pos.y = 0;
			this.updatePrev();
		}
		if (this.pos.y < 0) {
			this.pos.y = height;
			this.updatePrev();
		}

	}

	this.getColor = function(h) {
		return color(h, 255, 255, 25);
	}

}
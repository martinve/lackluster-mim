var mic, analyzer, fft;

var palettes = [
    ["black"],
    ["red", "white"],
    ["yellow", "black"],
    ["black", "blue", "red", "magenta", "green", "cyan", "yellow", "white"],
    ["blue", "black", "white"],
    ["yellow", "green", "red"],
    []
];

var palette;
var strokeWidth = 1;
var cap = "round";

var num_copies = 20;
var num_faces = 60;

var fade = 8;

var BG_color = 0;

var prevx = 0;
var prevy = 0;
var p_prevx = 0;
var p_prevy = 0;
 
var lining = false;
var lining_base = true;
var lining_particle = true;

var my_color;
var angle = 0;

is_random = false;



function setup() {
    createCanvas(windowWidth,windowHeight);
    background(0);
    pixelDensity(1);
    //strokeCap(ROUND); //Square
    strokeJoin(ROUND);
    noStroke();
}


function draw() {
	var f = 255 * (fade / 255.0) * (fade / 255.0);

    background(BG_color, f);
    translate(-width / 2, -height / 2);

    my_color = get_color();
    if (mouseIsPressed) {
        draw_line();
    } else {
        lining = false;
    }
}


function keyTyped() {
    switch(key) {
        case 'y':
            background(BG_color);
            return;
        case '1':
            palette = get_palette(true);
            return;
        case 'a':
            strokeWidth += 1;
            return;
        case 'z':
            if (strokeWidth < 2) {
                strokeWidth = 1;
                return;
            }
            strokeWidth -= 1;
            return;
        case 'q':
            strokeWidth = randomGaussian(1,20);
            console.log("Stroke: " + strokeWidth);
            return;
        case 'w':
            strokeWidth = 5;
            return;
        case 'x':
            strokeWidth = 1;
            return;
        case 's':
            strokeWidth = 2;
            return;
        case 'e':
            switchStrokeCap();
        break;
        case 'd':
            toggleRandom();
        break;
    }
}


function switchStrokeCap() {
   if (cap == "round") {
       strokeCap(SQUARE);
       cap = "square";
   } else {
       strokeCap(ROUND);
       cap = "round";
   }
}

function toggleRandom() {
    if (is_random === true) {
        is_random = false;
        return;
    } 
    is_random = true;
}



function get_palette(do_switch) {
    if (undefined == palette) {
        var index = random(1, palettes.length);
        palette = random(palettes);
        console.log("Initialized palette: ", palette);
    } else if (do_switch === true) {
        palette = random(palettes);
    }
    return palette;
}


function get_color() {
    if (palette == undefined) {
        get_palette();
    }
    if (palette.length > 0) {
	    return random(palette);
    }
    return color(random(0,255), random(0,255), random(0,255));
}

function get_stroke() {
    //return randomGaussian(1,20);
	//return 20;
    if (is_random) {
        return randomGaussian(1,20);
    }

	return strokeWidth;
}


function in_canvas() {
	return (mouseX >= 0 && mouseY >= 0 && mouseX <= width && mouseY <= height);
}

function draw_shape(x, y) {
	//ellipse(x, y, get_stroke());
    rect(x, y, get_stroke(), get_stroke());
}

function keyPressed() {
    get_palette();
	my_color = color(random(0,255), random(0,255), random(0,255), random(100,255));
}



function draw_point() {
    if (!in_canvas()) {
    	//return;
    }

    mx2 = mouseX - width / 2;
    my2 = mouseY - height / 2;

    var dist = sqrt(mx2 * mx2 + my2 * my2);
    var theta0 = (atan2(my2, mx2) + TWO_PI) % (TWO_PI);
    var realtheta0 = (atan2(my2, mx2) + PI) % PI;

    dist = dist * cos((realtheta0 + PI / num_faces) % (PI / num_faces * 2) - PI / num_faces) / cos((theta0 + PI / num_faces) % (PI / num_faces * 2) - PI / num_faces);

    noStroke();
    fill(my_color);

    for (var i = 0; i < num_copies; i++) {
        var theta = i * TWO_PI / num_copies;
        var xp = mx2 * cos(theta) - my2 * sin(theta);
        var yp = mx2 * sin(theta) + my2 * cos(theta);
        draw_shape(xp + width, yp + height);

    }


    prevx = mx2;
    prevy = my2;
    prevdist = dist;
    prevtheta0 = theta0;

}


function draw_line() {

    if (!lining) {
        draw_point();
        if (in_canvas()) {
        	lining = lining_base;
        }	
    } else {
        mx2 = mouseX - width / 2;
        my2 = mouseY - height / 2;

        var dist = sqrt(mx2 * mx2 + my2 * my2);
        var theta0 = (atan2(my2, mx2) + TWO_PI) % (TWO_PI);
        var realtheta0 = (atan2(my2, mx2) + PI) % PI;

        dist = dist * cos((realtheta0 + PI / num_faces) % (PI / num_faces * 2) - PI / num_faces) / cos((theta0 + PI / num_faces) % (PI / num_faces * 2) - PI / num_faces);
        //dist = dist*cos((realtheta0+PI/4)%(PI/2)-PI/4)/cos((theta0+PI/4)%(PI/2)-PI/4);

        
        strokeWeight(get_stroke());
        stroke(get_color());
        fill(get_color());

        for (var i = 0; i < num_copies; i++) {
            var theta = i * TWO_PI / num_copies;
            var xp = mx2 * cos(theta) - my2 * sin(theta);
            var yp = mx2 * sin(theta) + my2 * cos(theta);
            var xp2 = prevx * cos(theta) - prevy * sin(theta);
            var yp2 = prevx * sin(theta) + prevy * cos(theta);
            line(xp2 + width, yp2 + height, xp + width, yp + height);
        }

        prevx = mx2;
        prevy = my2;
        prevdist = dist;
        prevtheta0 = theta0;

        lining = lining_base;
    }
}




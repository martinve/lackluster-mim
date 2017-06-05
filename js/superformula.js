var t = 0;
var resolution;
var a, b, m, n1, n2, n3 = 0;

var mic, analyzer, fft;
var volume = 0;

/**
 * https://www.youtube.com/watch?v=u6arTXBDYhQ
 */

function setup() {
    createCanvas(windowWidth, windowHeight);
    background(20);
    noFill();
    stroke(255);
    strokeWeight(2);

    resolution = .1;

    mic = new p5.AudioIn();
    mic.start();
    mic.amp(volume);

    a = 55;
    b = 2;
    m = 6;
    n1 = 1;
    n2 = 0;
    n3 = 0;

    colorMode(HSB);
}

function draw() {
    background(0);

    translate(width/2, height/2);

    beginShape();

    var my_color = color(random(40,255), 127, 255, 10);

    stroke(my_color);

    for (var theta = 0; theta <= 2 * PI; theta += resolution) {
        m = random(6,12); //random();
        n2 = sin(t) * .5 + .5;
        n3 = sin(t) * .5 + .5;
        var rad = r(theta, a, b, m, n1, n2, n3);
        x = rad * cos(theta) * 50;
        y = rad * sin(theta) * 50;
        vertex(x, y);
    }
    endShape();

    t += 0; //mic.getLevel();
}

function r(theta, a, b, m, n1, n2, n3) {
    return pow(pow(abs(cos(m * theta / 4) / a), n2)
        + pow(abs(sin(m * theta / 4) / b), n3),
        (-1 / n1)
    );
}
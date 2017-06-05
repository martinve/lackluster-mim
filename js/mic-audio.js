var mic, analyzer, fft;
var volume = .1;


function preload() {
    //mic = loadSound('/assets/finlandia.mp3');
}

function setup() {
    mic = new p5.AudioIn();
    mic.start();
    mic.amp(volume);

    pixelDensity(1);

    var canvas = createCanvas(windowWidth, windowHeight);
    //canvas.mouseClicked(togglePlay);

    analyzer = new p5.Amplitude();
    analyzer.setInput(mic);

    fft = new p5.FFT(0.5);
    fft.setInput(mic);

    noSmooth();
}

function draw() {

    background('#000');

    var volume = mic.getLevel();

    if (height * 5 * volume > 200) {
        background('blue');
    }

    drawVolume(volume);

    var spectrum = fft.analyze();
    drawSpectrum(spectrum);

    var waveform = fft.waveform();
    drawWaveForm(waveform);

    strokeWeight(0);
    text(volume, 10, 10);
}


function drawVolume(volume) {

    fill("cyan");
    strokeWeight(0);

    var min_size = 0;
    var tolerance = height * 5;
    var radius = min_size + tolerance * volume;

    ellipse(width/2, height/2, radius, radius);
}



function drawWaveForm(waveform) {

    var stroke_weight = 6;

    noFill();
    beginShape();
    stroke("yellow");


    strokeWeight(stroke_weight);
    for (var i = 0; i< waveform.length; i++){
        var x = map(i, 0, waveform.length, 0, width);
        var y = map( waveform[i], -1, 1, 0, height / 2);
        vertex(x,y);
    }
    endShape();
}



function drawSpectrum(spectrum) {
    noStroke();
    fill("magenta");


    var offset = 30;
    for (var i = 0; i< spectrum.length; i++){
        var x = map(i, 0, spectrum.length / 2, 0, width);
        var h = offset -height + map(spectrum[i], 0, 255, height, 0);
        rect(x * 4, height, width * 5 / spectrum.length , h )
    }
}


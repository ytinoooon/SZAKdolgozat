// Simple p5.js animation for the hero section
function setup() {
    const canvas = createCanvas(windowWidth, windowHeight);
    canvas.parent('hero-canvas');
    canvas.style('position', 'absolute');
    canvas.style('top', '0');
    canvas.style('left', '0');
    canvas.style('z-index', '0');
    colorMode(HSB, 360, 100, 100, 1);
    noStroke();
}

function draw() {
    clear();
    for (let i = 0; i < 50; i++) {
        const x = noise(i, frameCount * 0.01) * width;
        const y = noise(i + 100, frameCount * 0.01) * height;
        const size = noise(i + 200, frameCount * 0.01) * 50 + 10;
        const hue = (noise(i + 300, frameCount * 0.01) * 60 + 200) % 360;
        
        fill(hue, 70, 90, 0.6);
        circle(x, y, size);
    }
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}
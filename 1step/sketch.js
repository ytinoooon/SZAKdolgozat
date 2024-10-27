let entities = [];
let births = 0;
let deaths = 0;

function setup() {
    createCanvas(1470, 690);
    frameRate(5);
    for (let i = 0; i < 10; i++) {
        // chrom tomb [[red, blue, green], radius, v_radius, speed, longevaty, replicate]
        entities.push(new entity(random(1450), random(670), [[255, 150, 0], 30, 15, 3, 20, 5]));
        births += 1;
    }
}

function draw() {
    background(100);
    console.log(entities)
    text("Alive: " + String(births - deaths), 30, 40);
    text("Births: " + String(births), 30, 60);
    text("Deaths: " + String(deaths), 30, 80);

    // Loop through entities
    for (let i = entities.length - 1; i >= 0; i--) {
        let actual = entities[i];
        actual.show();
        actual.age();

        // Die if timealive exceeds longevaty
        if (actual.timealive > actual.longevaty && actual.alive) {
            actual.die();
            deaths += 1;
        }

        // Replicate with a chance based on the replicate rate
        if (actual.alive && random(100) <= actual.replicate) {
            let offspring = new entity(random(1460), random(680), actual.chrom);
            mutation(offspring.chrom);
            entities.push(offspring);
            births += 1;
        }

        // Remove dead entities
        if (!actual.alive) {
            entities.splice(i, 1); // remove the entity at index i
        }
    }
}


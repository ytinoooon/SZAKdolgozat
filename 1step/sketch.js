let entities = [];
let foods = [];
let births = 0;
let deaths = 0;

function setup() {
    createCanvas(1470, 690);
    frameRate(30); // smoother frame rate
    for (let i = 0; i < 15; i++) {
        entities.push(new entity(random(1450), random(670), [[random(255), random(255), random(255)], 30, 100, 5, 100, 1]));
        births++;
    }

    for (let i = 0; i < 30; i++) {
        foods.push(new food(random(width), random(height)));
    }
}

function draw() {
    background(100);
    fill(255);
    text("Alive: " + (births - deaths), 30, 40);
    text("Births: " + births, 30, 60);
    text("Deaths: " + deaths, 30, 80);

    // Show foods
    for (let i = 0; i < foods.length; i++) {
        foods[i].show();
    }

    // Handle entities
    for (let i = entities.length - 1; i >= 0; i--) {
        let actual = entities[i];
        if (!actual.alive) {
            entities.splice(i, 1);
            continue;
        }

        actual.age();
        actual.show();

        // Detect nearby food
        let foodInSight = [];
        for (let j = 0; j < foods.length; j++) {
            if (actual.in_vision(foods[j].x, foods[j].y)) {
                foodInSight.push(foods[j]);
                foods[j].color = color(225, 225, 225);
            }
        }

        // Movement decision
        if (foodInSight.length > 0) {
            actual.move(foodInSight[0].x, foodInSight[0].y);
        } else if (actual.hungry > 0 && foods.length > 0) {
            let closest = null;
            let minDist = Infinity;
            for (let j = 0; j < foods.length; j++) {
                let dx = foods[j].x - actual.x;
                let dy = foods[j].y - actual.y;
                let dist = dx * dx + dy * dy;
                if (dist < minDist) {
                    minDist = dist;
                    closest = foods[j];
                }
            }
            if (closest) {
                actual.move(closest.x, closest.y);
            }
        } else {
            actual.move(actual.x + random(-20, 20), actual.y + random(-20, 20));
        }

        // Eating
        for (let j = 0; j < foods.length; j++) {
            if (actual.eating(foods[j].x, foods[j].y) && foods[j].capacity > 0) {
                actual.hungry = max(0, actual.hungry - 20);
                foods[j].capacity -= 20;
                if (foods[j].capacity <= 0) {
                    foods.splice(j, 1);
                }
                actual.longevaty += 5;
                break;
            }
        }

        if(actual.hungry >= 10){
            actual.longevaty -= 1
        }

        // Die if old
        if (actual.timealive > actual.longevaty) {
            actual.die();
            deaths++;
            continue;
        }

        // Replication
        if (actual.alive && random(100) < actual.replicate) {
            let clone = new entity(
                actual.x + random(-40, 40),
                actual.y + random(-40, 40),
                structuredClone(actual.chrom)
            );
            mutation(clone.chrom);
            entities.push(clone);
            births++;
        }

        // Add hunger increase over time
        actual.hungry += 0.5;
    }

    // Grow more food slowly
    if (frameCount % 10 === 0 && foods.length < 100) {
        foods.push(new food(random(width), random(height)));
    }
}

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
    displayStats();

    showAllFood();
    handleEntities();

    growFoodSlowly();
}

// --- Helper Functions ---

function displayStats() {
    fill(255);
    text("Alive: " + (births - deaths), 30, 40);
    text("Births: " + births, 30, 60);
    text("Deaths: " + deaths, 30, 80);
}

function showAllFood() {
    for (let i = 0; i < foods.length; i++) {
        foods[i].show();
    }
}

function handleEntities() {
    for (let i = entities.length - 1; i >= 0; i--) {
        let actual = entities[i];
        if (!actual.alive) {
            entities.splice(i, 1);
            continue;
        }

        actual.age();
        actual.show();
        if (this.cooldown > 0) this.cooldown--;

        let foodInSight = detectNearbyFood(actual);

        decideMovement(actual, foodInSight);
        handleEating(actual);
        increaseHunger(actual);
        checkDeath(actual, i);
        attemptReproduction(actual);
    }
}

function detectNearbyFood(actual) {
    let foodInSight = [];
    for (let j = 0; j < foods.length; j++) {
        if (actual.in_vision(foods[j].x, foods[j].y)) {
            foodInSight.push(foods[j]);
            foods[j].color = color(225, 225, 225);
        }
    }
    return foodInSight;
}

function decideMovement(actual, foodInSight) {
    if (foodInSight.length > 0) {
        actual.move(foodInSight[0].x, foodInSight[0].y);
    } else if (actual.hungry > 0 && foods.length > 0) {
        let closest = findClosestFood(actual);
        if (closest) {
            actual.move(closest.x, closest.y);
        }
    } else {
        actual.move(actual.x + random(-20, 20), actual.y + random(-20, 20));
    }
}

function findClosestFood(actual) {
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
    return closest;
}

function handleEating(actual) {
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
}

function increaseHunger(actual) {
    if (actual.hungry >= 10) {
        actual.longevaty -= 1;
    }
    actual.hungry += 0.5;
}

function checkDeath(actual, index) {
    if (actual.timealive > actual.longevaty) {
        actual.die();
        deaths++;
    }
}

function attemptReproduction(actual) {
    if (actual.alive && random(100) < actual.replicate) {
        for (let k = 0; k < entities.length; k++) {
            let mate = entities[k];
            if (abs(actual.x - mate.x) > 200 || abs(actual.y - mate.y) > 200) continue;
            if (
                mate !== actual && mate.alive &&
                dist(actual.x, actual.y, mate.x, mate.y) < 50 &&
                mate.timealive > 5 && actual.timealive > 5
            ) {
                let child_chrom = crossover(actual.chrom, mate.chrom);
                mutation(child_chrom);
                let child_x = (actual.x + mate.x) / 2 + random(-10, 10);
                let child_y = (actual.y + mate.y) / 2 + random(-10, 10);
                entities.push(new entity(child_x, child_y, child_chrom));
                births += 1;
                break;
            }
        }
    }
}

function growFoodSlowly() {
    if (frameCount % 2 === 0 && foods.length < 100) {
        foods.push(new food(random(width), random(height)));
    }
}

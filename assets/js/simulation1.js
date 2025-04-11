// ================ Simulation Constants ================
const SIMULATION_CONFIG = {
    canvasWidth: window.innerWidth > 1200 ? 1100 : window.innerWidth - 100,
    canvasHeight: 500,
    frameRate: 30,
    foodSpawnRate: 5,  // 1-10 scale
    mutationRate: 5,   // 1-10 scale
    initialPopulation: 15
};

// ================ Simulation State ================
let simulationState = {
    isRunning: true,
    speed: 1,
    population: [],
    foods: [],
    stats: {
        currentPopulation: 0,
        generations: 0,
        avgSize: 0,
        avgSpeed: 0,
        populationHistory: [],
        traitHistory: []
    },
    charts: {
        populationChart: null,
        traitsChart: null
    }
};

// ================ DOM Elements ================
const domElements = {
    canvasContainer: document.getElementById('simulation-canvas'),
    pauseButton: document.getElementById('sim-pause'),
    speedButton: document.getElementById('sim-speed'),
    resetButton: document.getElementById('sim-reset'),
    foodRateInput: document.getElementById('food-rate'),
    mutationRateInput: document.getElementById('mutation-rate'),
    initialPopInput: document.getElementById('initial-pop'),
    foodRateValue: document.getElementById('food-rate-value'),
    mutationRateValue: document.getElementById('mutation-rate-value'),
    initialPopValue: document.getElementById('initial-pop-value'),
    currentPopDisplay: document.getElementById('current-pop'),
    generationsDisplay: document.getElementById('generations'),
    avgSizeDisplay: document.getElementById('avg-size'),
    avgSpeedDisplay: document.getElementById('avg-speed'),
    tabButtons: document.querySelectorAll('.tab-button'),
    tabContents: document.querySelectorAll('.tab-content')
};

// ================ P5.js Sketch ================
function setup() {
    let canvas = createCanvas(SIMULATION_CONFIG.canvasWidth, SIMULATION_CONFIG.canvasHeight);
    canvas.parent('simulation-canvas');
    frameRate(SIMULATION_CONFIG.frameRate);
    
    // Initialize simulation
    initializeSimulation();
    
    // Initialize charts
    initializeCharts();
}

function draw() {
    if (!simulationState.isRunning) return;
    
    background(240);
    
    // Update and display food
    updateFood();
    
    // Update and display entities
    updateEntities();
    
    // Update statistics
    updateStatistics();
    
    // Occasionally add new food
    if (frameCount % Math.floor(60 / SIMULATION_CONFIG.foodSpawnRate) === 0) {
        addFood();
    }
}

// ================ Simulation Functions ================
function initializeSimulation() {
    // Clear existing entities and food
    simulationState.population = [];
    simulationState.foods = [];
    
    // Create initial population
    for (let i = 0; i < SIMULATION_CONFIG.initialPopulation; i++) {
        addEntity(random(width), random(height));
    }
    
    // Create initial food
    for (let i = 0; i < 30; i++) {
        addFood();
    }
    
    // Reset stats
    simulationState.stats = {
        currentPopulation: SIMULATION_CONFIG.initialPopulation,
        generations: 0,
        avgSize: 30,
        avgSpeed: 5,
        populationHistory: [],
        traitHistory: []
    };
    
    updateUI();
}

function addEntity(x, y, parentChromosome = null) {
    let chromosome;
    
    if (parentChromosome) {
        // Create offspring with mutation
        chromosome = mutateChromosome(parentChromosome);
    } else {
        // Create new random entity
        chromosome = [
            [random(255), random(255), random(255)], // Color
            random(20, 40),                           // Size
            random(50, 150),                          // Vision radius
            random(1, 10),                            // Speed
            random(50, 200),                          // Longevity
            random(0.5, 2)                            // Reproduction rate
        ];
    }
    
    simulationState.population.push(new Entity(x, y, chromosome));
}

function addFood() {
    simulationState.foods.push(new Food(random(width), random(height)));
}

function mutateChromosome(chromosome) {
    // Deep copy the chromosome
    let newChrom = JSON.parse(JSON.stringify(chromosome));
    
    // Apply mutations based on mutation rate
    const mutationIntensity = SIMULATION_CONFIG.mutationRate / 10;
    
    // Color mutation
    newChrom[0][0] = constrain(newChrom[0][0] + random(-20 * mutationIntensity, 20 * mutationIntensity), 0, 255);
    newChrom[0][1] = constrain(newChrom[0][1] + random(-20 * mutationIntensity, 20 * mutationIntensity), 0, 255);
    newChrom[0][2] = constrain(newChrom[0][2] + random(-20 * mutationIntensity, 20 * mutationIntensity), 0, 255);
    
    // Other traits mutation
    newChrom[1] = constrain(newChrom[1] + random(-5 * mutationIntensity, 5 * mutationIntensity), 10, 60);
    newChrom[2] = constrain(newChrom[2] + random(-20 * mutationIntensity, 20 * mutationIntensity), 20, 200);
    newChrom[3] = constrain(newChrom[3] + random(-2 * mutationIntensity, 2 * mutationIntensity), 1, 15);
    newChrom[4] = constrain(newChrom[4] + random(-30 * mutationIntensity, 30 * mutationIntensity), 20, 300);
    newChrom[5] = constrain(newChrom[5] + random(-0.5 * mutationIntensity, 0.5 * mutationIntensity), 0.1, 3);
    
    return newChrom;
}

function updateFood() {
    for (let i = simulationState.foods.length - 1; i >= 0; i--) {
        simulationState.foods[i].display();
        
        // Remove eaten food
        if (simulationState.foods[i].capacity <= 0) {
            simulationState.foods.splice(i, 1);
        }
    }
}

function updateEntities() {
    for (let i = simulationState.population.length - 1; i >= 0; i--) {
        const entity = simulationState.population[i];
        
        if (!entity.alive) {
            simulationState.population.splice(i, 1);
            continue;
        }
        
        entity.update();
        entity.display();
        
        // Check for eating
        for (let j = simulationState.foods.length - 1; j >= 0; j--) {
            if (entity.eat(simulationState.foods[j])) {
                simulationState.foods[j].capacity -= 20;
                break;
            }
        }
        
        // Check for reproduction
        if (entity.shouldReproduce()) {
            for (let other of simulationState.population) {
                if (other !== entity && entity.canReproduceWith(other)) {
                    addEntity(
                        (entity.x + other.x) / 2,
                        (entity.y + other.y) / 2,
                        crossover(entity.chromosome, other.chromosome)
                    );
                    break;
                }
            }
        }
        
        // Check for death
        if (entity.shouldDie()) {
            entity.alive = false;
        }
    }
}

function crossover(chrom1, chrom2) {
    // Simple crossover - blend traits
    let newChrom = [];
    
    // Color blending
    newChrom.push([
        (chrom1[0][0] + chrom2[0][0]) / 2,
        (chrom1[0][1] + chrom2[0][1]) / 2,
        (chrom1[0][2] + chrom2[0][2]) / 2
    ]);
    
    // Other traits - random inheritance
    for (let i = 1; i < chrom1.length; i++) {
        newChrom.push(random() < 0.5 ? chrom1[i] : chrom2[i]);
    }
    
    return newChrom;
}

// ================ Entity Class ================
class Entity {
    constructor(x, y, chromosome) {
        this.x = x;
        this.y = y;
        this.chromosome = chromosome;
        this.color = chromosome[0];
        this.size = chromosome[1];
        this.visionRadius = chromosome[2];
        this.speed = chromosome[3];
        this.longevity = chromosome[4];
        this.reproductionRate = chromosome[5];
        this.energy = 100;
        this.age = 0;
        this.alive = true;
    }
    
    display() {
        fill(this.color);
        noStroke();
        circle(this.x, this.y, this.size * 2);
    }
    
    update() {
        this.age++;
        this.energy -= 0.1;
        
        // Find nearest food
        let nearestFood = null;
        let minDist = Infinity;
        
        for (let food of simulationState.foods) {
            const d = dist(this.x, this.y, food.x, food.y);
            if (d < this.visionRadius && d < minDist) {
                minDist = d;
                nearestFood = food;
            }
        }
        
        // Move toward food or wander
        if (nearestFood) {
            const angle = atan2(nearestFood.y - this.y, nearestFood.x - this.x);
            this.x += cos(angle) * this.speed;
            this.y += sin(angle) * this.speed;
        } else {
            this.x += random(-this.speed, this.speed);
            this.y += random(-this.speed, this.speed);
        }
        
        // Constrain to canvas
        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);
    }
    
    eat(food) {
        const d = dist(this.x, this.y, food.x, food.y);
        if (d < this.size) {
            this.energy = min(200, this.energy + 20);
            return true;
        }
        return false;
    }
    
    shouldReproduce() {
        return (
            this.alive &&
            this.energy > 150 &&
            random() < this.reproductionRate / 100
        );
    }
    
    canReproduceWith(other) {
        const d = dist(this.x, this.y, other.x, other.y);
        return (
            other.alive &&
            other !== this &&
            d < 50 &&
            other.energy > 150
        );
    }
    
    shouldDie() {
        return this.age > this.longevity || this.energy <= 0;
    }
}

// ================ Food Class ================
class Food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = 6;
        this.capacity = 100;
    }
    
    display() {
        fill(100, 150, 255);
        noStroke();
        circle(this.x, this.y, this.size);
    }
}

// ================ Statistics & Charts ================
function updateStatistics() {
    const stats = simulationState.stats;
    const popCount = simulationState.population.length;
    
    // Update basic stats
    stats.currentPopulation = popCount;
    
    // Calculate averages
    let totalSize = 0;
    let totalSpeed = 0;
    
    for (let entity of simulationState.population) {
        totalSize += entity.size;
        totalSpeed += entity.speed;
    }
    
    stats.avgSize = popCount > 0 ? totalSize / popCount : 0;
    stats.avgSpeed = popCount > 0 ? totalSpeed / popCount : 0;
    
    // Record history every 10 frames
    if (frameCount % 10 === 0) {
        stats.populationHistory.push({
            x: frameCount,
            y: popCount
        });
        
        stats.traitHistory.push({
            x: frameCount,
            size: stats.avgSize,
            speed: stats.avgSpeed
        });
        
        // Keep history manageable
        if (stats.populationHistory.length > 100) {
            stats.populationHistory.shift();
            stats.traitHistory.shift();
        }
        
        // Update charts
        updateCharts();
    }
    
    // Update UI
    updateUI();
}

function initializeCharts() {
    const ctx1 = document.getElementById('population-chart').getContext('2d');
    const ctx2 = document.getElementById('traits-chart').getContext('2d');
    
    simulationState.charts.populationChart = new Chart(ctx1, {
        type: 'line',
        data: {
            datasets: [{
                label: 'Population',
                data: [],
                borderColor: 'rgba(75, 192, 192, 1)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Population'
                    }
                }
            }
        }
    });
    
    simulationState.charts.traitsChart = new Chart(ctx2, {
        type: 'line',
        data: {
            datasets: [
                {
                    label: 'Average Size',
                    data: [],
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    tension: 0.4,
                    yAxisID: 'y'
                },
                {
                    label: 'Average Speed',
                    data: [],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    tension: 0.4,
                    yAxisID: 'y1'
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false
            },
            scales: {
                x: {
                    type: 'linear',
                    title: {
                        display: true,
                        text: 'Time'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Size'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Speed'
                    },
                    grid: {
                        drawOnChartArea: false
                    }
                }
            }
        }
    });
}

function updateCharts() {
    const stats = simulationState.stats;
    const popChart = simulationState.charts.populationChart;
    const traitsChart = simulationState.charts.traitsChart;
    
    // Update population chart
    popChart.data.datasets[0].data = stats.populationHistory;
    popChart.update();
    
    // Update traits chart
    traitsChart.data.datasets[0].data = stats.traitHistory.map(d => ({x: d.x, y: d.size}));
    traitsChart.data.datasets[1].data = stats.traitHistory.map(d => ({x: d.x, y: d.speed}));
    traitsChart.update();
}

// ================ UI Functions ================
function updateUI() {
    const stats = simulationState.stats;
    
    // Update stat displays
    domElements.currentPopDisplay.textContent = stats.currentPopulation;
    domElements.generationsDisplay.textContent = stats.generations;
    domElements.avgSizeDisplay.textContent = stats.avgSize.toFixed(1);
    domElements.avgSpeedDisplay.textContent = stats.avgSpeed.toFixed(1);
    
    // Update parameter displays
    domElements.foodRateValue.textContent = SIMULATION_CONFIG.foodSpawnRate;
    domElements.mutationRateValue.textContent = SIMULATION_CONFIG.mutationRate;
    domElements.initialPopValue.textContent = SIMULATION_CONFIG.initialPopulation;
}

// ================ Event Listeners ================
function setupEventListeners() {
    // Control buttons
    domElements.pauseButton.addEventListener('click', togglePause);
    domElements.speedButton.addEventListener('click', cycleSpeed);
    domElements.resetButton.addEventListener('click', resetSimulation);
    
    // Parameter sliders
    domElements.foodRateInput.addEventListener('input', (e) => {
        SIMULATION_CONFIG.foodSpawnRate = parseInt(e.target.value);
        updateUI();
    });
    
    domElements.mutationRateInput.addEventListener('input', (e) => {
        SIMULATION_CONFIG.mutationRate = parseInt(e.target.value);
        updateUI();
    });
    
    domElements.initialPopInput.addEventListener('input', (e) => {
        SIMULATION_CONFIG.initialPopulation = parseInt(e.target.value);
        updateUI();
    });
    
    // Tab buttons
    domElements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
}

function togglePause() {
    simulationState.isRunning = !simulationState.isRunning;
    domElements.pauseButton.innerHTML = simulationState.isRunning ? 
        '<i class="fas fa-pause"></i> Pause' : 
        '<i class="fas fa-play"></i> Resume';
}

function cycleSpeed() {
    simulationState.speed = (simulationState.speed % 3) + 1;
    frameRate(SIMULATION_CONFIG.frameRate * simulationState.speed);
    
    const speedLabels = ['Normal', 'Fast', 'Very Fast'];
    domElements.speedButton.innerHTML = `<i class="fas fa-tachometer-alt"></i> ${speedLabels[simulationState.speed - 1]}`;
}

function resetSimulation() {
    initializeSimulation();
    simulationState.isRunning = true;
    domElements.pauseButton.innerHTML = '<i class="fas fa-pause"></i> Pause';
}

function switchTab(tabId) {
    // Update button states
    domElements.tabButtons.forEach(button => {
        if (button.getAttribute('data-tab') === tabId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update content visibility
    domElements.tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// ================ Initialization ================
window.addEventListener('load', () => {
    setupEventListeners();
    updateUI();
});

// Make p5.js functions global for HTML integration
window.togglePause = togglePause;
window.cycleSpeed = cycleSpeed;
window.resetSimulation = resetSimulation;
window.switchTab = switchTab;
let entities = [];
let maxEntities = 20;
let births = 0;
let deaths = 0;
let birth_rate = 30;
let death_rate = 50;
function setup() {
    createCanvas(1000,500);
    frameRate(5);
    for(let i = 0; i < maxEntities; i++){
        entities[i] = new entity(cos(i)*200+500,sin(i)*200+250);
    }
}
  
function draw() {
    background(100);
    text("Alive: "+String(births-deaths), 30, 40); 
    text("Births: "+String(births), 30, 60); 
    text("Deaths: "+String(deaths), 30, 80); 
    text("Birth rate: "+String(birth_rate), 30, 100);
    text("Death rate: "+String(death_rate), 30, 120);

    for(let i = 0; i < maxEntities; i++){
        if(entities[i].alive) {
            entities[i].show();
        }
        if(random(entities[i].barr) && !entities[i].alive) { 
            entities[i].alive = true;
            births += 1;
        } 
        if(random(entities[i].darr) && entities[i].alive) {
            entities[i].alive = false;
            deaths += 1;
        }
        
    }

}


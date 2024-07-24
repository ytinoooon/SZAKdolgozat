let entities = [];
let orangealive = 0;
let births = 0;
let deaths = 0;
let birth_rate = 100;
function sign(x) {
    return x === 0 ? 0 : x > 0 ? 1 : -1;
}
function setup() {
    createCanvas(1470,690);
    frameRate(5);
    for(let i = 0; i<5;i++){
        let k = random(i)*2;
        let x = 400 * pow(abs(cos(k)), 2/10) * sign(cos(k))+500;
        let y = 220 * pow(abs(sin(k)), 2/10) * sign(sin(k))+250;
        console.log(x,y);
        entities[i] = new entity(x,y,[5,5,5,5,5,5],"lightgreen");
        entities[i].alive = true;
        births += 1; 
    }
}

function draw() {
    background(100);
    text("Alive: "+String(births-deaths), 30, 40); 
    text("Births: "+String(births), 30, 60); 
    text("Deaths: "+String(deaths), 30, 80); 
    // text("OrangeAlive: "+String(orangealive), 30, 100); 


    for(let i = 0; i < entities.length; i++){
        entities[i].show();
        entities[i].age();
        if(entities[i].timealive > random(15) && entities[i].alive){
            entities[i].die();
            deaths += 1;
            if(entities[i].color == "orange"){
                orangealive =- 1;
            }
        }
        if(entities[i].alive && random(arr(entities[i].raplicate))){
            entities.push(new entity(random(1460),random(680),entities[i].chrom,"orange"));
            entities[entities.length-1].alive = true;
            births += 1;
            orangealive += 1; 
        }
    }
    if(random(arr(birth_rate))){
        entities.push(new entity(random(1460),random(680),[5,5,5,5,5,5],"lightgreen"));
        entities[entities.length-1].alive = true;
        births += 1;

    }
    for(let i = 0; i<entities.length;i++){
        if(!entities[i].alive){
            let spliced = entities.splice(i, 1);
        }    
    }
 }

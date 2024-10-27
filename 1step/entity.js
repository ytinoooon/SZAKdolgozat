
function mutation(arr) {
    arr[0][0] = random(255);
    arr[0][1] = random(255);
    arr[0][2] = random(255);
    arr[1] = random(10, 30); // limit radius range
    arr[2] = random(10, 30); // limit v_radius range
    arr[3] = random(1, 10);  // limit speed range
    arr[4] = random(10, 30); // limit longevaty range
    arr[5] = random(1, 10);  // limit replicate rate range
}

// chrom tomb [[red,blue,green],radius,v_radius,speed,longevaty,replicate]
class entity {
    constructor(x,y,chrom) {
        this.id = -1;
        this.x = x;
        this.y = y;
        this.alive = true;
        this.timealive = 0; 
        this.chrom = JSON.parse(JSON.stringify(chrom));
        this.color = this.chrom[0]; //express color as an array and turn it into hex 
        this.radius = this.chrom[1];
        this.v_radius = this.chrom[2];
        this.speed = this.chrom[3];
        this.longevaty = this.chrom[4];
        this.replicate = this.chrom[5];
    }
    show() {
        if(this.alive){
            noStroke();
            fill(this.color[0],this.color[1],this.color[2]);
            circle(this.x,this.y,this.radius);
        }
    }
    age(){
        if(this.alive){
            this.timealive+= 1;
        }
    }
    die(){
        if(this.alive){
            this.alive = false;
        }
    }
}

class food {
    constructor(x,y) {
        this.x = x;
        this.y = y;
        this.r = 6;
    }
    show() {
        noStroke();
        fill(color(300,170,137))
        circle(this.x,this.y,this.r);
    }
}

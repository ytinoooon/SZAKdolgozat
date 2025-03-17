function mutation(arr) {
    arr[0][0] = arr[0][0]+random(-10, 10);
    arr[0][1] = arr[0][1]+random(-10, 10);
    arr[0][2] = arr[0][2]+random(-10, 10);
    arr[1] = arr[1]+random(-2, 2); // limit radius range
    arr[2] = arr[2]+random(-3, 3); // limit v_radius range
    arr[3] = arr[3]+random(-3, 3);  // limit speed range
    arr[4] = arr[4]; // limit longevaty range
    arr[5] = arr[5];  // limit replicate rate range
}

// chrom tomb [[red,blue,green],radius,v_radius,speed,longevaty,replicate]
class entity {
    constructor(x,y,chrom) {
        this.id = -1;
        this.x = x;
        this.y = y;
        this.alive = true;
        this.timealive = 0; 
        this.chrom = chrom;
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
    move(target_x,target_y) {
        let dx = target_x - this.x;
        let dy = target_y - this.y;
        let dist = Math.sqrt(dx*dx+dy*dy)
        if(dist < this.speed){
            this.x = target_x;
            this.y = target_y;
            return;
        }
        const angle = Math.atan2(dy,dx);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
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
        this.capacity = 100;
    }

    show() {
        noStroke();
        fill(color(300,170,137))
        circle(this.x,this.y,this.r);
    }
}



function arr(num) {
    var a = [];
    for(let i = 0;i < 100;i++) {
        if(i < num) {
            a[i] = true;
        } else { 
            a[i] = false;
        }
    }
    return a;
}
// chrom tomb [[red,blue,green],radius,v_radius,speed,longevaty,replicate]
                  

class entity {
    constructor(x,y,chrom) {
        this.x = x;
        this.y = y;
        this.alive = false;
        this.time_alive = 0; 
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
            fill(this.color);
            circle(this.x,this.y,this.radius);
        }
    }
    fed(){ 
        timealive -= 1;
    }
    age(){
        if(this.alive){
            this.timealive += 1;
            this.radius += 0.5;
        }
    }
    die(){
        if(this.alive){
            this.alive = false;
        }
    }
    
}

// class food {
//     constructor(x,y) {
//         this.x = x;
//         this.y = y;
//         this.r = 6;
//     }
//     show() {
//         noStroke();
//         fill(color(300,170,137))
//         circle(this.x,this.y,this.r);
//     }
// }

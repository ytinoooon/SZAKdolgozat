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

class entity {
    constructor(x,y,chrom,color) {
        this.x = x;
        this.y = y;
        this.raplicate = 8;
        this.radius = 10;
        this.alive = false;
        this.timealive = 0;
        this.chrom = chrom;
        this.color = color;
    }
    show() {
        if(this.alive){
            noStroke();
            fill(this.color);
            circle(this.x,this.y,this.radius);
        }
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

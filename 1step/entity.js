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
    constructor(x,y,b,d) {
        this.x = x;
        this.y = y;
        this.radius = 8;
        this.b = birth_rate ;
        this.barr = arr(this.b);
        this.d = death_rate;
        this.darr = arr(this.d);
        this.alive = false;
        this.timealive =0;
        this.acolor= 255;
        this.bcolor=0;
        this.ccolor=0;
        this.col=color(0, 0, 0);
    }
    show() {
        noStroke();
        this.col=color(this.acolor, this.bcolor, this.ccolor);
        fill(this.col);
        circle(this.x,this.y,this.radius);
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
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
        this.radius = 15;
        this.b = birth_rate ;
        this.barr = arr(this.b);
        this.d = death_rate;
        this.darr = arr(this.d);
        this.alive = false;
    }
    show() {
        noStroke();
        fill("#CBEFB6")
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
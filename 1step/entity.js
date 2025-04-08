function mutation(arr) {
    arr[0][0] = constrain(arr[0][0] + random(-10, 10), 0, 255);
    arr[0][1] = constrain(arr[0][1] + random(-10, 10), 0, 255);
    arr[0][2] = constrain(arr[0][2] + random(-10, 10), 0, 255);
    arr[1] = constrain(arr[1] + random(-5, 5), 10, 60);
    arr[2] = constrain(arr[2] + random(-10, 10), 20, 150);
    arr[3] = constrain(arr[3] + random(-1, 1), 1, 10);
    arr[4] = constrain(arr[4] + random(-10, 10), 20, 300);
    // arr[5] = constrain(arr[5] + random(-0.5, 0.5), 0, 5);
}

class entity {
    constructor(x, y, chrom) {
        this.x = x;
        this.y = y;
        this.alive = true;
        this.timealive = 0;
        this.chrom = chrom;
        this.color = this.chrom[0];
        this.radius = this.chrom[1];
        this.v_radius = this.chrom[2];
        this.speed = this.chrom[3];
        this.longevaty = this.chrom[4];
        this.replicate = this.chrom[5];
        this.hungry = 0;
    }

    show() {
        if (this.alive) {
            fill(this.color[0], this.color[1], this.color[2]);
            noStroke();
            circle(this.x, this.y, this.radius * 2);
        }
    }

    age() {
        if (this.alive) this.timealive++;
    }

    move(tx, ty) {
        let dx = tx - this.x;
        let dy = ty - this.y;
        let dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.speed) {
            this.x = tx;
            this.y = ty;
            return;
        }
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
        this.x = constrain(this.x, 0, width);
        this.y = constrain(this.y, 0, height);
    }

    in_vision(x, y) {
        let dx = x - this.x;
        let dy = y - this.y;
        return dx * dx + dy * dy <= (this.v_radius + this.radius) ** 2;
    }

    eating(x, y) {
        let dx = x - this.x;
        let dy = y - this.y;
        return dx * dx + dy * dy <= this.radius ** 2;
    }

    die() {
        this.alive = false;
    }
}

class food {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.r = 6;
        this.color = "blue";
        this.capacity = 100;
    }

    show() {
        fill(this.color);
        noStroke();
        circle(this.x, this.y, this.r);
    }
}

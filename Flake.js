function Flake(mesh) {
    this.x = this.y = this.angle = this.cw = this.ch = this.imgIdx = 0;
    this.imgRange = 0;
    this.size = 0;
    this.imgSize = 0;
    this.angleSign = 1;
    this.flakeSpeed = 0.02; //1unit per 1ms
    this.mesh = mesh;
    this.frozen = false;
}

Flake.prototype.init = function (isFirst) {
    this.imgIdx = Math.floor(Math.random() * this.imgRange);
    //this.size = 0.1 + (Math.random() * 0.9); //linear

    this.frozen = false;

    if (Math.random() > 0.5)
        this.angleSign = -1;
    else
        this.angleSign = 1;

    this.size = Math.pow(Math.random(), 5);
    this.size += 0.2;
    if (this.size > 1)
        this.size = 0.2;


    this.x = Math.ceil(Math.random() * (this.cw + 2 * this.imgSize * this.size) - this.imgSize * this.size);
    if (isFirst) {
        this.y = Math.ceil(Math.random() * (this.ch + 2 * this.imgSize * this.size) - this.imgSize * this.size);
    }
    else {
        this.y = -this.imgSize * this.size;
    }
}

Flake.prototype.canvasResized = function (cw, ch) {
    this.cw = cw;
    this.ch = ch;
}

Flake.prototype.tick = function (timeGap) {
    if (this.y > this.ch + this.imgSize )
        this.init(false);

    if (this.frozen)
        return;

    let step = this.flakeSpeed * timeGap;

    if (this.angle > 360 || this.angle < -360)
        this.angle = 0
    this.angle += this.size / 2 * this.angleSign;

    var newX = this.x + Math.sin(this.angle * Math.PI / 180 * 15 * this.size) * this.size * 2 * step; //угол - частота, дальше - амплитуда

    var newY = this.y + this.size * 10 * step; //speed depende of size (z)

    var cross = {x:0, y:0};


    if (Math.random() > 0.4 &&  this.mesh.FindCross(this.x, this.y, newX, newY, cross))
    {
        newX = cross.x;
        newY = cross.y;
        this.frozen = true;
    }

    this.x = newX;
    this.y = newY;
}


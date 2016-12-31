function SceneView() {
    this.imgCnt = 10;
    this.flkCnt = 300;
    this.ticked = true;
    this.sizeRange = 100;
    this.imgSize = 64;


    this.mesh = new Mesh(window.innerWidth, window.innerHeight);
    this.timer = null;
    this.preTickTime = 0;
    ///read state
    this.state = true;

    //create canvas
    var canvas = document.createElement("canvas");
    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.zIndex = "-100";
    canvas.style.left = "0px";
    canvas.style.top = "0px";
    canvas.id = "snowCanvas";

    this.canvasFrozen = document.createElement("canvas");

    this.ctx = canvas.getContext("2d");
    this.ctxFrozen = this.canvasFrozen.getContext("2d");
    this.ctx.canvas.width = window.innerWidth;
    this.ctx.canvas.height = window.innerHeight;

    this.ctxFrozen.canvas.width = window.innerWidth;
    this.ctxFrozen.canvas.height = window.innerHeight

    //flakes
    this.flakesAry = new Array();
    for (var i = 0; i < this.flkCnt; i++) {
        this.flakesAry[i] = new Flake(this.mesh);
        this.flakesAry[i].imgRange = this.imgCnt;
        this.flakesAry[i].canvasResized(this.ctx.canvas.width, this.ctx.canvas.height);
        this.flakesAry[i].imgSize = this.imgSize;
        this.flakesAry[i].init(true);
    }
    
    var t = this;

    //images
    this.imageAry = new Array();
    for (var i = 0; i < this.imgCnt; i++) {
        var img = new Image();
        img.src = "Snow/f" + i.toString() + ".png";
        var c = 0;
        img.onload = function () {
            if (++c == t.imgCnt) {
                t.run();
            }
        }
        this.imageAry[i] = img;
    }

    //resize
    window.onresize = function () {
        t.ctx.canvas.width = window.innerWidth;
        t.ctx.canvas.height = window.innerHeight;
        t.ctxFrozen.canvas.width = window.innerWidth;
        t.ctxFrozen.canvas.height = window.innerHeight;
        t.mesh.Init(window.innerWidth, window.innerHeight);

        for (var i = 0; i < t.flkCnt; i++) {
            t.flakesAry[i].canvasResized(window.innerWidth, window.innerHeight);
            t.flakesAry[i].init(true);
        }
    };
}

SceneView.prototype.draw = function (timeGap) {
    //fit
    //this.ctx.canvas.width = window.innerWidth;
    //this.ctx.canvas.height = window.innerHeight;

    //this.ctxFrozen.canvas.width = window.innerWidth;
    //this.ctxFrozen.canvas.height = window.innerHeight;
    /*
    var gradient = this.ctx.createLinearGradient(0, 0, 0, window.innerHeight);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "yellow");
    this.ctx.globalCompositeOperation = "overlay";
    */

    //clear display
    // Create gradient
    this.grd = this.ctx.createLinearGradient(window.innerWidth/2, 0, window.innerWidth/2, window.innerWidth);
    // Add colors
    this.grd.addColorStop(0.000, 'rgba(0, 16, 109, 1.000)');
    this.grd.addColorStop(1.000, 'rgba(0, 135, 153, 1.000)');
    this.ctx.fillStyle = this.grd ;//"#000044";

    this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    
    let img;
    let x;
    let y;
    let a;
    let k;
    //draw flakes
    for (var i = 0; i < this.flkCnt; i++) {
        this.flakesAry[i].canvasResized(this.ctx.canvas.width, this.ctx.canvas.height);

        this.flakesAry[i].tick(timeGap);

        let ctx;
        if (this.flakesAry[i].frozen) {
            ctx = this.ctxFrozen;
        }
        else
            ctx = this.ctx;
        

        img = this.imageAry[this.flakesAry[i].imgIdx];
        x = this.flakesAry[i].x;
        y = this.flakesAry[i].y;
        a = this.flakesAry[i].angle;
        k = this.flakesAry[i].size;

        ctx.translate(x, y);
        ctx.scale(k, k);
        ctx.rotate(a * Math.PI / 180);

        ctx.drawImage(img, -this.imgSize / 3.0, -this.imgSize / 3.0);
        ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (this.flakesAry[i].frozen) {
            //this.flakesAry[i].frozen = false;
            this.flakesAry[i].init(false);
        }
    }
    this.ctx.drawImage(this.canvasFrozen, 0, 0);
}


SceneView.prototype.run = function () {
    /*
    let myWorker = new Worker("snowWorker.js");
    let t = this;
    myWorker.onmessage = function () {
        if (t.ticked) {
            t.ticked = false;
            t.tick();
            t.draw();
            t.ticked = true;
        }
    };
    */

        
    if (this.timer == null) {
        let t = this;
        this.timer = setInterval(function () {
            let timeGap;
            let tickTime = (new Date()).getTime();
            if(t.preTickTime == 0)
                timeGap = 0;
            else
                timeGap = tickTime - t.preTickTime;

            if (timeGap > 2000)
                timeGap = 0;
            t.preTickTime = tickTime;

            if (t.ticked) {
                t.ticked = false;
                t.draw(timeGap);
                t.ticked = true;
            }
        }, 20);
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



sceneView = new SceneView();
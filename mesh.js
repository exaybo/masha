function Mesh(cw, ch)
{
    this.Init(cw, ch);

    this.vectors = new Array();
/*
    this.vectors[0] = {
        x0: 0, y0: 0,
        x1: 0.5, y1: 0.5
    }
    this.vectors[1] = {
        x0: 0.5, y0: 0.5,
        x1: 1, y1: 0.5
    }
    */
    var sweet = 'M18 18 L12 20 L20 26 L12 28 M22 20 L24 26 L26 22 L30 26 L32 20 M40 26 L36 22 L40 18 L42 22 L36 22 M50 28 L46 24 L50 20 L52 24 L46 24 M58 14 L56 30 L60 28 M60 22 L54 20';
    var masha = 'M0 60 L6 36 L10 46 L16 38 L18 58 M28 60 L24 44 L20 60 M36 44 L32 46 L38 58 L30 62 M44 34 L40 58 L42 50 L46 50 L48 58 M50 58 L56 44 L62 58 M26 54 L22 52 M60 52 L52 54';
    this.ParseFromString(sweet);
    this.ParseFromString(masha);
}

Mesh.prototype.Init = function(cw, ch)
{
    this.cw = cw;
    this.ch = ch;
}

Mesh.prototype.ParseFromString = function(str)
{
    var fieldX = 64;
    var fieldY = 64;

    var preX = 0;
    var preY = 0;

    var ary = str.split(" ");
    for (var i = 0; i < ary.length; i+=2)
    {
        var op = ary[i].charAt(0); //op code (move or line)
        ary[i] = ary[i].replace(op, "");
        if (op == 'M'){
            preX = ary[i];
            preY = ary[i + 1];
        }

        this.vectors.push({
            x0: preX / fieldX,
            y0: preY / fieldY,
            x1: ary[i] / fieldX,
            y1: ary[i + 1] / fieldY,
        })

        preX = ary[i];
        preY = ary[i + 1];
    }

}

Mesh.prototype.FindCross = function(x0, y0, x1, y1, cross)
{
    for(v in this.vectors)
    {
        x2 = this.cw * this.vectors[v].x0;
        y2 = this.ch * this.vectors[v].y0;
        x3 = this.cw * this.vectors[v].x1;
        y3 = this.ch * this.vectors[v].y1;
        if (lineIntersect(x0, y0, x1, y1, x2, y2, x3, y3, cross))
            return true;


        /*
        //find cross
        x2 = this.vectors[v].x0;
        y2 = this.vectors[v].y0;
        x3 = this.vectors[v].x1;
        y3 = this.vectors[v].y1;
        
        if (x1 == x0 && x1 == x0)
            continue; //нет пересечения - вертикальняе прямые
        if (x1 == x0)
            x = x0;
        else if (x3 == x2)
            x = x3;
        else {
            m0 = (y1 - y0) / (x1 - x0);
            m1 = (y3 - y2) / (x3 - x2);

            if (m0 == m1)
                continue; //нет пересечения - одинаков наклон

            x = (m0 * x0 - m1 * x2 - y0 + y2) / m0 - m1;
        }
        if (x == x0)
            y = y0;
        else if (x3 == x2)
            y = y3
        else
            y = y0 + m0 * (x - x0);
        //лежит ли пересечение на обоих отрезках
        if (Math.abs(x - x0) < Math.abs(x1 - x0) && Math.abs(y - y0) < Math.abs(y1 - y0) &&
            Math.abs(x - x2) < Math.abs(x3 - x2) && Math.abs(y - y2) < Math.abs(y3 - y2)) {
            cross.x = x;
            cross.y = y;
            return true;
        }
        */
    }
   
}


function lineIntersect(x1, y1, x2, y2, x3, y3, x4, y4, cross) {
    var x = ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    var y = ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) / ((x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4));
    if (isNaN(x) || isNaN(y)) {
        return false;
    } else {
        if (x1 >= x2) {
            if (!(x2 <= x && x <= x1)) { return false; }
        } else {
            if (!(x1 <= x && x <= x2)) { return false; }
        }
        if (y1 >= y2) {
            if (!(y2 <= y && y <= y1)) { return false; }
        } else {
            if (!(y1 <= y && y <= y2)) { return false; }
        }
        if (x3 >= x4) {
            if (!(x4 <= x && x <= x3)) { return false; }
        } else {
            if (!(x3 <= x && x <= x4)) { return false; }
        }
        if (y3 >= y4) {
            if (!(y4 <= y && y <= y3)) { return false; }
        } else {
            if (!(y3 <= y && y <= y4)) { return false; }
        }
    }
    cross.x = x;
    cross.y = y;
    return true;
}


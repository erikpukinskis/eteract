function Line(brush) {
  this.pts = [];
  this.brushName = brush;

  this.BRUSHES = {
    pen: {strokeStyle: 'black', lineWidth: 1},
    eraser: {strokeStyle: 'white', lineWidth: 20},
  }

  this.brush = function() {
    return this.BRUSHES[this.brushName];
  }

  this.addPoint = function(p) {
    this.pts.push(p)
  }

  this.draw = function (canvas) {
    canvas.ctx.fillStyle = this.brush().strokeStyle;
    canvas.ctx.beginPath();
    var radius = Math.max(1, this.brush().lineWidth / 2);
    canvas.ctx.arc(this.pts[0].x,this.pts[0].y,radius,0,Math.PI*2,true);
    canvas.ctx.closePath();
    canvas.ctx.fill();

    for(var i=1; i<this.pts.length; i++) {
      this.drawSegment(canvas, this.pts[i-1], this.pts[i]);
    }
  }

  this.drawLast = function(canvas) {
    var len = this.pts.length;
    this.drawSegment(canvas, this.pts[len-2], this.pts[len-1]);
  }

  this.drawSegment = function(canvas, start, end) {
    var ctx = canvas.ctx;
    $.each(this.brush(), function(key, value) {
      ctx[key] = value;
    });

    ctx.beginPath();  
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();   
  }
}
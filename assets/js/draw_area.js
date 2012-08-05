function preventBehavior(e) {
    //alert('touchmove');
    e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false);

function msg(message) {
  document.getElementById("message").innerHTML = message
}

var DrawArea = function(canvas) {
  canvas.width = document.width;
  canvas.height = document.height;
  canvas.ctx = canvas.getContext("2d");  
  canvas.isDown = false;
  msg("ready");
  canvas.DROP_THRESHOLD = 4;
  canvas.segments = [];
  canvas.undoPos = 0;
  canvas.tool = "pen";

  canvas.BRUSHES = {
    pen: {strokeStyle: 'black', lineWidth: 1},
    eraser: {strokeStyle: 'white', lineWidth: 10},
  }

  canvas.markstart = function(p) {
    if (this.pendingMove) {
      clearTimeout(this.pendingMove);
      this.pendingMove = null;
    }
    this.segments[this.undoPos] = [p];
    this.undoPos++;

    msg("down");
    this.start = p;
    this.isDown = true;
    this.prevD = null;
    this.drawSegment([p])
  }

  canvas.markend = function(p) {
    msg("up");
    this.isDown = false;
  }

  canvas.markmove = function(p) {
    this.pendingMove = setTimeout(function(canvas, p) {
      canvas.movePen(p);
    }, 1, this, p);
  }

  canvas.movePen = function(p) {
    if (!this.isDown) { return }
    this.drawLine(this.start, p);
    this.segments[this.undoPos-1].push(p);
    this.start = p;
  }

  canvas.replay = function() {
    for(var i=0; i<this.undoPos; i++) {
      this.drawSegment(this.segments[i]);
    }
  }

  canvas.undo = function() {
    if(this.undoPos > 0) { this.undoPos-- }
    this.clearAll();
    this.replay();
  }

  canvas.redo = function() {
    if(this.segments[this.undoPos]) { this.undoPos++ }
    this.clearAll();
    this.replay();
  }

  canvas.drawSegment = function (pts) {
    this.ctx.fillStyle="black";
    this.ctx.beginPath();
    this.ctx.arc(pts[0].x,pts[0].y,1,0,Math.PI*2,true);
    this.ctx.closePath();
    this.ctx.fill();

    for(var i=1; i<pts.length; i++) {
      this.drawLine(pts[i-1], pts[i]);
    }
  }

  canvas.drawLine = function(start, end, color) {
    var ctx = this.ctx;
    $.each(this.BRUSHES[this.tool], function(key, value) {
      ctx[key] = value;
    });

    if(color) { this.ctx.strokeStyle = color }

    this.ctx.beginPath();  
    this.ctx.moveTo(start.x, start.y);
    this.ctx.lineTo(end.x, end.y);
    this.ctx.stroke();   
  }

  canvas.connectEvents = function(touch, mouse, mark) {
    canvas.addEventListener(mouse, function(e) {
      this[mark]({x: e.clientX, y: e.clientY});
    });

    canvas.addEventListener(touch, function(e) {
      e.preventDefault();
      if (mark != 'touchend') {
        this[mark]({x: e.touches[0].pageX, y: e.touches[0].pageY});
      }
    });
  }

  canvas.clearAll = function() {
    this.ctx.clearRect(0,0,this.width,this.height);
  }

  canvas.reset = function() {
    this.clearAll();
    this.i = 0;
    this.undoPos = 0;
  }

  canvas.connectEvents('touchstart', 'mousedown', 'markstart');
  canvas.connectEvents('touchend', 'mouseup', 'markend');
  canvas.connectEvents('touchmove', 'mousemove', 'markmove');

  return canvas;
}
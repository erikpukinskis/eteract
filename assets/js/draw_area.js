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

  canvas.markstart = function(p) {
    if (this.pendingMove) {
      clearTimeout(this.pendingMove);
      this.pendingMove = null;
    }

    msg("down");
    this.start = p;
    this.isDown = true;
    this.prevD = null;
    this.ctx.fillStyle="black";
    this.ctx.beginPath();
    this.ctx.arc(p.x,p.y,1,0,Math.PI*2,true);
    this.ctx.closePath();
    this.ctx.fill();
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
    this.start = p;
  }

  canvas.drawLine = function(start, end, color) {
    if(!color) { color = "black"}
    this.ctx.strokeStyle = color;
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
    this.i = 0;
  }

  canvas.connectEvents('touchstart', 'mousedown', 'markstart');
  canvas.connectEvents('touchend', 'mouseup', 'markend');
  canvas.connectEvents('touchmove', 'mousemove', 'markmove');

  return canvas;
}
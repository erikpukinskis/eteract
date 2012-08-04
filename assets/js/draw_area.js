function preventBehavior(e) {
    //alert('touchmove');
    e.preventDefault(); 
};
document.addEventListener("touchmove", preventBehavior, false);

function msg(message) {
  document.getElementById("message").innerHTML = message
}

var DrawArea = function(canvas) {
  canvas.width = 400;
  canvas.height = 400;
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

  canvas.stroke = function(val) {
    if (val > 255) { 
      this.ctx.strokeStyle = "white";
    } else {
      this.ctx.strokeStyle = "rgb(" + val + "," + val + "," + val + ")";      
    }
  }

  canvas.i = 0;
  canvas.drawDiff = function(diff) {
    this.drawLine({x: this.i, y: 50}, {x: this.i, y: 50 - diff}, (diff > this.DROP_THRESHOLD) ? "red" : "black");
    this.i++;
  }

  canvas.markmove = function(p) {
    this.pendingMove = setTimeout(function(canvas, p) {
      canvas.movePen(p);
    }, 1, this, p);
  }

  canvas.movePen = function(p) {
    if (!this.isDown) { return }
    //msg(p.x + "," + p.y);
    var d = Math.abs(p.x - this.start.x + p.y - this.start.y);
    if (this.prevD) {
      diff = d / this.prevD;
      this.drawDiff(diff);
      msg(diff);
      if (diff > this.DROP_THRESHOLD) {
        this.markend();
        msg("BURN!");
        //this.isDown = false;
      }
      this.prevD = (this.prevD * 3 + d) / 4;
    } else {
      this.prevD = d;      
    }

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
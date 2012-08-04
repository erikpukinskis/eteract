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

  canvas.markstart = function(p) {
    msg("down");
    this.start = p;
    this.isDown = true;
  }

  canvas.markend = function(p) {
    msg("up");
    this.isDown = false;
  }

  canvas.stroke = function(val) {
    if (val > 255) { val = 255};
    if (val < 0) { val = 0 };
    this.ctx.strokeStyle = "rgb(" + val + ",0,0)";      
    msg(val);
  }

  canvas.markmove = function(p) {
    //msg(p.x + "," + p.y);
    if (this.isDown == true) {
      var d = Math.abs(p.x - this.start.x + p.y - this.start.y);
      if (this.prevD) {
        diff = d / this.prevD;
        msg(diff);
        this.stroke(50*diff);
      } else {
        msg('No prevD')
        this.stroke(0)
      }

      this.ctx.beginPath();  
      this.ctx.moveTo(this.start.x, this.start.y);
      this.ctx.lineTo(p.x, p.y);
      this.ctx.stroke();
      this.start = p;
      this.prevD = d;
    }
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

  canvas.connectEvents('touchstart', 'mousedown', 'markstart');
  canvas.connectEvents('touchend', 'mouseup', 'markend');
  canvas.connectEvents('touchmove', 'mousemove', 'markmove');
}
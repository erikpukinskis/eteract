function msg(message) {
  document.getElementById("message").innerHTML = message
}

var DrawArea = function(canvas) {
  canvas.width = document.width;
  canvas.height = document.height;
  canvas.ctx = canvas.getContext("2d");  
  canvas.ctx.fillStyle = "rgb(200,0,0)";  
  canvas.isDown = false;

  canvas.onmousedown = function(e) {
    msg("down");
    this.start = e;
    this.isDown = true;
  }

  canvas.onmouseup = function() {
    msg("up");
    this.isDown = false;
  }

  canvas.onmousemove = function(e) {
    msg(e.clientX);
    if (this.isDown == true) {
      this.ctx.beginPath();  
      this.ctx.moveTo(this.start.clientX, this.start.clientY);
      this.ctx.lineTo(e.clientX, e.clientY);
      this.ctx.stroke();
      this.start = e;
    }
  }
}
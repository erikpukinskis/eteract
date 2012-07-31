function msg(message) {
  document.getElementById("message").innerHTML = message
}

var DrawArea = function(canvas) {
  canvas.width = document.width;
  canvas.height = document.height;
  canvas.ctx = canvas.getContext("2d");  
  canvas.ctx.fillStyle = "rgb(200,0,0)";  
  canvas.isDown = false;

  canvas.onmousedown = function() {
    msg("down");
    this.isDown = true;
  }

  canvas.onmouseup = function() {
    msg("up");
    this.isDown = false;
  }

  canvas.onmousemove = function(e) {
    msg(e.clientX);
    if (this.isDown == true) {
      var x = e.clientX;
      var y = e.clientY;

      this.ctx.fillRect (x, y, 5, 5);  
    }
  }
}
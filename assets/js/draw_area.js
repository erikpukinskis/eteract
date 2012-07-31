function msg(message) {
  document.getElementById("message").innerHTML = message
}

var DrawArea = function(canvas) {
  this.ctx = canvas.getContext("2d");  
  this.ctx.fillStyle = "rgb(200,0,0)";  
  this.down = false;

  this.down = function() {
    msg("down");
    this.isDown = true;
  }

  this.up = function() {
    msg("up");
    this.isDown = false;
  }

  this.move = function() {
    msg("move");
    if (this.isDown == true) {
      var x = 300 * Math.random();
      var y = 300 * Math.random();

      this.ctx.fillRect (x, y, x+5, y+5);  
    }
  }
}
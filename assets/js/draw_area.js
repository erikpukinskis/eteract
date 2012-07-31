var DrawArea = function(canvas) {
  this.ctx = canvas.getContext("2d");  
  this.ctx.fillStyle = "rgb(200,0,0)";  

  this.down = function() {
  }

  this.up = function() {
  }

  this.move = function() {
    var x = 300 * Math.random();
    var y = 300 * Math.random();

    this.ctx.fillRect (x, y, x+5, y+5);  
  }
}
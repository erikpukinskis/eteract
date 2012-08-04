
  // Calculates pen speed
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
  }


  // Sets stroke color
  canvas.stroke = function(val) {
    if (val > 255) { 
      this.ctx.strokeStyle = "white";
    } else {
      this.ctx.strokeStyle = "rgb(" + val + "," + val + "," + val + ")";      
    }
  }


  // Draws little sparkline thing for pen speed
  canvas.i = 0;
  canvas.drawDiff = function(diff) {
    this.drawLine({x: this.i, y: 50}, {x: this.i, y: 50 - diff}, (diff > this.DROP_THRESHOLD) ? "red" : "black");
    this.i++;
  }

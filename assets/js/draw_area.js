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
  canvas.ctx.lineCap = 'round';
  canvas.isDown = false;
  msg("ready");
  canvas.DROP_THRESHOLD = 4;
  canvas.segments = [];
  canvas.undoPos = 0;
  canvas.tool = "pen";

  canvas.BRUSHES = {
    pen: {strokeStyle: 'black', lineWidth: 1},
    eraser: {strokeStyle: 'white', lineWidth: 20},
  }

  canvas.setTool = function(tool) {
    var classes = "btn-primary active";
    $(".tool").removeClass(classes);
    $("#" + tool + "_tool").addClass(classes)

    this.lastTool = this.tool;
    this.tool = tool;
    if(tool == "frame") {
      $("body").append("<div class='picking frame'>");
    }
  }

  canvas.isPen = function() {
    return this.tool == "pen" || this.tool == "eraser"
  }

  canvas.markstart = function(p) {
    if (this.pendingMove) {
      clearTimeout(this.pendingMove);
      this.pendingMove = null;
    }

    if(this.isPen()) {
      var line = new Line(this.tool);
      line.addPoint(p);
      this.segments[this.undoPos] = line;
      this.undoPos++;

      msg("down");
      this.start = p;
      this.isDown = true;
      this.prevD = null;
      line.draw(this);
    } else if (this.tool == "frame") {
      $(".picking.frame").addClass("picked").removeClass("picking");
      var title = prompt("Name your frame.");
      $(".picked.frame").append("<div class='title'>" + title + "</div>");
      $(".picked.frame").removeClass("picked");
      this.setTool(this.lastTool);
    }
  }

  canvas.markend = function(p) {
    msg("up");
    this.isDown = false;
  }

  canvas.markmove = function(p) {
    if(this.isPen()) {
      this.pendingMove = setTimeout(function(canvas, p) {
        canvas.movePen(p);
      }, 1, this, p);
    } else if(this.tool == "frame") {
      var frame = $(".picking.frame");
      frame.css({top: p.y + "px", left: p.x + "px"});
    }
  }

  canvas.movePen = function(p) {
    if (!this.isDown) { return }
    var line = this.segments[this.undoPos-1];
    line.addPoint(p);
    line.drawLast(this);
    this.start = p;
  }

  canvas.replay = function() {
    for(var i=0; i<this.undoPos; i++) {
      this.segments[i].draw(this);
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
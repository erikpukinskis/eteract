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
  canvas.pages = []
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
  }

  canvas.isPen = function() {
    return this.tool == "pen" || this.tool == "eraser"
  }

  canvas.new = function(name) {
    if (!name) {
      name = prompt("Name for new page:");
    } 
    this.pages.push({name: name, segments: [], undoPos: 0});
    var page = this.pages.length-1;
    this.open(page);
    $("#pages ul").append("<li><a href='#' onclick='draw.pageselect(" + page + "); return false;'>" + name + "</a></li>");
  }

  canvas.open = function(page) {
    if (this.page != null) {
      this.pages[this.page].segments = this.segments;
      this.pages[this.page].undoPos = this.undoPos;
    }
    this.page = page;
    $("#pages_button").html(this.pages[this.page].name);
    $("#pages").hide();
    this.reset();
    this.segments = this.pages[page].segments;
    this.undoPos = this.pages[page].undoPos;
    this.replay();
  }

  canvas.pageselect = canvas.open;

  canvas.setTarget = function(page) {
    this.target = page;
    $("#pages").hide();
    this.setTool('link');
  }

  canvas.markstart = function(p) {
    if (this.pendingMove) {
      clearTimeout(this.pendingMove);
      this.pendingMove = null;
    }

    this.start = p;
    this.isDown = true;

    if(this.isPen()) {
      var line = new Line(this.tool);
      line.addPoint(p);
      this.segments[this.undoPos] = line;
      this.undoPos++;

      msg("down");
      this.prevD = null;
      line.draw(this);
    } else {
      $("body").append("<div class='target' id='active_target'>&#9758; " + this.pages[this.target].name + "</div>");
      $("#active_target").css({left: p.x, top: p.y, width: 0, height: 0});
    }
  }

  canvas.markend = function(p) {
    msg("up");
    this.isDown = false;
    if (this.tool == "link") {
      this.setTool(this.lastTool);
    }
  }

  canvas.markmove = function(p) {
    if(this.isPen()) {
      this.pendingMove = setTimeout(function(canvas, p) {
        canvas.movePen(p);
      }, 1, this, p);
    } else if (this.isDown) {
      var w = p.x - this.start.x + "px";
      var h = p.y - this.start.y + "px";
      $("#active_target").css({width: w, height: h, 'line-height': h });
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
  canvas.new("Home");

  return canvas;
}
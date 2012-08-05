function tool(toolname) {
  draw.setTool(toolname);
}

function newTarget() {
  draw.pageselect = draw.setTarget;
  $("#pages").show().addClass("forTarget")
}
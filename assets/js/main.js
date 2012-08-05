function tool(toolname) {
  var classes = "btn-primary active";
  $(".tool").removeClass(classes);
  $("#" + toolname + "_tool").addClass(classes)
  draw.tool = toolname;
}
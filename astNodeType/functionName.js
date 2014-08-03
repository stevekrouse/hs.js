window.astNodeTypes['functionName'] = {
  type: 'functionName',
  astToString: function(node) {
    // var functions = Object.keys(window.functions);
    // if ((functions.indexOf(node.functionName.name) >= 0) &&
    //     window.functions[node.functionName.name].astToString) {
    //   var funcName = window.functions[node.functionName.name].astToString(node.functionName);
    // } else {
    //   var funcName = node.functionName.name; // default for functionName
    // }

    var funcName = node.name;
    return funcName;
  }
};

window.astNodeTypes['application'] = {
  type: 'application',
  astToString: function(node) {
    var funcAndArgs = node.arguments.map((function(arg){
      return window.ASTTransformations.astToString(arg);
    }))

    var funcName = window.ASTTransformations.astToString(node.functionName);

    indexToAddFunction = node.functionName.infix ? 1 : 0;
    funcAndArgs.splice(indexToAddFunction, 0, funcName);
    return "(" + funcAndArgs.join(" ") + ")";
  }
};

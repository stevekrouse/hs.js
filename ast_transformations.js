var _subtreeById = function(AST, id) {
  if (AST.id == id) {
    return AST;
  }

  Object.keys(AST).forEach(function(key) {
    var value = AST[key];
    if (typeof value == 'object') {
      var returnedAST = _subtreeById(value, id);
      if (returnedAST) return returnedAST;
    }
  });

  return null;
};

var _isValidApplication = function(functionName, arguments) {
  if (functionName == '+') {
    return arguments.length == 2 &&
           arguments[0].type == 'int' &&
           arguments[1].type == 'int'
  }
};

window.ASTTransformations = {
  isApplicable: function(AST, id) {
    var subtree = _subtreeById(AST, id);

    return subtree.type == 'application' &&
           _isValidApplication(subtree.functionName.name, subtree.arguments);
  }
};

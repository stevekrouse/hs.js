var _isValidApplication = function(functionName, arguments) {
  if (functionName == '+') {
    return arguments.length == 2 &&
           arguments[0].type == 'int' &&
           arguments[1].type == 'int'
  } else if (functionName == 'map') {
    return arguments.length == 2 &&
           arguments[0].type == 'functionName' &&
           arguments[1].type == 'list'
  } else if (functionName == '(+ 1)') {
    return arguments.length == 1 &&
           arguments[0].type == 'int'
  } else if (functionName == ':') {
    return arguments.length == 2 &&
           arguments[1].type == 'list'
  } else {
    return false;
  }
};

window.ASTTransformations = {
  subtreeById: function(AST, id) {
    if (AST.id === id) {
      return AST;
    }

    var keys = Object.keys(AST)
    for (var i=0; i<keys.length; i++) {
      var value = AST[keys[i]];
      if (_.isArray(value)) {
        for(var j=0; j<value.length; j++) {
          var returnedAST = ASTTransformations.subtreeById(value[j], id);
          if (returnedAST) return returnedAST;
        }
      } else if (_.isObject(value)) {
        var returnedAST = ASTTransformations.subtreeById(value, id);
        if (returnedAST) return returnedAST;
      }
    };

    return null;
  },

  isApplicable: function(AST, id) {
    var subtree = ASTTransformations.subtreeById(AST, id);

    return subtree.type == 'application' &&
           _isValidApplication(subtree.functionName.name, subtree.arguments);
  },

  applyFunction: function(AST, id) {

  }
};

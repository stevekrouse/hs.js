window.functions = {};

var _isValidApplication = function(functionName, arguments) {  // TODO REMOVE THIS METHOD
  if (window.functions[functionName] != undefined){
    return window.functions[functionName].isValidApplication(arguments);
  } else {
    return false;
  }
};

var _patternMatch = function(func, arguments){
  for (var i = 0; i < func.patterns.length; i ++){
    pattern = func.patterns[i];

    if (pattern.doesMatch(arguments)){
      return pattern.apply(arguments);
    }
  }
  throw "Inexhaustive pattern matching for function '" + func.name + "'.";
};

var _applyFunction = function(node) {
  if (node.type !== 'application') {
    throw 'node needs to be an application';
  }

  if (!_isValidApplication(node.functionName.name, node.arguments)) {
    throw 'invalid application';
  }

  if (window.functions[node.functionName.name] != undefined){
    return _patternMatch(window.functions[node.functionName.name], node.arguments);
  } else {
    throw 'function not defined for application';
  }
}


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

  isApplicable: function(node) {
    return node.type === 'application' &&
           _isValidApplication(node.functionName.name, node.arguments);
  },

  applyFunction: function(oldAST, id) {
    var newAST = _.cloneDeep(oldAST);
    var subtree = ASTTransformations.subtreeById(newAST, id);
    var newSubtree = _applyFunction(_.cloneDeep(subtree));

    // delete all keys of subtree
    var keys = Object.keys(subtree)
    for (var i=0; i<keys.length; i++) {
      delete subtree[keys[i]];
    }

    _.extend(subtree, newSubtree);

    return {ast: newAST, justComputedId: newSubtree.id};
  }
};

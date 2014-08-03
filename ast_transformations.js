var _isValidApplication = function(functionName, arguments) {  // TODO REMOVE THIS METHOD
  if (functionName === '+') {
    return window.plus.isValidApplication(arguments);
  } else if (functionName === 'map') {
    return window.map.isValidApplication(arguments);
  } else if (functionName === '(+ 1)') {
    return window.plusOne.isValidApplication(arguments);
  } else if (functionName === ':') {
    return window.cons.isValidApplication(arguments);
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

  alert("Inexhaustive pattern matching for function '" + func.name + "'.");
};

var _applyFunction = function(node) {
  if (node.type !== 'application') {
    throw 'node needs to be an application';
  }
  if (!_isValidApplication(node.functionName.name, node.arguments)) {
    throw 'invalid application';
  }
  if (node.functionName.name === '+') {
    return _patternMatch(window.plus, node.arguments);
  } else if (node.functionName.name === '(+ 1)') {
    return _patternMatch(window.plusOne, node.arguments);
  } else if (node.functionName.name === 'map') {
    return _patternMatch(window.map, node.arguments);
  } else if (node.functionName.name === ':') {
    return _patternMatch(window.cons, node.arguments);
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

window.functions = {};
window.astNodeTypes = {};

var _isValidApplication = function(functionName, arguments) {  // TODO REMOVE THIS METHOD
  if (window.functions[functionName] != undefined){
    return window.functions[functionName].isValidApplication(arguments);
  } else {
    return false;
  }
};

var _matchingPatternIndex = function(func, arguments){
  for (var i = 0; i < func.patterns.length; i ++){
    if (func.patterns[i].doesMatch(arguments)){
      return i;
    }
  }
  throw "Inexhaustive pattern matching for function '" + func.name + "'.";
};

var _verifyApplication = function(node) {
  if (node.type !== 'application') {
    throw 'node needs to be an application';
  }

  if (!_isValidApplication(node.functionName.name, node.arguments)) {
    throw 'invalid application';
  }

  if (!window.functions[node.functionName.name]) {
    throw 'function not defined for application';
  }
};

var _applyFunction = function(node) {
  _verifyApplication(node);

  var func = window.functions[node.functionName.name];
  var index = _matchingPatternIndex(func, node.arguments);
  return func.patterns[index].apply(node.arguments);
}

var _giveDifferentIds = function(AST) {
  if (AST.id) AST.id = uuid.v4();
  var keys = Object.keys(AST)
  for (var i=0; i<keys.length; i++) {
    var value = AST[keys[i]];
    if (_.isArray(value)) {
      for(var j=0; j<value.length; j++) {
        _giveDifferentIds(value[j]);
      }
    } else if (_.isObject(value)) {
      _giveDifferentIds(value);
    }
  };
  return AST;
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

  isApplicable: function(node) {
    return node.type === 'application' &&
           _isValidApplication(node.functionName.name, node.arguments);
  },

  getContextHTML: function(AST, id) {
    var node = ASTTransformations.subtreeById(AST, id);
    if (!node) return '';
    _verifyApplication(node);

    var func = window.functions[node.functionName.name];
    var index = _matchingPatternIndex(func, node.arguments);
    var functionName = '<em>' + (func.infix ? '(' : '') + func.name + (func.infix ? ')' : '') + '</em>';

    var html = functionName + ' :: ' + func.typeSignature;
    if (func.patterns[index].definitionLine) {
      html += '<br>' + functionName + ' ' + func.patterns[index].definitionLine
    }
    return html;
  },

  replaceSubtree: function(oldAST, id, newSubtree) {
    var newAST = _.cloneDeep(oldAST);
    var subtree = ASTTransformations.subtreeById(newAST, id);

    // delete all keys of subtree
    var keys = Object.keys(subtree)
    for (var i=0; i<keys.length; i++) {
      delete subtree[keys[i]];
    }

    _.extend(subtree, newSubtree);

    return newAST;
  },

  applyFunction: function(oldAST, id) {
    var subtree = ASTTransformations.subtreeById(oldAST, id);
    var newSubtree = _applyFunction(_giveDifferentIds(_.cloneDeep(subtree)));
    var newAST = ASTTransformations.replaceSubtree(oldAST, id, newSubtree);

    return {ast: newAST, justComputedId: newSubtree.id};
  },

  astToString: function(node) {
    var astNodeTypes = Object.keys(window.astNodeTypes);

    if ((astNodeTypes.indexOf(node.type)) >= 0){
      return window.astNodeTypes[node.type].astToString(node);
    } else {
      throw "cannot convert type '" + node.type + "' to String";
    }
  },

  fillInArguments: function(AST, patternArguments, functionArguments) {
    var newAST = _giveDifferentIds(_.cloneDeep(AST));
    if (newAST.type === 'functionName' && _.pluck(patternArguments, 'name').indexOf(newAST.name) >= 0) {
      newAST = _giveDifferentIds(_.cloneDeep(functionArguments[_.pluck(patternArguments, 'name').indexOf(newAST.name)]));
      newAST.id = uuid.v4();
    } else if (_.isArray(newAST)) {
      newAST = newAST.map(function(item) {
        return ASTTransformations.fillInArguments(item, patternArguments, functionArguments);
      });
    } else if (newAST.type === 'application') {
      newAST.functionName = ASTTransformations.fillInArguments(newAST.functionName, patternArguments, functionArguments);
      newAST.arguments = ASTTransformations.fillInArguments(newAST.arguments, patternArguments, functionArguments);
    } else if (newAST.type === 'list') {
      newAST.items = ASTTransformations.fillInArguments(newAST.items, patternArguments, functionArguments);
    }
    return newAST;
  }
};

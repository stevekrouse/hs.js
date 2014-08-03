var _isValidApplication = function(functionName, arguments) {
  if (functionName === '+') {
    return arguments.length === 2 &&
           arguments[0].type === 'int' &&
           arguments[1].type === 'int'
  } else if (functionName === 'map') {
    return arguments.length === 2 &&
           arguments[0].type === 'functionName' &&
           arguments[1].type === 'list'
  } else if (functionName === '(+ 1)') {
    return arguments.length === 1 &&
           arguments[0].type === 'int'
  } else if (functionName === ':') {
    return arguments.length === 2 &&
           arguments[1].type === 'list'
  } else {
    return false;
  }
};

var _applyFunction = function(node) {
  if (node.type !== 'application') {
    throw 'node needs to be an application';
  }
  if (!_isValidApplication(node.functionName.name, node.arguments)) {
    throw 'invalid application';
  }
  if (node.functionName.name === '+') {
    return {
      id: uuid.v4(),
      type: 'int',
      value: node.arguments[0].value + node.arguments[1].value
    };
  } else if (node.functionName.name === '(+ 1)') {
    return {
      id: uuid.v4(),
      type: 'int',
      value: node.arguments[0].value + 1
    };
  } else if (node.functionName.name === 'map') {
    if (node.arguments[1].items.length === 0) {
      return {id: uuid.v4(), type: 'list', items: []}
    }

    return {
      id: uuid.v4(),
      type: 'application',
      functionName: {id: uuid.v4(), type: 'functionName', name: ':', infix: true},
      arguments: [
        {
          id: uuid.v4(),
          type: 'application',
          functionName: node.arguments[0],
          arguments: [node.arguments[1].items[0]]
        },
        {
          id: uuid.v4(),
          type: 'application',
          functionName: {id: uuid.v4(), type: 'functionName', name: 'map'},
          arguments: [
            node.arguments[0],
            {id: uuid.v4(), type: 'list', items: node.arguments[1].items.slice(1)}
          ]
        }
      ]
    };
  } else if (node.functionName.name === ':') {
    var items = node.arguments[1].items;
    items.unshift(node.arguments[0]);

    return {
      id: uuid.v4(),
      type: 'list',
      items: items
    };
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

  isApplicable: function(AST, id) {
    var subtree = ASTTransformations.subtreeById(AST, id);

    return subtree.type === 'application' &&
           _isValidApplication(subtree.functionName.name, subtree.arguments);
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

    return newAST;
  }
};

var newFunctions = HaskellParser.parse(initialFunctionDefinitions + "\n\n", {startRule: 'functionDefinitionList'});
newFunctions.forEach(function(func) {
    window.functions[func.name] = func;
});

var stripIds = function(AST) {
  delete AST.id;
  var keys = Object.keys(AST)
  for (var i=0; i<keys.length; i++) {
    var value = AST[keys[i]];
    if (_.isArray(value)) {
      for(var j=0; j<value.length; j++) {
        stripIds(value[j]);
      }
    } else if (_.isObject(value)) {
      stripIds(value);
    }
  };
  return AST;
};

describe('ASTTransformations', function() {
  describe('subtreeById', function() {
    it('finds a subtree inside functionName"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "+", infix: true},
        arguments: [
          {id: 3, type: "int", value: 1},
          {id: 4, type: "int", value: 1}
        ]
      };
      chai.expect(ASTTransformations.subtreeById(AST, AST.functionName.id)).to.deep.equal(AST.functionName);
    });

    it('finds a subtree inside arguments"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "+", infix: true},
        arguments: [
          {id: 3, type: "int", value: 1},
          {id: 4, type: "int", value: 1}
        ]
      };
      chai.expect(ASTTransformations.subtreeById(AST, AST.arguments[0].id)).to.deep.equal(AST.arguments[0]);
    });

    it('finds a subtree inside list items"', function() {
      var AST = {
        id: 1,
        type: "list",
        items: [
          {id: 2, type: "int", value: 1}
        ]
      };
      chai.expect(ASTTransformations.subtreeById(AST, AST.items[0].id)).to.deep.equal(AST.items[0]);
    });
  });

  describe('isApplicable', function() {
    it('allows applying "1+1"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "+", infix: true},
        arguments: [
          {id: 3, type: "int", value: 1},
          {id: 4, type: "int", value: 1}
        ]
      };
      chai.expect(ASTTransformations.isApplicable(AST)).to.be.true;
    });

    it('doesnt allow applying "1+(1+1)"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "+", infix: true},
        arguments: [
          {id: 3, type: "int", value: 1},
          {
            id: 4,
            type: "application",
            functionName: {id: 5, type: "functionName", name: "+", infix: true},
            arguments: [
              {id: 6, type: "int", value: 1},
              {id: 7, type: "int", value: 1}
            ]
          }
        ]
      };
      chai.expect(ASTTransformations.isApplicable(AST)).to.be.false;
    });

    it('doesnt allow applying "unknown"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "unknown"},
        arguments: []
      };
      chai.expect(ASTTransformations.isApplicable(AST)).to.be.false;
    });

    it('allows applying "map f []"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "map"},
        arguments: [
          {id: 3, type: "functionName", name: "f"},
          {id: 4, type: "list", items: []}
        ]
      };
      chai.expect(ASTTransformations.isApplicable(AST)).to.be.true;
    });

    it('allows applying "addOne 1"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "addOne"},
        arguments: [
          {id: 3, type: "int", value: 1}
        ]
      };
      chai.expect(ASTTransformations.isApplicable(AST)).to.be.true;
    });

    it('allows applying "0 : []"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: ":", infix: true},
        arguments: [
          {id: 3, type: "int", value: 0},
          {id: 3, type: "list", items: []}
        ]
      };
      chai.expect(ASTTransformations.isApplicable(AST)).to.be.true;
    });
  });

  describe('applyFunction', function() {
    it('computes "1 + 1" => "2"', function() {
      var ASTbefore = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "+", infix: true},
        arguments: [
          {id: 3, type: "int", value: 1},
          {id: 4, type: "int", value: 1}
        ]
      };
      var ASTafter = {type: "int", value: 2};
      chai.expect(stripIds(ASTTransformations.applyFunction(ASTbefore, ASTbefore.id)).ast).to.deep.equal(ASTafter);
    });

    it('computes "map f []" => "[]"', function() {
      var ASTbefore = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "map"},
        arguments: [
          {id: 3, type: "functionName", name: "f"},
          {id: 4, type: "list", items: []}
        ]
      };
      var ASTafter = {type: "list", items: []};
      chai.expect(stripIds(ASTTransformations.applyFunction(ASTbefore, ASTbefore.id)).ast).to.deep.equal(ASTafter);
    });

    it('computes "map f [1]" => "(f 1) : (map f [])"', function() {
      var ASTbefore = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "map"},
        arguments: [
          {id: 3, type: "functionName", name: "f"},
          {id: 4, type: "list", items: [
            {type: 'int', value: 1}
          ]}
        ]
      };
      var ASTafter = {
        functionName: {type: "functionName", name: ":", infix: true},
        type: "application",
        arguments: [
          {
            functionName: {type: "functionName", name: "f"},
            type: "application",
            arguments: [{type: "int", value: 1}]
          },
          {
            functionName: {type: "functionName", name: "map", infix: false},
            type: "application",
            arguments: [
              {type: "functionName", name: "f"},
              {type: "list", items: []}
            ]
          }
        ]
      }
      chai.expect(stripIds(ASTTransformations.applyFunction(ASTbefore, ASTbefore.id)).ast).to.deep.equal(ASTafter);
    });

    it('computes "1 : [2]" => "[1,2]"', function() {
      var ASTbefore = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: ":", infix: true},
        arguments: [
          {id: 3, type: "int", value: 1},
          {id: 4, type: 'list', items: [
            {id: 5, type: "int", value: 2}
          ]}
        ]
      };
      var ASTafter = {
        type: 'list',
        items: [
          {type: "int", value: 1},
          {type: "int", value: 2}
        ]
      };
      chai.expect(stripIds(ASTTransformations.applyFunction(ASTbefore, ASTbefore.id)).ast).to.deep.equal(ASTafter);
    });
  });

  describe('getContext', function() {
    it('works for ":"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "map"},
        arguments: [
          {id: 3, type: "functionName", name: "addOne"},
          {id: 4, type: 'list', items: []}
        ]
      };
      var contextHTML = "<em>map</em> :: (a -> b) -> [a] -> [b]<br><em>map</em>  f []     = []";
      chai.expect(ASTTransformations.getContextHTML(AST, AST.id)).to.equal(contextHTML);
    });
  });

  describe('fillInArguments', function() {
    var patternArguments = [
      {
        id: 1,
        type: "functionName",
        name: "x"
      },
      {
        id: 2,
        type: "functionName",
        name: "y"
      }
    ];
    var functionArguments = [
      {
        id: 1,
        type: "functionName",
        name: "test1"
      },
      {
        id: 2,
        type: "functionName",
        name: "test2"
      }
    ];

    it('replaces a functionName node', function() {
      var AST = {
        id: 1,
        type: "functionName",
        name: "y"
      };
      var expectedAST = {
        type: "functionName",
        name: "test2"
      };
      chai.expect(stripIds(ASTTransformations.fillInArguments(AST, patternArguments, functionArguments))).to.deep.equal(expectedAST);
    });

    it('replaces list of functionName nodes', function() {
      var AST = {
        id: 1,
        type: "list",
        items: [{
          id: 2,
          type: "functionName",
          name: "y"
        }]
      };
      var expectedAST = {
        type: "list",
        items: [{
          type: "functionName",
          name: "test2"
        }]
      };
      chai.expect(stripIds(ASTTransformations.fillInArguments(AST, patternArguments, functionArguments))).to.deep.equal(expectedAST);
    });
    it('replaces functionName nodes in function applications', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: 'functionName', name: 'x'},
        arguments: [{
          id: 2,
          type: "functionName",
          name: "y"
        }]
      };
      var expectedAST = {
        type: "application",
        functionName: {type: 'functionName', name: 'test1'},
        arguments: [{
          type: "functionName",
          name: "test2"
        }]
      };
      chai.expect(stripIds(ASTTransformations.fillInArguments(AST, patternArguments, functionArguments))).to.deep.equal(expectedAST);
    });
  })
});

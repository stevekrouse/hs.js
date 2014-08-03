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

    it('allows applying "(+ 1) 1"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "(+ 1)"},
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
    it('computes "(+ 1) 1" => "2"', function() {
      var ASTbefore = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "(+ 1)"},
        arguments: [
          {id: 3, type: "int", value: 1}
        ]
      };
      var ASTafter = {type: "int", value: 2};
      chai.expect(stripIds(ASTTransformations.applyFunction(ASTbefore, ASTbefore.id)).ast).to.deep.equal(ASTafter);
    });

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
      var ASTafter = {type: "list", items: []}
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
        type: "application",
        functionName: {type: "functionName", name: ":", infix: true},
        arguments: [
          {
            type: "application",
            functionName: {type: "functionName", name: "f"},
            arguments: [{type: "int", value: 1}]
          },
          {
            type: "application",
            functionName: {type: "functionName", name: "map"},
            arguments: [
              {type: "functionName", name: "f"},
              {type: "list", items: []}
            ]
          }
        ]
      }
      chai.expect(stripIds(ASTTransformations.applyFunction(ASTbefore, ASTbefore.id)).ast).to.deep.equal(ASTafter);
    });

    it('computes "1 : [2]" => "[1 2]"', function() {
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
});

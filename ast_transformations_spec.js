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
      chai.expect(ASTTransformations.isApplicable(AST, AST.id)).to.be.true;
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
      chai.expect(ASTTransformations.isApplicable(AST, AST.id)).to.be.false;
    });

    it('does allow applying the inner "1+1" inside "1+(1+1)"', function() {
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
      chai.expect(ASTTransformations.isApplicable(AST, AST.arguments[1].id)).to.be.true;
    });

    it('doesnt allow applying "unknown"', function() {
      var AST = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "unknown"},
        arguments: []
      };
      chai.expect(ASTTransformations.isApplicable(AST, AST.id)).to.be.false;
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
      chai.expect(ASTTransformations.isApplicable(AST, AST.id)).to.be.true;
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
      chai.expect(ASTTransformations.isApplicable(AST, AST.id)).to.be.true;
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
      chai.expect(ASTTransformations.isApplicable(AST, AST.id)).to.be.true;
    });
  });

  describe.skip('applyFunction', function() {
    it('computes "(+ 1) 1" => "2"', function() {
      var ASTbefore = {
        id: 1,
        type: "application",
        functionName: {id: 2, type: "functionName", name: "(+ 1)"},
        arguments: [
          {id: 3, type: "int", value: 1}
        ]
      };
      var ASTafter = {id: 3, type: "int", value: 2};
      chai.expect(ASTTransformations.applyFunction(ASTbefore, ASTbefore.id)).to.equal(ASTafter);
    });
  });
});

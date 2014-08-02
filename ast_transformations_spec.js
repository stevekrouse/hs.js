describe('ASTTransformations', function() {
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
  });
});

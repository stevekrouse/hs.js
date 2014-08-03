var Application = React.createClass({displayName: 'Application',
  mixins: [NodeMixins],
  isApplicable: function() {
    return ASTTransformations.isApplicable(this.currentAST());
  },
  apply: function() {
    if (this.isApplicable()) {
      window.addLineByApplying(this.currentAST().id);
    }
  },
  render: function() {
    var currentAST = this.currentAST();

    var ast = this.props.ast;
    var funcAndArgs = currentAST.arguments.map(function(arg){
      return Node({ast: ast, id: arg.id});
    });

    indexToAddFunction = currentAST.functionName.infix ? 1 : 0;
    funcAndArgs.splice(indexToAddFunction, 0, FunctionName({ast: this.props.ast, id: currentAST.functionName.id}));

    funcAndArgs.unshift('(');
    funcAndArgs.push(')');

    var className = 'application';
    if (this.isApplicable()) className += ' application-applicable';

    return React.DOM.span({className: className, onClick: this.apply},
      funcAndArgs
    );
  }
});

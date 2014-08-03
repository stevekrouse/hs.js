var Application = React.createClass({displayName: 'Application',
  mixins: [NodeMixins],
  isApplicable: function() {
    return ASTTransformations.isApplicable(this.currentAST());
  },
  render: function() {
    var ast = this.props.ast;
    var funcAndArgs = this.currentAST().arguments.map(function(arg){
      return Node({ast: ast, id: arg.id});
    });

    funcAndArgs.unshift(FunctionName({ast: this.props.ast, id: this.currentAST().functionName.id}));
    funcAndArgs.unshift('(');
    funcAndArgs.push(')');

    var className = 'application';
    if (this.isApplicable()) className += ' application-applicable';

    return React.DOM.div({className: className},
      funcAndArgs
    );
  }
});

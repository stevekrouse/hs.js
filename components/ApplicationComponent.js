var Application = React.createClass({displayName: 'Application',
  mixins: [NodeMixins],
  render: function() {
    var ast = this.props.ast;
    var funcAndArgs = this.currentAST().arguments.map(function(arg){
      return Node({ast: ast, id: arg.id});
    });

    funcAndArgs.unshift(FunctionName({ast: this.props.ast, id: this.currentAST().functionName.id}));
    funcAndArgs.unshift('(');
    funcAndArgs.push(')');
    return React.DOM.div({className: "application"},
      funcAndArgs
    );
  }
});

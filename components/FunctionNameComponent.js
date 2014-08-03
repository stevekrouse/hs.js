var FunctionName = React.createClass({displayName: 'FunctionName',
  currentAST: function(){
    return ASTTransformations.subtreeById(this.props.ast, this.props.id);
  },
  render: function() {
    return React.DOM.span({className: "functionName"},
      this.currentAST().name
    );
  }
});

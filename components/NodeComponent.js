var Node = React.createClass({displayName: 'Node',
  currentAST: function(){
    return ASTTransformations.subtreeById(this.props.ast, this.props.id);
  },
  render: function() {
    currentAST = this.currentAST();

    if (currentAST.type == "application") {
      return Application({ast: this.props.ast, id: currentAST.id});
    } else if (currentAST.type == "functionName") {
      console.log(currentAST)
      return FunctionName({ast: this.props.ast, id: currentAST.id});
    } else if (currentAST.type == "list") {
      return React.DOM.span({}, "not yet implemented");
    } else {
       return React.DOM.span({}, "cannot handle ast of this type");
    }
  }
});

var Node = React.createClass({displayName: 'Node',
  mixins: [NodeMixins],
  render: function() {
    currentAST = this.currentAST();

    if (currentAST.type == "application") {
      return Application({ast: this.props.ast, id: currentAST.id});
    } else if (currentAST.type == "functionName") {
      console.log(currentAST)
      return FunctionName({ast: this.props.ast, id: currentAST.id});
    } else if (currentAST.type == "list") {
      return List({ast: this.props.ast, id: currentAST.id});
    } else if (currentAST.type == "int") {
      return Int({ast: this.props.ast, id: currentAST.id});
    } else {
       return React.DOM.span({}, "cannot handle ast of this type");
    }
  }
});

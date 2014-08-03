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
      return React.DOM.span({}, "blah");
      //return List({ast: this.props.ast, id: currentAST.id);
    } else if (currentAST.type == "int") {
      return React.DOM.span({}, "not yet implemented");
    } else {
       return React.DOM.span({}, "cannot handle ast of this type");
    }
  }
});

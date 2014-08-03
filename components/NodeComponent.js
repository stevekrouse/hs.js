var Node = React.createClass({displayName: 'Node',
  mixins: [NodeMixins],
  render: function() {
    currentAST = this.currentAST();

    if (currentAST.type == "application") {
      return Application({lineState: this.props.lineState, id: currentAST.id});
    } else if (currentAST.type == "functionName") {
      return FunctionName({lineState: this.props.lineState, id: currentAST.id});
    } else if (currentAST.type == "list") {
      return List({lineState: this.props.lineState, id: currentAST.id});
    } else if (currentAST.type == "int") {
      return Int({lineState: this.props.lineState, id: currentAST.id});
    } else {
       return React.DOM.span({}, "cannot handle ast of this type");
    }
  }
});

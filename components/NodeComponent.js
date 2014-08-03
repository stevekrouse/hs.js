var Node = React.createClass({displayName: 'Node',
  mixins: [NodeMixins],
  innerNode: function() {
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
  },
  render: function() {
    var className = '';
    if (this.props.lineState.highlightedLineIndex !== null &&
        this.props.lineState.highlightedLineIndex+1 == this.props.lineState.index &&
        this.currentAST().id === this.props.lineState.justComputedId) {
      className += ' node-highlight-just-computed';
    }
    return React.DOM.span({className: className}, this.innerNode());
  }
});

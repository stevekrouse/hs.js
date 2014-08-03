var Application = React.createClass({displayName: 'Application',
  mixins: [NodeMixins],
  isApplicable: function() {
    return this.props.lineState.index === this.props.lineState.lastIndex &&
           ASTTransformations.isApplicable(this.currentAST());
  },
  apply: function(event) {
    if (this.isApplicable()) {
      window.addLineByApplying(this.currentAST().id);
      event.stopPropagation();
    }
  },
  highlight: function() {
    if (this.isApplicable()) {
      this.previousHighlightApplicationId = this.props.lineState.applicationHighlightId;
      window.highlightApplicationId(this.currentAST().id);
    }
  },
  unhighlight: function() {
    if (this.currentAST().id === this.props.lineState.applicationHighlightId) {
      window.highlightApplicationId(this.previousHighlightApplicationId);
    }
  },
  render: function() {
    var currentAST = this.currentAST();

    var funcAndArgs = currentAST.arguments.map((function(arg){
      return Node({lineState: this.props.lineState, id: arg.id});
    }).bind(this));

    indexToAddFunction = currentAST.functionName.infix ? 1 : 0;
    funcAndArgs.splice(indexToAddFunction, 0, FunctionName({lineState: this.props.lineState, id: currentAST.functionName.id}));

    funcAndArgs.unshift('(');
    funcAndArgs.push(')');

    var className = 'application';
    if (this.isApplicable() && this.currentAST().id === this.props.lineState.applicationHighlightId) {
      className += ' application-applicable';
    }
    if (this.props.lineState.highlightedLineIndex == this.props.lineState.index && this.currentAST().id === this.props.lineState.clickedComputationId) {
      className += ' application-highlight-clicked-computation';
    }

    return React.DOM.span({
      className: className,
      onClick: this.apply,
      onMouseEnter: this.highlight,
      onMouseLeave: this.unhighlight
    },
      funcAndArgs
    );
  }
});

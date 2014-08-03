var LineContext = React.createClass({displayName: 'LineContext',
  render: function() {
    var contextId = this.props.lineState.clickedComputationId || this.props.lineState.applicationHighlightId;
    return React.DOM.div({className: 'line-context', dangerouslySetInnerHTML: {__html: ASTTransformations.getContextHTML(this.props.lineState.ast, contextId)}});
  }
});


var Line = React.createClass({displayName: 'Line',
  highlight: function() {
    window.highlightLine(this.props.lineState.index);
  },
  unhighlight: function() {
    if (this.props.lineState.highlightedLineIndex == this.props.lineState.index) {
      window.highlightLine(null);
    }
  },
  render: function() {
    var className = "line";
    var lineContext, lineEditButton;
    if (this.props.lineState.highlightedLineIndex == this.props.lineState.index) {
      className += " line-highlight";
      lineContext = LineContext({lineState: this.props.lineState, key: 2});
    }
    if (this.props.lineState.index === 0 && !this.props.lineState.editing) {
      lineEditButton = React.DOM.span({
        className: 'lines-edit',
        onClick: window.editFirstLine,
        key: 3
      }, '(edit)');
    }

    return React.DOM.div({
      className: className,
      onMouseEnter: this.highlight,
      onMouseLeave: this.unhighlight,
      key: this.props.lineState.index
    },
      React.DOM.div({className: 'line-inner'},
        [
          Node({lineState: this.props.lineState, id: this.props.lineState.ast.id, key: 1}),
          lineContext,
          lineEditButton
        ]
      )
    )
  }
});

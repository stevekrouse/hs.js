var Line = React.createClass({displayName: 'Line',
  highlight: function() {
    if (this.props.lineState.index < this.props.lineState.lastIndex) {
      window.highlightLine(this.props.lineState.index);
    }
  },
  unhighlight: function() {
    if (this.props.lineState.highlightedLineIndex == this.props.lineState.index) {
      window.highlightLine(null);
    }
  },
  render: function() {
    var className = "line";
    if (this.props.lineState.highlightedLineIndex == this.props.lineState.index) {
      className += " line-highlight";
    }

    return React.DOM.div({
      className: className,
      onMouseEnter: this.highlight,
      onMouseLeave: this.unhighlight
    },
      Node({lineState: this.props.lineState, id: this.props.lineState.ast.id}));
  }
});

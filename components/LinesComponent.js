var Lines = React.createClass({displayName: 'Lines',
  render: function() {
    return (
      React.DOM.div({className: "lines"},
        this.props.lines.map((function(line, index) {
          return Line({lineState: {
            ast: line.ast,
            index: index,
            lastIndex: this.props.lines.length-1,
            clickedComputationId: line.clickedComputationId,
            applicationHighlightId: this.props.applicationHighlightId,
            highlightedLineIndex: this.props.highlightedLineIndex
          }});
        }).bind(this))
      )
    );
  }
});

var Lines = React.createClass({displayName: 'Lines',
  render: function() {
    return (
      React.DOM.div({className: "lines"},
        this.props.ASTs.map((function(ast, index) {
          return Line({lineState: {
            ast: ast,
            index: index,
            lastIndex: this.props.ASTs.length-1,
            applicationHighlightId: this.props.applicationHighlightId,
            highlightedLineIndex: this.props.highlightedLineIndex
          }});
        }).bind(this))
      )
    );
  }
});

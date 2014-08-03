var Lines = React.createClass({displayName: 'Lines',
  render: function() {
    return (
      React.DOM.div({className: "lines"},
        this.props.ASTs.map(function(ast) {
          return Line({ast: ast});
        })
      )
    );
  }
});

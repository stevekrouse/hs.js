var Line = React.createClass({displayName: 'Line',
  render: function() {
    return React.DOM.div({className: "line"},
      Node({lineState: this.props.lineState, id: this.props.lineState.ast.id}));
  }
});

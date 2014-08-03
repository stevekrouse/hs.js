var Line = React.createClass({displayName: 'Line',
  render: function() {
    return React.DOM.div({className: "line"}, Node({ast: this.props.ast, id: this.props.ast.id}));
  }
});

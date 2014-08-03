var Int = React.createClass({displayName: 'Int',
  mixins: [NodeMixins],
  render: function() {
    return React.DOM.span({className: 'int'}, this.currentAST().value);
  }
});

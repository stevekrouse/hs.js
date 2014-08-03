var List = React.createClass({displayName: 'List',
  mixins: [NodeMixins],
  render: function() {
    items = this.currentAST().items.map((function(item){
      return Node({lineState: this.props.lineState, id: item.id});
    }).bind(this));
    items.unshift('[');
    items.push(']');
    return React.DOM.span({className: "list"}, items);
  }
});

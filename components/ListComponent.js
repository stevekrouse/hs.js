var List = React.createClass({displayName: 'List',
  mixins: [NodeMixins],
  render: function() {
    var ast = this.props.ast;
    items = this.currentAST().items.map(function(item){
      return Node({ast: ast, id: item.id});
    });
    items.unshift('[');
    items.push(']');
    return React.DOM.span({className: "list"}, items);
  }
});

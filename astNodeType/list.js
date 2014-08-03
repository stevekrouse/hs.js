window.astNodeTypes['list'] = {
  type: 'list',
  color: 'blue',
  typeSignature: '[a]',
  astToString: function(node) {
    var items = node.items.map(function(item){
      return window.ASTTransformations.astToString(item);
    });

    return '[' + items.join(" ") + ']';
  }
};

window.astNodeTypes['int'] = {
  type: 'int',
  color: 'pink',
  typeSignature: 'Int',
  astToString: function(node) {
    return node.value;
  }
};

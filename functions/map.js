var map = {
  name: 'map',
  infix: 'false',
  typeSignature: '(a -> b) -> [a] -> [b]',
  isValidApplication: function(arguments) {
   arguments[0].type === 'functionName' &&
   arguments[1].type === 'list';
  },
  patterns: [
    {
      definitionLine: "f [] = []",
      doesMatch: function(arguments){
        return node.arguments[1].items.length === 0;
      },
      apply: function(arguments){
        return {id: uuid.v4(), type: 'list', items: []}
      }
    },
    {
      definitionLine: "f (x:xs) = f x : map f xs",
      doesMatch: function(arguments){
        return node.arguments[1].items.length === 0;
      },
      apply: function(arguments){
        return {id: uuid.v4(), type: 'list', items: []}
        return {
          id: uuid.v4(),
          type: 'application',
          functionName: {id: uuid.v4(), type: 'functionName', name: ':', infix: true},
          arguments: [
            {
              id: uuid.v4(),
              type: 'application',
              functionName: node.arguments[0],
              arguments: [node.arguments[1].items[0]]
            },
            {
              id: uuid.v4(),
              type: 'application',
              functionName: {id: uuid.v4(), type: 'functionName', name: 'map'},
              arguments: [
                node.arguments[0],
                {id: uuid.v4(), type: 'list', items: node.arguments[1].items.slice(1)}
              ]
            }
          ]
        };
      }
    }
  ]
};
window.functions.push(map);

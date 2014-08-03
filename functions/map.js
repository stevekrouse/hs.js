window.functions['map'] = {
  name: 'map',
  englishName: 'map',
  color: 'brown',
  infix: false,
  typeSignature: '(a -> b) -> [a] -> [b]',
  isValidApplication: function(arguments) {
    return arguments[0].type === 'functionName' &&
           arguments[1].type === 'list';
  },
  patterns: [
    {
      definitionLine: "f [] = []",
      doesMatch: function(arguments){
        return arguments[1].items.length === 0;
      },
      apply: function(arguments){
        return {id: uuid.v4(), type: 'list', items: []};
      }
    },
    {
      definitionLine: "f (x:xs) = f x : map f xs",
      doesMatch: function(arguments){
        return arguments[1].items.length >= 1;
      },
      apply: function(arguments){
        return {
          id: uuid.v4(),
          type: 'application',
          functionName: {id: uuid.v4(), type: 'functionName', name: ':', infix: true},
          arguments: [
            {
              id: uuid.v4(),
              type: 'application',
              functionName: arguments[0],
              arguments: [arguments[1].items[0]]
            },
            {
              id: uuid.v4(),
              type: 'application',
              functionName: {id: uuid.v4(), type: 'functionName', name: 'map'},
              arguments: [
                arguments[0],
                {id: uuid.v4(), type: 'list', items: arguments[1].items.slice(1)}
              ]
            }
          ]
        };
      }
    }
  ]
};


window.functions[':'] = {
  name: ':',
  englishName: 'cons',
  color: 'black',
  infix: true,
  typeSignature: 'a -> [a] -> [a]',
  isValidApplication: function(arguments) {
    // TODO paramaterize list time
    return arguments.length === 2 &&
           arguments[1].type === 'list';
  },
  astToString: function(arguments) {
   return ":";
  },
  patterns: [
    {
      definitionLine: null,
      doesMatch: function(arguments){
        return true;
      },
      apply: function(arguments){
        var items = arguments[1].items;
        items.unshift(arguments[0]);

        return {
          id: uuid.v4(),
          type: 'list',
          items: items
        };
      }
    }
  ]
};

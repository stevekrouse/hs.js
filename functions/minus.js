window.functions['-'] = {
  name: '-',
  englishName: 'minus',
  color: 'purple',
  infix: true,
  typeSignature: 'Int -> Int -> Int',
  isValidApplication: function(arguments) {
    return arguments.length === 2      &&
           arguments[0].type === 'int' &&
           arguments[1].type === 'int';
  },
  patterns: [
    {
      definitionLine: null,
      doesMatch: function(arguments){
        return true;
      },
      apply: function(arguments){
        return {
                 id: uuid.v4(),
                 type: 'int',
                 value: arguments[0].value - arguments[1].value
               };
      }
    }
  ]
};

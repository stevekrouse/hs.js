window.functions['(+ 1)'] = {
  name: '(+ 1)',
  englishName: 'plusOne',
  color: 'rgb(124, 124, 124)',
  infix: false,
  typeSignature: 'Int -> Int',
  isValidApplication: function(arguments) {
    return arguments.length === 1 &&
           arguments[0].type === 'int';
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
                 value: arguments[0].value + 1
               };
      }
    }
  ]
};

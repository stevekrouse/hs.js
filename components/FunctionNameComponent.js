var FunctionName = React.createClass({displayName: 'FunctionName',
  mixins: [NodeMixins],
  render: function() {
    var functionName = this.currentAST().name;
    var func = window.functions[functionName];

    funcCSS = 'function-' + func.englishName;
    className = "functionName " + funcCSS;

    return React.DOM.span({className: className, style: {color: func.color}},
      functionName
    );
  }
});

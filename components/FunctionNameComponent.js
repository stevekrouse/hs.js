var FunctionName = React.createClass({displayName: 'FunctionName',
  mixins: [NodeMixins],
  render: function() {
    var functionName = this.currentAST().name;
    var func = window.functions[functionName];

    color = func ? func.color : 'black';

    return React.DOM.span({className: "functionName", style: {color: color}},
      functionName
    );
  }
});

var FunctionName = React.createClass({displayName: 'FunctionName',
  mixins: [NodeMixins],
  render: function() {
    var functionName = this.currentAST().name;
    var func = window.functions[functionName];


    if (functionName === "map"){
      var color = 'red';
    } else if (functionName.indexOf("fold") >= 0){
      var color = 'blue';
    } else {
      var color = func ? func.color : 'black';
    }

    return React.DOM.span({className: "functionName", style: {color: color}, key: this.currentAST().id},
      functionName
    );
  }
});

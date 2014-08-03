var FunctionName = React.createClass({displayName: 'FunctionName',
  mixins: [NodeMixins],
  render: function() {
    return React.DOM.span({className: "functionName"},
      this.currentAST().name
    );
  }
});

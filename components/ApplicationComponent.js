var Application = React.createClass({displayName: 'Application',
  mixins: [NodeMixins],
  isApplicable: function() {
    return this.props.lineState.index === this.props.lineState.lastIndex &&
           ASTTransformations.isApplicable(this.currentAST());
  },
  apply: function() {
    if (this.isApplicable()) {
      window.addLineByApplying(this.currentAST().id);
    }
  },
  render: function() {
    var currentAST = this.currentAST();

    var funcAndArgs = currentAST.arguments.map((function(arg){
      return Node({lineState: this.props.lineState, id: arg.id});
    }).bind(this));

    indexToAddFunction = currentAST.functionName.infix ? 1 : 0;
    funcAndArgs.splice(indexToAddFunction, 0, FunctionName({lineState: this.props.lineState, id: currentAST.functionName.id}));

    funcAndArgs.unshift('(');
    funcAndArgs.push(')');

    var className = 'application';
    if (this.isApplicable()) className += ' application-applicable';

    return React.DOM.span({className: className, onClick: this.apply},
      funcAndArgs
    );
  }
});

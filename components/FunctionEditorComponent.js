var FunctionEditor = React.createClass({displayName: 'FunctionEditor',
  getInitialState: function() {
    return {editing: false, error: false};
  },
  onClick: function() {
    this.setState({editing: !this.state.editing});
  },
  onChange: function(e) {
    try {
      this.props.program.updateFunctionDefinitions(e.target.value);
      this.setState({error: false});
    } catch (e) {
      this.setState({error: true});
    }
  },
  render: function() {
    if (this.state.editing) {
      return React.DOM.div({}, [
        React.DOM.textarea({
          className: "function-editor" + (this.state.error ? ' function-editor-error' : ''),
          value: this.props.functionDefinitions,
          onChange: this.onChange
        }),
        React.DOM.div({
          className: "function-editor-link",
          onClick: this.onClick
        }, '(close)')
      ]);
    } else {
      return (
        React.DOM.div({
          className: "function-editor-link",
          onClick: this.onClick
        }, '(edit functions)')
      );
    }
  }
});

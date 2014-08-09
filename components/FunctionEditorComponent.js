var FunctionEditor = React.createClass({displayName: 'FunctionEditor',
  getInitialState: function() {
    return {editing: true, error: false, functionDefinitions: this.props.defaultFunctionDefinitions};
  },
  onClick: function() {
    this.setState({editing: !this.state.editing});
  },
  onChange: function(e) {
    try {
      this.updateFunctionDefinitions(e.target.value);
      this.setState({error: false});
    } catch (e) {
      this.setState({error: e});
    }
  },
  render: function() {
    if (this.state.editing) {
      var errorDiv;
      if (this.state.error) {
        var textAreaScrollTop = this.refs.textarea ? this.refs.textarea.getDOMNode().scrollTop : 0;

        errorDiv = React.DOM.div({
          className: 'function-editor-error-message',
          style: {top: 15*(this.state.error.line-1) - textAreaScrollTop},
          key: 3
        }, this.state.error.message);
      }

      return React.DOM.div({className: 'function-editor-container'}, [
        React.DOM.textarea({
          spellCheck: 'false',
          className: "function-editor" + (this.state.error ? ' function-editor-error' : ''),
          value: this.state.functionDefinitions,
          onChange: this.onChange,
          onKeyUp: this.onChange,
          onScroll: function() { this.forceUpdate(); }.bind(this),
          key: 1,
          ref: 'textarea'
        }),
        React.DOM.div({
          className: "function-editor-top",
          key: 2
        }, [
             React.DOM.span({className: "function-editor-title function-editor-title-big", key: 1}, 'Function Editor'),
             // React.DOM.span({className: "function-editor-link", onClick: this.onClick}, '(close)')
           ]
        ),
        errorDiv
      ]);
    } else {
      return (
        React.DOM.div({
          className: "function-editor-top",
        }, [
             React.DOM.span({className: "function-editor-title function-editor-title-big", key: 1}, 'Function Editor'),
             // React.DOM.span({className: "function-editor-link", onClick: this.onClick}, '(open)')
           ]
        )
      );
    }
  },
  componentWillMount: function() {
    this.updateFunctionDefinitions(this.state.functionDefinitions);
  },
  updateFunctionDefinitions: function(text) {
    this.setState({functionDefinitions: text});

    window.functions = {
      ':': window.functions[':'],
      '+': window.functions['+'],
      '-': window.functions['-']
    };

    var newFunctions = HaskellParser.parse(text + "\n\n", {startRule: 'functionDefinitionList'});
    newFunctions.forEach(function(func) {
      if ([':', '+', '-'].indexOf(func.name) < 0) {
        window.functions[func.name] = func;
      }
    });
  }
});

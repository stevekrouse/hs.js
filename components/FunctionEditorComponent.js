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
      this.setState({error: true});
    }
  },
  render: function() {
    if (this.state.editing) {
      return React.DOM.div({}, [
        React.DOM.textarea({
          spellCheck: 'false',
          className: "function-editor" + (this.state.error ? ' function-editor-error' : ''),
          value: this.state.functionDefinitions,
          onChange: this.onChange
        }),
        React.DOM.div({
          className: "function-editor-top",
        }, [
             React.DOM.span({className: "function-editor-title function-editor-title-big"}, 'Function Editor'),
             // React.DOM.span({className: "function-editor-link", onClick: this.onClick}, '(close)')
           ]
        )
      ]);
    } else {
      return (
        React.DOM.div({
          className: "function-editor-top",
        }, [
             React.DOM.span({className: "function-editor-title function-editor-title-big"}, 'Function Editor'),
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

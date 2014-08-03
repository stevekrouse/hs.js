var LineContext = React.createClass({displayName: 'LineContext',
  render: function() {
    var contextId = this.props.lineState.clickedComputationId || this.props.lineState.applicationHighlightId;
    return React.DOM.div({className: 'line-context', dangerouslySetInnerHTML: {__html: ASTTransformations.getContextHTML(this.props.lineState.ast, contextId)}});
  }
});


var Line = React.createClass({displayName: 'Line',
  getInitialState: function() {
    return {editingError: false, textLength: null};
  },
  onTextChange: function(event) {
    this.setState({textLength: event.target.value.length});
    try {
      HaskellParser.parse(event.target.value);
      this.setState({editingError: false});
    } catch (e) {
      this.setState({editingError: true});
    }
  },
  componentDidUpdate: function(){
    if (this.getDOMNode().tagName === "INPUT"){
      this.getDOMNode().focus();
    }
  },
  onKeyDown: function(event) {
    if (event.keyCode === 13) {
      try {
        event.preventDefault();
        window.updateInitialAST(this.props.lineState.ast.id, HaskellParser.parse(event.target.value));
        this.setState({editingError: false});
      } catch (e) {
        this.setState({editingError: true});
      }
    }
  },
  listText: function() {
    return window.ASTTransformations.astToString(this.props.lineState.ast);
  },
  highlight: function() {
    window.highlightLine(this.props.lineState.index);
  },
  unhighlight: function() {
    if (this.props.lineState.highlightedLineIndex == this.props.lineState.index) {
      window.highlightLine(null);
    }
  },
  render: function() {
    var className = "line";
    var lineContext, lineEditButton;
    if (this.props.lineState.highlightedLineIndex == this.props.lineState.index) {
      className += " line-highlight";
      lineContext = LineContext({lineState: this.props.lineState, key: 2});
    }
    if (this.props.lineState.index === 0 && !this.props.lineState.editing) {
      lineEditButton = React.DOM.span({
        className: 'lines-edit',
        onClick: window.editFirstLine,
        key: 3
      }, 'edit input haskell (advanced)');
    }

    if (this.props.lineState.editing) {
      return React.DOM.input({
        defaultValue: this.listText(),
        onClick: function(event){event.stopPropagation();},
        onChange: this.onTextChange,
        onKeyDown: this.onKeyDown,
        className: (this.state.editingError ? 'input-error' : ''),
        style: {width: Math.max(100, (this.state.textLength || this.listText().length)*8)}
      });
    } else {
      return React.DOM.div({
        className: className,
        onMouseEnter: this.highlight,
        onMouseLeave: this.unhighlight
      },
        React.DOM.div({className: 'line-inner'},
          [
            Node({lineState: this.props.lineState, id: this.props.lineState.ast.id, key: 1}),
            lineContext,
            lineEditButton
          ]
        )
      );
    }
  }
});

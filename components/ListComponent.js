var List = React.createClass({displayName: 'List',
  mixins: [NodeMixins],
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
  onKeyDown: function(event) {
    if (event.keyCode === 13) {
      try {
        event.preventDefault();
        window.updateInitialAST(this.currentAST().id, HaskellParser.parse(event.target.value));
        this.setState({editingError: false});
      } catch (e) {
        this.setState({editingError: true});
      }
    }
  },
  listText: function() {
    return window.ASTTransformations.astToString(this.currentAST());
  },
  render: function() {
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
      items = this.currentAST().items.map((function(item){
        return Node({lineState: this.props.lineState, id: item.id});
      }).bind(this));
      items.unshift('[');
      items.push(']');
      return React.DOM.span({className: "list"}, items);
    }
  }
});

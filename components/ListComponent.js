var List = React.createClass({displayName: 'List',
  mixins: [NodeMixins],
  getInitialState: function() {
    return {editingError: false};
  },
  onTextChange: function(event) {
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
  render: function() {
    if (this.props.lineState.editing) {
      return React.DOM.input({
        defaultValue: window.ASTTransformations.astToString(this.currentAST()),
        onClick: function(event){event.stopPropagation();},
        onChange: this.onTextChange,
        onKeyDown: this.onKeyDown,
        className: (this.state.editingError ? 'input-error' : '')
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

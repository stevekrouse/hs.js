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
  componentDidUpdate: function(){
    if (this.getDOMNode().tagName === "INPUT"){
      this.getDOMNode().focus();
      var length = this.getDOMNode().value.length;
      this.getDOMNode().setSelectionRange(length - 1, length - 1);
    }
  },
  onKeyDown: function(event) {
    if (event.keyCode === 13) {
      try {
        event.preventDefault();
        this.props.lineState.program.updateInitialAST(this.currentAST().id, HaskellParser.parse(event.target.value));
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
      var listItems = this.currentAST().items;
      var items = [];
      items.push('[');
      for (var i=0; i<listItems.length; i++) {
        var listItem = listItems[i];
        items.push(Node({lineState: this.props.lineState, id: listItem.id, key: listItem.id}));
        if (i<listItems.length-1) items.push(',');
      }
      items.push(']');
      return React.DOM.span({className: "list"}, items);
    }
  }
});

// tutorial1-raw.js
var Line = React.createClass({displayName: 'Line',
  render: function() {
    if (this.props.ast.type == "application") {
      return React.DOM.div({}, "not yet implemented");
    } else if (this.props.ast.type == "list") {
      return React.DOM.div({}, "not yet implemented");
    } else if (this.props.ast.type == "list") {
      return React.DOM.div({}, "not yet implemented");
    } else {
       return React.DOM.div({}, "cannot handle ast of this type");
    }
  }
});

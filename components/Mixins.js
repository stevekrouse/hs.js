NodeMixins = {
  currentAST: function(){
    return ASTTransformations.subtreeById(this.props.lineState.ast, this.props.id);
  }
}

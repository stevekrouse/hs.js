NodeMixins = {
  currentAST: function(){
    return ASTTransformations.subtreeById(this.props.ast, this.props.id);
  }
}

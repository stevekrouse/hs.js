{
  function randomId() { return (window.uuid ? uuid.v4() : 'placeholder'); }
}

start
  = expressionWithFunction

functionDefinitionList
  = functionDefinitionPlusWhitespace*

functionDefinitionPlusWhitespace
  = functionDefinition:functionDefinition whitespace_newline { return functionDefinition; }

functionDefinition
  = functionName:functionName typeSignature:functionDefinitionTypeSignature whitespace_newline patterns:(functionDefinitionPatternLine)+ { return {
    name: functionName.name,
    englishName: functionName.name,
    typeSignature: typeSignature,
    patterns: patterns,
    isValidApplication: function(functionArguments) { return functionArguments.length === patterns[0].numberOfArguments;
  }}; }

functionDefinitionTypeSignature
  = whitespace "::" whitespace typesig:[ A-Za-z>-]+ { return typesig.join(""); }

functionDefinitionPatternLine
  = functionName patternArguments:functionNameWithWhitespace* whitespace? "=" whitespace exp:expressionWithFunction { return {
    definitionLine: text(),
    numberOfArguments: patternArguments.length,
    doesMatch: function() { return true; },
    apply: function(functionArguments) { return ASTTransformations.fillInArguments(exp, patternArguments, functionArguments); }
  }; }

functionNameWithWhitespace
  = whitespace functionName:functionName { return functionName; }

expression
  = "(" whitespace? exp:expressionWithFunction whitespace? ")" { return exp; }
  / list
  / integer
  / functionName

expressionWithFunction
  = infixFunctionApplication
  / functionApplication
  / expression

functionApplication
  = f:functionName whitespace args:expression_list {return {functionName: f, type: 'application', id: randomId(), arguments: args}};

infixFunctionApplication
  = left:expression whitespace f:infixFunctionName whitespace right:expressionWithFunction { return {id: randomId(), functionName: f, type: "application", arguments: [left, right]}}

list
  = "[" whitespace? list:expression_list? whitespace? "]" { return { id: randomId(), type: "list", items: list || [] }; }

expression_list
  = exp1:expression list:(whitespace_expression)* { list.unshift(exp1); return list; }

whitespace_expression
  = whitespace exp:expression { return exp; }

functionName
  = letters:[A-Za-z]+ { return {id: randomId(), type: 'functionName', name: letters.join(""), infix: false}; }
  / "(+ 1)" { return {id: randomId(), type: 'functionName', name: '(+ 1)', infix: false}; }

infixFunctionName
  = "+" { return {id: randomId(), type: 'functionName', name: '+', infix: true}; }

integer
  = digits:[0-9]+ { return { id: randomId(), type: "int", value: parseInt(digits.join(""), 10)} ; }

whitespace
  = " "+

whitespace_newline
  = [ \n]+

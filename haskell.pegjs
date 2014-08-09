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
  = functionName:functionName typeSignature:functionDefinitionTypeSignature patterns:functionDefinitionPatternLine+ { return {
    name: functionName.name,
    englishName: functionName.name,
    typeSignature: typeSignature,
    patterns: patterns,
    isValidApplication: function(functionArguments) { return functionArguments.length === patterns[0].numberOfArguments;
  }}; }

functionDefinitionTypeSignature
  = whitespace "::" whitespace typesig:[ \(\)\[\]A-Za-z>-]+ { return typesig.join(""); }

functionDefinitionPatternLine
  = whitespace_newline functionName part:functionDefinitionPatternPartOfLine { return part; }

functionDefinitionPatternPartOfLine
  = patternArguments:patternWithWhitespace* whitespace? "=" whitespace exp:expressionWithFunction { return {
    definitionLine: text(),
    numberOfArguments: patternArguments.length,
    doesMatch: function(args) {
      for (var i=0; i<patternArguments.length; i++) {
        if(patternArguments[i].doesMatch && !patternArguments[i].doesMatch(args[i])) return false;
      }
      return true;
    },
    apply: function(functionArguments) { return ASTTransformations.fillInArguments(exp, patternArguments, functionArguments); }
  }; }

patternWithWhitespace
  = whitespace pattern:pattern { return pattern; }

pattern
  = "[" whitespace* "]" { return {id: randomId(), type: "emptyListPattern", doesMatch: function(arg) { return arg.type === "list" && arg.items.length === 0; } }; }
  / "(" left:functionName ":" right:functionName ")" { return {id: randomId(), type: "listPattern", left: left, right: right, doesMatch: function(arg) { return arg.type === "list" && arg.items.length > 0 } }; }
  / functionName
  / integer:integer { integer.doesMatch = function(arg) { return arg.type === "int" && arg.value === integer.value; }; return integer; }

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
  = left:expression whitespace? f:infixFunctionName whitespace? right:expressionWithFunction { return {id: randomId(), functionName: f, type: "application", arguments: [left, right]}}

expression_list
  = exp1:expression list:(whitespace_expression)* { list.unshift(exp1); return list; }

whitespace_expression
  = whitespace exp:expression { return exp; }

list
  = "[" whitespace? list:comma_expression_list? whitespace? "]" { return { id: randomId(), type: "list", items: list || [] }; }

comma_expression_list
  = exp1:expression list:(comma_expression)* { list.unshift(exp1); return list; }

comma_expression
  = whitespace? "," whitespace? exp:expression { return exp; }


functionName
  = letters:[A-Za-z]+ { return {id: randomId(), type: 'functionName', name: letters.join(""), infix: false}; }

infixFunctionName
  = "+" { return {id: randomId(), type: 'functionName', name: '+', infix: true}; }
  / "-" { return {id: randomId(), type: 'functionName', name: '-', infix: true}; }
  / ":" { return {id: randomId(), type: 'functionName', name: ':', infix: true}; }

integer
  = digits:[0-9]+ { return { id: randomId(), type: "int", value: parseInt(digits.join(""), 10)} ; }

whitespace
  = " "+

whitespace_newline
  = [ \n]+

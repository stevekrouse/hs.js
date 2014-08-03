{
  function randomId() { return (window.uuid ? uuid.v4() : 'placeholder'); }
}

start
  = expression

expression
  = "(" whitespace? exp:expressionWithInfix whitespace? ")" { return exp; }
  / list
  / functionApplication
  / integer

expressionWithInfix
  = infixFunctionApplication
  / expression

functionApplication
  = f:functionName whitespace args:expression_list {return {functionName: f, type: 'application', id: randomId(), arguments: args}};

infixFunctionApplication
  = left:expression whitespace f:infixFunctionName whitespace right:expressionWithInfix { return {id: randomId(), functionName: f, type: "application", arguments: [left, right]}}

list
  = "[" whitespace? list:expression_list? whitespace? "]" { return { id: randomId(), type: "list", items: list }; }

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

{
  function randomId() { return (window.uuid ? uuid.v4() : 'placeholder'); }
}

start
  = list

list
  = "[" whitespace? list:expression_list? whitespace? "]" { return { id: randomId(), type: "list", items: list }; }

expression_list
  = exp1:expression list:(whitespace_expression)* { list.unshift(exp1); return list; }

whitespace_expression
  = whitespace exp:expression { return exp; }

expression
  = integer

integer
  = digits:[0-9]+ { return { id: randomId(), type: "int", value: parseInt(digits.join(""), 10)} ; }

whitespace
  = " "+

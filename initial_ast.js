window.initialAST = {
  id: uuid.v4(),
  type: "application",
  functionName: {id: uuid.v4(), type: "functionName", name: "map"},
  arguments: [
    {id: uuid.v4(), type: "functionName", name: "(+ 1)"},
    {id: uuid.v4(), type: "list", items: [
      {id: uuid.v4(), type: "int", value: 1},
      {id: uuid.v4(), type: "int", value: 2},
      {id: uuid.v4(), type: "int", value: 3},
      {id: uuid.v4(), type: "int", value: 4},
      {id: uuid.v4(), type: "int", value: 5},
    ]}
  ]
};

window.initialFunctionDefinitions = "double :: a -> a\ndouble x = x + x\n";

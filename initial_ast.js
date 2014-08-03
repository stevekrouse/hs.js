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

window.initialFunctionDefinitions = "map :: (a -> b) -> [a] -> [b]"            + "\n" +
                                    "map f []     = []"                        + "\n" +
                                    "map f (x:xs) = (f x) : map f xs"          + "\n" +
                                    ""                                         + "\n" +
                                    "fold :: (a -> b) -> b -> [a] -> [b]"      + "\n" +
                                    "fold f i []     = []"                     + "\n" +
                                    "fold f i (x:xs) = f x (fold f i xs)"      + "\n" +
                                    ""                                         + "\n" +
                                    "plus :: Int -> Int -> Int"                + "\n" +
                                    "plus x y = x + y"                         + "\n" +
                                    ""                                         + "\n" +
                                    "double :: Int -> Int"                     + "\n" +
                                    "double x = x + x"                         + "\n";

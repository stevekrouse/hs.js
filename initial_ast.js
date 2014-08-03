window.initialFunctionDefinitions = "map :: (a -> b) -> [a] -> [b]"            + "\n" +
                                    "map f []     = []"                        + "\n" +
                                    "map f (x:xs) = (f x) : map f xs"          + "\n" +
                                    ""                                         + "\n" +
                                    "fold :: (a -> b) -> b -> [a] -> [b]"      + "\n" +
                                    "fold f i []     = i"                      + "\n" +
                                    "fold f i (x:xs) = f x (fold f i xs)"      + "\n" +
                                    ""                                         + "\n" +
                                    "plus :: Int -> Int -> Int"                + "\n" +
                                    "plus x y = x + y"                         + "\n" +
                                    ""                                         + "\n" +
                                    "addOne :: Int -> Int"                     + "\n" +
                                    "addOne x = x + 1"                         + "\n" +
                                    ""                                         + "\n" +
                                    "double :: Int -> Int"                     + "\n" +
                                    "double x = x + x"                         + "\n";

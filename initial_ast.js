window.initialFunctionDefinitions = "map :: (a -> b) -> [a] -> [b]"            + "\n" +
                                    "map f []     = []"                        + "\n" +
                                    "map f (x:xs) = (f x) : map f xs"          + "\n" +
                                    ""                                         + "\n" +
                                    "foldl :: (a -> b -> a) -> a -> [b] -> a"  + "\n" +
                                    "foldl f i []     = i"                     + "\n" +
                                    "foldl f i (x:xs) = f (foldl f i xs) x"    + "\n" +
                                    ""                                         + "\n" +
                                    "foldr :: (a -> b -> b) -> b -> [a] -> b"  + "\n" +
                                    "foldr f i []     = i"                     + "\n" +
                                    "foldr f i (x:xs) = f x (foldr f i xs)"    + "\n" +
                                    ""                                         + "\n" +
                                    "plus :: Int -> Int -> Int"                + "\n" +
                                    "plus x y = x + y"                         + "\n" +
                                    ""                                         + "\n" +
                                    "addOne :: Int -> Int"                     + "\n" +
                                    "addOne x = x + 1"                         + "\n" +
                                    ""                                         + "\n" +
                                    "double :: Int -> Int"                     + "\n" +
                                    "double x = x + x"                         + "\n" +
                                    ""                                         + "\n" +
                                    "take :: Int -> [a] -> [a]"                + "\n" +
                                    "take 0 xs = []"                           + "\n" +
                                    "take n [] = []"                           + "\n" +
                                    "take n (x:xs) = (x : (take (n - 1) xs))"  + "\n";

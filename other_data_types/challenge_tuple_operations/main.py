# Current inventory on shelf
shelf = ("apples", "oranges", "bananas", "apples", "grapes", "bananas", "apples")

#My code

apple_count = shelf.count("apples")
print("Number of Apples:", apple_count)

banana_index = shelf.index("bananas")
print("First Banana Index:", banana_index)

if apple_count < 5:
    print("Apples need to be restocked.")
else:
    print("Apples are sufficiantly stocked.")

grape_count = shelf.count("grapes")
if grape_count == 1:
    print("Grapes need to be restocked.")
else:
    print("Grapes are sufficiantly stocked")

if "oranges" in shelf:
    print("Oranges are at index:", shelf.index("oranges"))
else:
    print("Oranges are out of stock.")
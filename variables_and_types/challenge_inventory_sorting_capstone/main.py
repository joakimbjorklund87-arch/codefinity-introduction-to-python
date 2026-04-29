# Lists of items and categories for slicing
items = "Bubblegum, Chocolate, Pasta"
categories = "Candy Aisle, Pasta Aisle"

candy1 = items[0:9]
candy2 = items[10:20]
dry_goods = items[21:]

category1 = categories[0:11]
category2 = categories[12:]

bubblegum_price = "$1.50"
chocolate_price = "$2.00"
pasta_price = "$5.40"





print(f"We have {candy1} for {bubblegum_price} in the {category1}")
print(f"We have{candy2} for {chocolate_price} in the {category1}")
print(f"We have{dry_goods} for {pasta_price} in the{category2}")








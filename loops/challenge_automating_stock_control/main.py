# Initialize the inventory dictionary with stock details
inventory = {
    "Bread": [30, 50, 10, False],   # "Item": [current stock, minimum stock, restock quantity, on sale (True/False)]
    "Eggs": [120, 200, 40, False],
    "Milk": [60, 100, 20, False],
    "Apples": [15, 50, 15, False]
}

discount_threshold = 100

print("Processing started")

for item in inventory:
    print(f"Processing {item}")
    current, minimum, restock_amt, on_sale = inventory[item]
    while current < minimum:
        current += restock_amt
        inventory[item][0] = current
    if current > discount_threshold and not on_sale:
        inventory[item][3] = True
    print("Processing completed")

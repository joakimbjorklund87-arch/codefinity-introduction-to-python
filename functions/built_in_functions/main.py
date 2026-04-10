# Dictionary of products with price and quantity sold as strings
products = {
    "Apple": ["1.20", "50"],   # "Item": [price, quantity sold]
    "Banana": ["0.50", "100"],
    "Cherry": ["2.50", "25"],
    "Mango": ["1.75", "40"]
}
total_sales_list = []

for item in products:
    price, quantity_sold = products[item]
    price_converted = float(price)
    quantity_sold_int = int(quantity_sold)
    total_item_sales = price_converted * quantity_sold_int
    total_sales_list.append(total_item_sales)
    print(f"Total sales for {item}:${total_item_sales}")


total_sum = sum(total_sales_list)
print("Total sum of all sales: $", total_sum)
min_sales = min(total_sales_list)
print("Minimum sales: $", min_sales)
max_sales = max(total_sales_list)
print("Maximum sales: $", max_sales)
# List of products, their prices, and the quantities sold
products = ["Bread", "Apples", "Oranges", "Bananas"]
prices = [0.50, 1.20, 2.50, 2.00]  # price per item
quantities_sold = [150, 200, 100, 50]  # number of items sold

# Example of expected output line (do not remove):
#print(f"{revenue[0]} has total revenue of ${revenue[1]}")

revenue = [] 

def calculate_revenue(price,quantity):   
    revenue =[]
    for x in range(len(price)):
        revenues = price[x]*quantity[x]
        revenue.append(revenues)
    return(revenue)

revenue = calculate_revenue(prices, quantities_sold)


def formatted_output(name, numbers):
    new_list = list(zip(name, numbers))
    new_list.sort()
    return(new_list)

revenue_per_product = formatted_output(products, revenue)
print(revenue_per_product)

#revenue_per_product = list(zip(products, revenue))
#revenue_per_product.sort()

for product in range(len(revenue_per_product)):
    print(f"{products[product]} has total revenue of ${revenue[product]}")
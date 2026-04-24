# Call the function and print the result
#apples_total_cost = calculate_total_cost(1.50, 10)


#My coode
def calculate_total_cost(price, quantity):
    total = price*quantity
    return total

apples_total_cost = calculate_total_cost(1.50, 10)
print(f"The total cost for apples is ${apples_total_cost}")

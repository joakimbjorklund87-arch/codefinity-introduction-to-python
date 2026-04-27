# List of product prices
product_prices = [1.50, 2.50, 3.00, 0.99, 2.30]


#My code
def apply_discount(product_prices):
    prices_copy = product_prices.copy()
    for prices in range(len(prices_copy)):
        if prices_copy[prices] > 2:
            prices_copy[prices] *= 0.90
    return prices_copy






# Call the function and store the updated prices
updated_prices = apply_discount(product_prices)
print("Updated product prices: $", updated_prices)
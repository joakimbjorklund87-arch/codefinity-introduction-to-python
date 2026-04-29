# Input variables
days_until_expiration = 5  # Example value
stock_level = 60  # Example value
product_type = "Perishable"  # Can be "Perishable" or "Non-Perishable"

#My code
product_type == "Perishable"

if days_until_expiration <= 3 and stock_level > 50:
    print("30% discount applied")
if days_until_expiration > 3 and days_until_expiration < 7 and  stock_level > 50:
    print("20% discount applied")
if days_until_expiration >= 7 and  stock_level <= 50:
    print("10% discount applied")

if product_type != "Perishable":
    print("No discount available for non-perishable items.")
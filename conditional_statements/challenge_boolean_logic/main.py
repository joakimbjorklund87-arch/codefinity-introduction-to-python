seasonal = True
on_sale = False
selling_well = False
current_stock = 150
high_stock_threshold = 100


overstock_risk = seasonal and current_stock > high_stock_threshold
discount_eligible =  not selling_well and not on_sale
make_discount = overstock_risk or discount_eligible

"""
print(overstock_risk)
print(discount_eligiable)
print(make_discount)
"""
#print(discount_eligiable)
print("Should the item be discounted?", make_discount)
import os, json
def editfile():
    data_file= 'static/data/order.json'
    with open(data_file, 'r', encoding='utf-8') as f:
        data= json.load(f)
    orders= []
    status_map = {}
    for item in data: 
        if 'order_id' in item: 
            orders.append(item)
        elif 'id' in item and 'status' in item:
            status_map[item['id']]= item['status']

    for order in orders:
        if order['order_id'] in status_map:
            order['status']= status_map[order['order_id']]
    
    # Delete order id first 
    return orders

    
editfile()

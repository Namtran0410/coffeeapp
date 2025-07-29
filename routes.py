from flask import Flask, jsonify, render_template, request
import os, json

app = Flask(__name__)
navigate_dashboard= False
@app.route('/')
def login():
    return render_template('login/login.html')

@app.route('/login', methods=['GET', 'POST'])
def login_user():
    data= request.get_json()
    username= data.get('username')
    password= data.get('password')

    user_file='static/data/user.json'
    os.makedirs('static/data', exist_ok=True)

    with open(user_file, 'r' ,encoding='utf-8') as f:
        user_data= json.load(f)

    for inf in user_data:
        if (username == inf['user'] and password == inf['pass']) :
            return jsonify({'navigate_dashboard': True})
    return jsonify({'navigate_dashboard': False})

def loadOrderFile():
    file_path= 'static/data/order.json'
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    if not os.path.exists(file_path):
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump([],f, indent=2, ensure_ascii=False)

    # Nếu file tồn tại nhưng rỗng hoặc sai định dạng JSON
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            if not isinstance(data, list):
                data = []
    except (json.JSONDecodeError, ValueError):
        # Ghi lại [] nếu file bị rỗng hoặc hỏng
        data = []
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
    return data 

@app.route('/dashboard', methods=['GET', 'POST'])
def dashboard_navigate():
    return render_template('dashboard/dashboard.html')

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

@app.route('/dashboard/orders', methods=['GET', 'POST'])
def dashboard_order():
    data_file = 'static/data/order.json'
    post_data= request.get_json()
    # Response order data
    order_data = loadOrderFile()
    if request.method == 'POST':
        if not isinstance(post_data, list):
            post_data = [post_data]

        order_data.extend(post_data)
        with open(data_file, 'w', encoding='utf-8') as f:
            json.dump(order_data, f, indent=2, ensure_ascii=False)
        data= editfile()
        with open(data_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

        return jsonify(data)
    return render_template('dashboard/dashboard.html', active_tab='orders')

@app.route('/dashboard/orders/delete', methods= ['GET','POST'])
def deleteRow():
    data_file= 'static/data/order.json'
    post_data= request.get_json()

    if request.method == 'POST':
        if not isinstance(post_data, list):
            post_data = [post_data]
    order_id_delete= []
    for item in post_data[0]["delete_data"]:
        order_id_delete.append(item['order_id'])

    with open(data_file, 'r', encoding='utf-8' ) as f:
        data_order= json.load(f)
    
    for item in data_order[:]:
        if item["order_id"] in order_id_delete:
            data_order.remove(item)
    with open(data_file, 'w', encoding='utf-8') as f:
        json.dump(data_order, f, indent=2, ensure_ascii=False)
    return jsonify(post_data)


#============= Revenue =============
# Trả về data đơn hàng 
@app.route('/dashboard/revenue', methods=['GET', 'POST'])
def revenue():
    #Trả về data 
    file_path= 'static/data/order.json'
    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    try: 
        with open(file_path, 'r', encoding='utf-8') as f:
            data= json.load(f)
            if not isinstance(data, list):
                data= []
    except (json.JSONDecodeError, ValueError):
        data= []
        with open(file_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii= False)
    
    # Nếu là POST: xử lý dữ liệu gửi từ client
    if request.method == 'POST':
        incoming = request.get_json()
    
    # Lọc các data, tạo thành list có dạng 
    # revenue = [{date:revenue}]
    revenue = []
    dict_revenue= {}
    for order in data:
        order_date= order['order_date']
        if order_date not in dict_revenue:
            dict_revenue[order_date] = 0
        for item in order['order_menu']:
            price= int(item['price'])
            quantity= int(item['order_quantity'])
            dict_revenue[order_date] += price * quantity

    revenue.append(dict_revenue)

    return jsonify(revenue)

if __name__ == '__main__':
    app.run(debug=True)

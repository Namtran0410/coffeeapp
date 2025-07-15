from nt import mkdir
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


@app.route('/dashboard/orders', methods=['GET', 'POST'])
def dashboard_order():
    data_file = 'static/data/order.json'
    post_data= request.get_json()


    order_data = loadOrderFile()
    if request.method == 'POST':
        if not isinstance(post_data, list):
            post_data = [post_data]

        order_data.extend(post_data)
        final_data= []
        with open(data_file, 'w', encoding='utf-8') as f:
            json.dump(order_data, f, indent=2, ensure_ascii=False)
        return jsonify(order_data)

    return render_template('dashboard/dashboard.html', orders=order_data, active_tab='orders')



























if __name__ == '__main__':
    app.run(debug=True)

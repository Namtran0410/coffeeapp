function changeTab(id) {
    // xóa hết các active class - a 
    document.querySelectorAll('.sidebar a').forEach(el=> {
        el.classList.remove('active')
    })

    // add active cho selected tab 
    const activeLink= document.getElementById(id)
    if (activeLink) {
        activeLink.classList.add('active')
    }

    // ẩn hết các tab
    document.querySelectorAll('.tab-content').forEach(el=> {
        el.classList.remove('active')
    })

    // hiện các tab được chọn 
    const activeContent= document.getElementById(`${id}-content`)
    if (activeContent) {
        activeContent.classList.add('active')
    }
}

const selectedItems = []

function openOrderForm() {
    document.querySelector('.popup-form').style.display = 'block';

    // gán mã đơn ngẫu nhiên 
    const input= document.getElementById('order-id')
    input.value= generateRandomOrderId()
  }
function closeOrderForm() {
    document.querySelector('.popup-form').style.display = 'none'
    
}

function generateRandomOrderId() {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // tháng 01-12
    const dd = String(today.getDate()).padStart(2, '0');
    const dateStr = `${yyyy}${mm}${dd}`;
  
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomStr = '';
    for (let i = 0; i < 5; i++) {
      randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    return dateStr + '-' + randomStr;
  }

function addDrinkRow(button) {
    const row = button.parentElement;
    const select = row.querySelector('.drink-select');
    const qtyInput = row.querySelector('.drink-qty');
    const value = select.value;
    const quantity = parseInt(qtyInput.value);
    const id = document.getElementById('order-id').value.trim();

    if (!value || quantity < 1) {
        alert('Vui lòng chọn đồ uống và số lượng hợp lệ!');
        return;
    }

    const [name, price] = value.split('|');

    // Kiểm tra xem món đã tồn tại trong selectedItems chưa
    const existing = selectedItems.find(item => item.order_name === name);

    if (existing) {
        existing.order_quantity += quantity;
    } else {
        selectedItems.push({
            order_name: name,
            order_quantity: quantity,
            price: price
        });
    }

    // Hiển thị lại danh sách
    const display = document.getElementById('selected-drinks');
    display.innerHTML = ''; // xóa cũ

    selectedItems.forEach(item => {
        const a = document.createElement('a');
        a.textContent = `• ${item.order_name} x ${item.order_quantity} - ${parseInt(item.price).toLocaleString()}đ`;
        a.style.display = 'block';
        a.style.color = '#2980b9';
        a.style.fontWeight = '500';
        a.style.margin = '4px 0';
        display.appendChild(a);
    });

    console.log('Đã thêm:', selectedItems);

    // tính tổng số tiền
    const total= selectedItems.reduce((sum, item)=> {
        return sum + Number(item.order_quantity) * Number(item.price)
    }, 0)

    document.getElementById('order-total').value=`${total.toLocaleString()}đ`;
}

document.querySelectorAll('.status_selected').forEach(el=> {
    function updateColor() {
        el.classList.remove('finish','on-job','cancel')

        // thêm class mới 
        if (el.value == 'finish') el.classList.add('finish')
        if (el.value == 'on-job') el.classList.add('on-job')
        if (el.value == 'cancel') el.classList.add('cancel')
    }
    updateColor()
    el.addEventListener('change', updateColor)
})

function addOrder() {
    const order_id= document.getElementById('order-id').value.trim()
    const order_date= document.getElementById('order-date').value.trim()
    const order_customer= document.getElementById('order-customer').value.trim()
    
    // lấy order drink và chuyển thành dạng name:quantity-text và xuống dòng
    let order_drink= ''
    selectedItems.forEach(item=> {
        order_drink+= `${item.order_name}: ${item.order_quantity}<br>`
    })
    const order_total= document.getElementById('order-total').value.trim()
    console.log(order_drink)
    // Tạo hàng mới cho bảng dựa vào data đơn hàng
    const row= document.createElement('tr')
    row.innerHTML= `
    <td><input type="checkbox" /></td>
    <td>${order_id}</td>
    <td>${order_date}</td>
    <td>${order_drink}</td>
    <td>${order_customer}</td>
    <td>${order_total}</td>
    <td>
        <select class="status_selected">
            <option value="">-- Chọn trạng thái --</option>
            <option value="finish">Hoàn thành</option>
            <option value="on-job">Đang thực hiện</option>
            <option value="cancel">Hủy</option>
        </select>
    </td>
    `
    document.getElementById('order-table-body').appendChild(row)


}

// gửi dữ liệu vào backend
document.getElementById('save-order').addEventListener('click', async function(){
    const order_id= document.getElementById('order-id').value.trim()
    const order_date= document.getElementById('order-date').value
    const res= await fetch('/dashboard/orders',{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            order_id: order_id,
            order_date: order_date,
            order_menu: selectedItems
        })
    }
    )
    // clear form 
    document.getElementById('order-id').value = '';
    document.getElementById('order-date').value = '';
    document.getElementById('order-customer').value = '';
    document.getElementById('order-total').value = '';
    document.querySelector('.drink-select').value = '';
    document.querySelector('.drink-qty').value = 1;
    document.getElementById('selected-drinks').innerHTML = '';

    // close popup
    closeOrderForm()
    selectedItems.length = 0;
})


// lưu dữ liệu vào giao diện 
function flattenOrders(data) {
    let result=[]

    function extract(item) {
        if (Array.isArray(item)) {
            item.forEach(extract)
        } else if (typeof item === 'object' && item.order_id) {
            result.push(item)
        }
    } 
    extract(data)
    return result
}

// gọi từ FE sau khi tải xong dashboard
document.getElementById('orders-tab').addEventListener('click', async function() {
    const res = await fetch('/dashboard/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, body: JSON.stringify([])
    });

    const data = await res.json();
    console.log('[DATA từ backend]', data);
    changeTab('orders');
});


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
    renderSelectedItems();


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
    const order_note= document.getElementById('order-note').value.trim()
    
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
    <td>${order_note}</td>
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
document.getElementById('save-order').addEventListener('click', async function () {
    const order_id = document.getElementById('order-id').value.trim();
    const order_date = document.getElementById('order-date').value;
    const order_note = document.getElementById('order-note').value;

    // Gửi dữ liệu lên backend
    const res = await fetch('/dashboard/orders', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            order_id: order_id,
            order_date: order_date,
            order_note: order_note,
            order_menu: selectedItems
        })
    });

    // ✅ GHI ĐÈ: Xoá dòng nếu đã tồn tại
    const orderTableBody = document.getElementById('order-table-body');
    const rows = orderTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        const idCell = row.children[1];
        if (idCell && idCell.textContent.trim() === order_id) {
            row.remove();
        }
    });

    // ✅ Tính tổng tiền
    const totalPrice = selectedItems.reduce((sum, item) => {
        return sum + item.order_quantity * item.price;
    }, 0);

    // ✅ Tạo lại dòng mới
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" /></td>
        <td>${order_id}</td>
        <td>${order_date}</td>
        <td>${selectedItems.map(item => `${item.order_name}: ${item.order_quantity}: ${item.price}`).join('<br>')}</td>
        <td>${order_note}</td>
        <td>${totalPrice.toLocaleString()}đ</td>
        <td>
            <select class="status_selected">
                <option value="">-- Chọn trạng thái --</option>
                <option value="finish">Hoàn thành</option>
                <option value="on-job">Đang thực hiện</option>
                <option value="cancel">Hủy</option>
            </select>
        </td>
    `;
    orderTableBody.appendChild(row);

    // ✅ Reset form
    document.getElementById('order-id').value = '';
    document.getElementById('order-date').value = '';
    document.getElementById('order-note').value = '';
    document.getElementById('order-total').value = '';
    document.querySelector('.drink-select').value = '';
    document.querySelector('.drink-qty').value = 1;
    document.getElementById('selected-drinks').innerHTML = '';

    closeOrderForm();
    selectedItems.length = 0;
});


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
let order_data= [] 
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

    // flatten data
    const flattern_data= flattenOrders(data)
    document.getElementById('order-table-body').innerHTML = '';
    flattern_data.forEach(item=>{
        const order_id= item.order_id
        const order_date= item.order_date
        let order_drink = ''
        item.order_menu.forEach(drink=> {
            order_drink+= `${drink.order_name}: ${drink.order_quantity}: ${drink.price}<br>`
        })
        const order_note= item.order_note
        const order_total= item.order_menu.reduce((sum, drink)=> {
            return sum + (Number(drink.price) * Number(drink.order_quantity || 1))
        },0)

        const status = item.status || ''
        const row= document.createElement('tr')
        row.innerHTML= `
        <td><input type="checkbox" /></td>
        <td>${order_id}</td>
        <td>${order_date}</td>
        <td>${order_drink}</td>
        <td>${order_note}</td>
        <td>${order_total}</td>
        <td>
            <select class="status_selected">
                <option value="" ${status === '' ? 'selected' : ''}>-- Chọn trạng thái --</option>
                <option value="finish" ${status === 'finish' ? 'selected' : ''}>Hoàn thành</option>
                <option value="on-job" ${status === 'on-job' ? 'selected' : ''}>Đang thực hiện</option>
                <option value="cancel" ${status === 'cancel' ? 'selected' : ''}>Hủy</option>
            </select>
        </td>
        `
        document.getElementById('order-table-body').appendChild(row)

    })
});

// Lưu chuyển đổi trạng thái 
document.getElementById('order-table-body').addEventListener('change', async function(event) {
    if (event.target.classList.contains('status_selected')) {
        const tr = event.target.closest('tr');
        const orderId = tr.children[1].innerText;
        const status = event.target.value;

        // Gửi lên backend
        const res = await fetch('/dashboard/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([
                { id: orderId, status: status }
            ])
        });

        const result = await res.json();
        console.log('Đã cập nhật trạng thái:', result);
    }
});
document.getElementById('delete_order_button').addEventListener('click', async function () {
    const checkboxes = document.querySelectorAll('#order-table-body input[type="checkbox"]:checked');
    if (checkboxes.length === 0) {
        alert("Bạn chưa chọn đơn hàng nào để xóa.");
        return;
    }

    let selected_delete = [];
    checkboxes.forEach(checkbox => {
        const tr = checkbox.closest('tr');
        const orderId = tr.children[1].innerText;
        const orderDate = tr.children[2].innerText;
        const orderMenu = tr.children[3].innerHTML;
        const note = tr.children[4].innerText;
        const status = tr.querySelector('.status_selected').value;

        selected_delete.push({
            order_id: orderId,
            order_date: orderDate,
            order_note: note,
            order_menu: orderMenu,
            status: status
        });
    });

    const confirmed = confirm("Bạn có chắc chắn muốn xóa các đơn hàng đã chọn?");
    if (!confirmed) return;

    const res = await fetch('/dashboard/orders/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify([{ delete_data: selected_delete }])
    });

    const result = await res.json();

    // Xoá dòng trong giao diện
    selected_delete.forEach(item => {
        const rows = document.querySelectorAll('#order-table-body tr');
        rows.forEach(row => {
            if (row.children[1] && row.children[1].innerText === item.order_id) {
                row.remove();
            }
        });
    });
});
function renderSelectedItems() { // dùng để chứa menu món ăn
    const display = document.getElementById('selected-drinks');
    display.innerHTML = '';

    selectedItems.forEach((item, index) => { // lấy item và vị trí
        const container = document.createElement('div'); // tạo 1 div để chứa các item và button
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'space-between';
        container.style.margin = '4px 0';

        const a = document.createElement('span'); //tạo 1 span chứa text
        a.textContent = `• ${item.order_name} x ${item.order_quantity}`;
        a.style.color = '#2980b9';
        a.style.fontWeight = '500';

        const removeBtn = document.createElement('button'); // tạo nút xoá
        removeBtn.textContent = '✕';
        removeBtn.style.border = 'none';
        removeBtn.style.background = 'transparent';
        removeBtn.style.color = 'red';
        removeBtn.style.cursor = 'pointer';
        removeBtn.style.fontWeight = 'bold';
        removeBtn.style.marginLeft = '10px';

        removeBtn.addEventListener('click', () => {
            selectedItems.splice(index, 1); // xoá item trong selected item 
            renderSelectedItems(); // cập nhật lại thứ tự
            updateTotal(); // cập nhật tổng
        });

        container.appendChild(a);
        container.appendChild(removeBtn);
        display.appendChild(container);
    });
}

function updateTotal() { // cập nhật tổng
    const total = selectedItems.reduce((sum, item) => {
        return sum + item.order_quantity * item.price;
    }, 0);
    document.getElementById('order-total').value = `${total.toLocaleString()}đ`;
}

document.getElementById('edit_order_button').addEventListener('click', async function () {
    const checkboxes = document.querySelectorAll('#order-table-body input[type="checkbox"]:checked');
    if (checkboxes.length !== 1) {
        alert("Bạn chưa chọn hàng nào để sửa hoặc bạn đã chọn quá nhiều hàng");
        return;
    }

    const checkbox = checkboxes[0];
    const tr = checkbox.closest('tr');

    const order_id = tr.children[1].innerText.trim();
    const order_date = tr.children[2].innerText.trim();
    const order_menu_raw = tr.children[3].innerHTML.trim(); // giữ <br>
    const note = tr.children[4].innerText.trim();
    const status = tr.querySelector('.status_selected').value;

    // Mở form
    openOrderForm();

    // Gán lại dữ liệu vào form
    document.getElementById('order-id').value = order_id;
    document.getElementById('order-date').value = order_date;
    document.getElementById('order-note').value = note;

    // ✅ Gán dữ liệu trực tiếp vào selectedItems
    selectedItems.length = 0;
    const menuLines = order_menu_raw.split('<br>').filter(line => line.trim() !== ''); // chia thành array theo từng dòng
    for (const line of menuLines) {
        const parts = line.split(':'); // chia theo dấu ":"
        if (parts.length >= 3) { // nếu như có 3 part 
            const name = parts[0].trim(); // tên sẽ là part 0 
            const quantity = parseInt(parts[1].trim()); // số lượng là part 1
            const price = parseInt(parts[2].trim()); // giá là part 2
            selectedItems.push({
                order_name: name,
                order_quantity: quantity,
                price: price
            }); // đẩy hết chúng nó là selectedItems
        }
    }

    // ✅ Hiển thị lại danh sách món có nút ❌
    renderSelectedItems();

    // ✅ Cập nhật tổng tiền
    updateTotal();
});



//================================= Doanh thu =================================

//1. click vào doanh thu thì hiện lên các feature
document.getElementById('revenue-tab').addEventListener('click', async function(event){
//gửi và lấy data từ tab đơn hàng
    event.preventDefault();
    const res= await fetch('/dashboard/revenue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify([])
    })

    const revenue = await res.json()
    const data= revenue[0]

    // Làm sạch bảng cũ nếu có 
    const tableBody= document.getElementById('revenue-table-body')
    tableBody.innerHTML= ''

    // Tạo dòng cho từng ngày 
    for (const date in data) {
        const row= document.createElement('tr')
        row.innerHTML = `
            <td>${date}</td>
            <td>${Number(data[date]).toLocaleString()}đ</td>
        `
        tableBody.appendChild(row);
    }
    changeTab('revenue');
})

// Xử lí nút tìm kiếm
document.getElementById('revenue-search-btn').addEventListener('click', async function () {
    const dateSelected= document.getElementById('revenue-date-filter').value
    const res= await fetch('/dashboard/revenue', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify([])
    })

    const revenue = await res.json()
    const data= revenue[0]

    // làm sạch bảng cũ 
    const tableBody = document.getElementById('revenue-table-body')
    tableBody.innerHTML=''

    // add bảng mới 
    for (const date in data) {
        // Nếu không chọn ngày, hoặc ngày trống, thì hiện toàn bộ
        if (!dateSelected || date === dateSelected || date === '') {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${date || 'Không rõ ngày'}</td>
                <td>${Number(data[date]).toLocaleString()}đ</td>
            `;
            tableBody.appendChild(row);
        }
    }
    changeTab('revenue');

})

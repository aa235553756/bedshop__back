const orderTableBody = document.querySelector('#orderTableBody');
const delAllOrder = document.querySelector('#delAllOrder')

const token = `IvrDZKlfPifWEtzl5X5IGq78ha42`;
const url = `https://livejs-api.hexschool.io/api/livejs/v1/customer/chiayang`;
const adminURl = `https://livejs-api.hexschool.io/api/livejs/v1/admin/chiayang`;

let ordersData = []

// todo1
// *渲染表格
// *訂單處理狀態切換
// *刪除單一訂單
// *刪除全部訂單
// C3 

// C3 用ordersData,所以要放在init裡

// table,c3
init()

orderTableBody.addEventListener('click',async (e)=>{
    let id = e.target.getAttribute('data-id');
    let status = JSON.parse(e.target.getAttribute('data-status'))
    console.log(id);

    if(e.target.getAttribute('id')=== 'orderStatus'){
        await changeOrderStatus(id,!status);
        await init();
        alert(`訂單 ${id}，更新成功`);
    }
})

orderTableBody.addEventListener('click',async (e)=>{
    let id = e.target.getAttribute('data-id');
    console.log(id);

    if(e.target.getAttribute('id')=== 'delThisOrder'){
        await delThisOrder(id);
        await init();
        alert('成功刪除此訂單')
    }
})

delAllOrder.addEventListener('click',async (e)=>{
    if (confirm("確認刪除全部訂單?")) {
        await delAll();
        await init();
        alert('全部訂單刪除成功');
    }
})

async function init(){
    await getOrders();
    render();
    c3Data()
}

async function getOrders(){
    try{
        let res = await axios.get(`${adminURl}/orders`,{
            'headers':{
                'Authorization': token,
            }
        })
        console.log(res);
        ordersData = res.data.orders;
    }catch(err){
        console.log(err);
    }
}

function render(){
    let str = ``
    ordersData.map((item)=>{
        let timestamp = item.updatedAt;
        let date = new Date(timestamp * 1000);
        let formattedDate = date.toLocaleDateString()
        
        let productsAry = []
        item.products.map((products)=>{
            productsAry.push(products.title)
        })
        let productsStr = productsAry.join(', ')

        str += `
        <tr>
            <td scope="row">${item.id}</td>
            <td>${item.user.name}<br>${item.user.tel}</td>
            <td style="max-width: 185px;">${item.user.address}</td>
            <td>${item.user.email}</td>
            <td class="d-block overflow-scroll border-0 pb-0 mb-2" style="max-width: 120px; max-height:65px;">${productsStr}</td>
            <td>${formattedDate}</td>
            <td><a id="orderStatus" data-id="${item.id}" data-status="${item.paid}" class="text-decoration-underline text-primary cursor-pointer">${item.paid===false?`未處理`:`已處理`}</a></td>
            <td><a data-id="${item.id}" id="delThisOrder" class="btn btn-danger rounded-0">刪除</a></td>
        </tr>`
    })
    orderTableBody.innerHTML = str;
}

async function changeOrderStatus(id,bool){
     try{
        let res = await axios.put(`${adminURl}/orders`,{
            "data":{
                "id":id,
                "paid":bool
            }
        },{
            'headers':{
                'Authorization': token,
            }
        })
        console.log(res);
    }catch(err){
        console.log(err);
    }
}

async function delThisOrder(id){
    try{
        let res = await axios.delete(`${adminURl}/orders/${id}`,{
            'headers':{
                'Authorization': token,
            }
        })
        console.log(res);
    }catch(err){
        console.log(err);
    }
}

async function delAll(){
    try{
        let res = await axios.delete(`${adminURl}/orders`,{
            'headers':{
                'Authorization': token,
            }
        })
        console.log(res);
    }catch(err){
        console.log(err);
    }
}

function c3Data(){
    let categoryData = {}
    ordersData.map((item)=>{
        item.products.map((product)=>{
            if(categoryData[product.category]===undefined){
                categoryData[product.category] = product.price;
            }else{
                categoryData[product.category] += product.price;
            }
        })
    })
    categoryData = Object.entries(categoryData);
    var chart = c3.generate({
        bindto:'#chart',
        data: {
            columns: categoryData,
            type : 'pie',
        },
    });

    let productsData = {}
    ordersData.map((item)=>{
        item.products.map((product)=>{
            if(productsData[product.title]===undefined){
                productsData[product.title] = product.price;
            }else{
                productsData[product.title] += product.price;
            }
        })
    })
    productsData = Object.entries(productsData)
    var chart2 = c3.generate({
        bindto:'#chart2',
        data: {
            columns: productsData,
            type : 'pie',
        },
    });
}
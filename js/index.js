$(function() {
    let json_data

    $.ajax({
        url: './data/goods.json',
        method: 'get',
        success: function(json) {
            display(json)
        }
    })

    function display(data) {
        json_data = data

        let result = ''
        for (let i in data) {
            result += ` <li>
                            <img src="./${data[i].imgurl}" alt="">
                            <p><span class="red">${data[i].price}</span></p>
                            <p class="desc">${data[i].title}</p>
                            <p class='add_cart' index=${i}>加入购物车</p>
                        </li>
                        `
        }
        $('.good_list').html(result)
    }

    $('.good_list').on('click', 'li .add_cart', function() {
        let index = $(this).attr('index')
        let arr = []
        let hasGoods = false

        if (localStorage.length > 0) {
            arr = JSON.parse(localStorage.getItem('goods'))

            $.each(arr, function(i, ele) {
                if (ele.code == json_data[index].code) {
                    ele.num += 1
                    arr[i].num = ele.num
                    localStorage.setItem('goods', JSON.stringify(arr))
                    hasGoods = true
                    console.log('添加购物车成功')
                    return false
                }
            })
        }
        if (!hasGoods) {
            arr.push({ 'code': json_data[index].code, 'num': 1 })
            localStorage.setItem('goods', JSON.stringify(arr))
            console.log('添加购物车成功')
        }
    })

    $('.mycart').click(function() {
        window.location.href = './cart.html'
    })
})
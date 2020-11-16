$(function() {
    let totalChecked;
    //判断本地存储有没有东西，有再请求
    if (localStorage.getItem('goods')) {
        totalChecked = 0;

        //发起请求
        $.ajax({
            url: './data/goods.json',
            method: 'get',
            //成功回调，动态添加li，并且push到网页中
            success: function(json) {
                let result = ''
                $.each(JSON.parse(localStorage.getItem('goods')), function(index, item) {
                    $.each(json, function(i, ele) {
                        if (item.code === ele.code) {
                            result += `<li>
                                            <input type='checkbox'>
                                            <img src="./${ele.imgurl}" alt="">
                                            <p class="desc">${ele.title}</p>
                                            <p class="price" price='${ele.price.substring(1)}'>${ele.price}</p>
                                            <p class="amount">
                                                <span class="minus">-</span>
                                                <span class="num">${item.num}</span>
                                                <span class="plus">+</span>
                                            </p>
                                            <p class="delete_single" code='${item.code}'>删除</p>
                                        </li>`
                        }
                    })
                })
                $('.good_list').html(result);
                //进行一次计算
                calculate()
            }
        })

        //点击删除按键事件，执行popUp函数 (弹出删除确认框)
        $('.good_list').on('click', 'li .delete_single', function(e) {
            popUp($(e.target).parent(), $(e.target))
        })

        //点击减号事件
        $('.good_list').on('click', 'li .amount .minus', function(e) {
            //获取现在的数量
            let num = $(e.target).next().html();
            //如果已经为1，再按减号，将进行删除操作，执行popUp函数(弹出删除确认框)
            if (num <= 1) {
                popUp($(e.target).parent().parent(), $(e.target).parent().next());

                //否则，正常减一，更新数量(class='num')的html和执行getAndSet函数以更新本地存储的数据
            } else {
                num -= 1
                $(e.target).next().html(num)
                getAndSet($(e.target), num)
            }
        })

        //点击加号事件，正常加一个，执行getAndSet函数，以更新本地存储的数据
        $('.good_list').on('click', 'li .amount .plus', function(e) {
            let num = $(e.target).prev().html()
            num++
            $(e.target).prev().html(num)
            getAndSet($(e.target), num)
        })

        $('.good_list').on('click', 'li input[type="checkbox"]', function(e) {
            $(this).prop('checked') ? totalChecked++ : totalChecked--;

            totalChecked == $('li').length ? $('.check_all_input').prop('checked', true) : $('.check_all_input').prop('checked', false)

            calculate()
        })

        $('.check_all_input').click(function() {
            $('li input[type="checkbox"]').each(function(ele) {
                $('li input[type="checkbox"]').eq(ele).prop('checked', $('.check_all_input').prop('checked'))
            })
            $('.check_all_input').prop('checked') ? totalChecked = $('li').length : totalChecked = 0
            calculate()
        })

        $('.check_all').click(function() {
            if (!$('.check_all_input').prop('checked')) {
                $('.check_all_input').prop('checked', true)
                $('li input[type="checkbox"]').each(function(ele) {
                    $('li input[type="checkbox"]').eq(ele).prop('checked', true)
                })
                calculate()
            }
        })
    } else {
        //如果一开始过去不到本地存储，则执行empty函数，购物车页面变为空的情况
        empty()
    }

    //自定义购物车为空情况下，页面如何显示
    function empty() {
        let result = `<li style='height: 120px; margin: 0 auto; 
                        font-size: 22px; text-align: center; line-height: 120px; width: 20%; 
                        color: darkgray'>购物车空空如也~
                        </li>`
        $('.good_list').html(result)
    }

    //找到现在正在操作的元素的code, 不管是减还是加的操作，他们的父元素都是amount, amount的下一个元素里有code属性
    //因此可找到code, 然后， 获取现在本地存储的数据，进行遍历，交叉对比，找到我们正在操作的元素，更新它再本地存储中的num属性
    function getAndSet(ele, number) {
        let code = ele.parent().next().attr('code')
        let arr = JSON.parse(localStorage.getItem('goods'))
        $.each(arr, function(index, item) {
            if (item.code == code) {
                item.num = number
                localStorage.setItem('goods', JSON.stringify(arr))
                calculate()
                return false
            }
        })
    }

    //弹出删除的提示框，先进行页面操作，然后，把弹出框中的取消和确定绑定上事件
    //取消就回归原样
    //确定则先删除这个html元素，然后获取本地存储，交叉对比，删除本地存储中的我们正在操作的这个元素，最后进行计算
    function popUp(ele, code) {
        $('.deletePop').css('display', 'block')
            // $('.deletePop').
        $('body').addClass('mask')

        $('.deletePop .cancle_pop').click(function() {
            $(this).parent().css('display', 'none')
            $('body').removeClass('mask')
        })

        $('.deletePop .confirm_pop').click(function() {
            ele.remove()
            let arr = JSON.parse(localStorage.getItem('goods'))

            $.each(arr, function(index, item) {
                if (item.code == code.attr('code')) {
                    arr.splice(index, 1)
                    console.log('删除成功')
                    $('.deletePop').css('display', 'none')
                    $('body').removeClass('mask')
                        //如果删除后list为空（我们删除了购物车里唯一一个东西）， 则执行页面为空的操作
                    if (arr.length == 0) {
                        empty()
                    }
                    localStorage.setItem('goods', JSON.stringify(arr))
                    calculate()
                    return false
                }
            })
        })
    }

    //循环遍历本地存储，获取数量，并通过index找到我们页面中的每个东西的price，
    //相乘并累加，更新页面中的 total 元素的html
    function calculate() {
        // let arr = JSON.parse(localStorage.getItem('goods'))
        // let total = 0
        // $.each(arr, function(index, item) {
        //     total += item.num * parseFloat($('.good_list li .price').eq(index).html().substring(1))
        // })
        // $('.total').html('¥ ' + total)

        // let arr = JSON.parse(localStorage.getItem('goods'))
        let totalprice = 0;

        $('li input[type="checkbox"]').each(element => {
            if ($('li input[type="checkbox"]').eq(element).prop('checked')) {
                let ele = $('li').eq(element)
                totalprice += ele.children('.price').attr('price') * ele.children('.amount').children('.num').html()
            }
        });

        $('.total').html('¥ ' + totalprice)
    }
})
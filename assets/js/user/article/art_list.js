$(function () {
    // 定义一个查询的参数对象，将来请求数据的时候 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '', // 文章的发布状态
    }

    // 时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        var dt = new Date(date)

        var y = dt.getFullYear()
        var m = padZero(dt.getMonth() + 1)
        var d = padZero(dt.getDate())

        var hh = padZero(dt.getHours())
        var mm = padZero(dt.getMinutes())
        var ss = padZero(dt.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : "0" + n
    }

    initTable()
    // 获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: "GET",
            url: '/my/article/list',
            data: q,
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败！', { icon: 5 })
                }
                // 使用模板引擎渲染页面的数据
                var html = template('tpl-table', res)
                $('tbody').html(html)
                // 调用渲染分页方法
                renderPage(res.total)
            }
        })
    }

    // 发起请求获取并渲染文章分类的下拉选择框
    var form = layui.form
    initCate()
    // 初始化分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.msg, { icon: 5 })
                }
                // 调用模板引擎渲染分类的可选项
                var html = template('tpl-cate', res)
                $('[name=cate_id]').html(html)
                // 通过 layui 重新渲染表单区域的UI结构
                form.render()
            }
        })
    }

    // 筛选功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 赋值
        q.cate_id = cate_id
        q.state = state
        // 重新渲染
        initTable()
    })

    // 分页功能
    var laypage = layui.laypage
    // 定义渲染分页的方法，接收一个总数量的参数
    function renderPage(total) {
        // console.log(total) 10
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: 'pageBox',
            count: total, //数据总数，从服务端得到
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页

            // 自定义分页的功能项
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条

            // 分页发生切换的时候，触发 jump 回调
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                // 把最新的页码值，赋值到 q 这个查询参数对象中   
                q.pagenum = obj.curr
                //  把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit
                //首次不执行
                if (!first) {
                    //do something
                    initTable()
                }
            }
        });
    }

    // 删除文章
    $('tbody').on('click', '.btn-del', function () {
        // 获取删除按钮的个数
        var len = $('.btn-del').length
        // console.log(len);
        // 获取删除的id 函数内部会改变this指向
        var id = $(this).attr('data-id')
        // 显示删除框
        layer.confirm('确认是否删除?', { icon: 3, title: '提示' }, function (index) {
            // 发起请求
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    // console.log(res);
                    // {status: 0, message: "删除成功！"}
                    // 判断
                    if (res.status !== 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg(res.message)
                    // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
                    if (len === 1) {
                        // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
                        // 页码值最小必须是 1 页码
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    // 如果没有剩余的数据了,则让页码值 -1 之后,
                    // 再重新调用 initTable 方法
                    initTable()
                }
            })
            // 关闭
            layer.close(index);
        });
    })
})
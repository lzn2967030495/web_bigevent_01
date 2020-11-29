$(function () {
    // 文章类别显示
    initArtCateList()
    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                // 渲染数据
                var html = template('tpl', res)
                $('tbody').html(html)
            }
        })
    }

    // 显示添加文章分类列表
    var layer = layui.layer
    // 添加类别 注册点击事件
    $('#btnAdd').on('click', function () {
        // 显示添加内容框架
        indexAdd = layer.open({
            type: 1,
            area: ['500px', '300x'],
            title: '添加文章分类',
            content: $('#tlp-Add').html()
        });
    })

    // 添加文章分类的功能
    var indexAdd // layui文档自带方法
    // 通过代理的形式，为 form-add 表单绑定 submit 事件
    $('body').on('submit', '#form-add', function (e) {
        // 阻止提交
        e.preventDefault()
        // 发起请求
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(), // 获取表单内的值
            success: function (res) {
                // console.log(res);
                // {status: 0, message: "新增文章分类成功！"}
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                initArtCateList() // 重新渲染
                layer.msg("恭喜您, 文章类别添加成功!", { icon: 6 })
                layer.close(indexAdd)
            }
        })
    })

    // 编辑功能
    var indexEdit = null
    var form = layui.form
    $('tbody').on('click', '.btn-edit', function () {
        // 弹出一个修改文章分类信息的层
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '300x'],
            title: '修改文章分类',
            content: $('#dialog-edit').html()
        });
        // 在展示弹出层之后，根据 id 的值发起请求获取文章分类的数据，并填充到表单中
        var Id = $(this).attr('data-id') // 获取当前id
        // 发送请求 
        $.ajax({
            method: 'GET',
            url: "/my/article/cates/" + Id,
            success: function (res) {
                // console.log(res);
                // 渲染数据
                form.val('form-edit', res.data)
            }
        })
    })

    // 修改-提交
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                initArtCateList() // 重新渲染
                layer.msg('恭喜您,文章类别修改成功!', { icon: 6 })
                // 关闭弹出框
                layer.close(indexEdit)
            }
        })
    })

    // 删除
    $('tbody').on('click', '.btn-delete', function () {
        // 先获取id
        var Id = $(this).attr('data-id')
        // 显示对话框
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + Id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg(res.message, { icon: 5 })
                    }
                    initArtCateList()
                    layer.msg('恭喜您,' + res.message + "!", { icon: 6 })
                    // 关闭询问层
                    layer.close(index);
                }
            })
        });
    })
})
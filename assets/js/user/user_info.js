$(function () {
    // 校验表单
    var form = layui.form
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1~6个字符之间！'
            }
        }
    })

    //获取用户的基本信息
    initUserInfo()
    var layer = layui.layer
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                // console.log(res);
                // data: {id: 26079, username: "An", nickname: "阿楠", email: "2967030495@qq.com"}
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!', { icon: 5 })
                }
                // 成功渲染
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 实现表单的重置效果
    // 用户点击了重置按钮后，表单里面的内容应该被重置
    $('#btnReset').on('click', function (e) {
        // 阻止表单的默认重置行为
        e.preventDefault()
        // 获取用户的基本信息
        initUserInfo()
    })

    // 发起请求更新用户的信息
    $('.layui-form').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 发起 ajax 数据请求
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败！', { icon: 5 })
                }
                layer.msg('更新用户信息成功！', { icon: 6 })
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo()
            }
        })
    })
})
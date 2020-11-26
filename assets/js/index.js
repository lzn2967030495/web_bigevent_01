$(function () {
    // 获取信息
    getUserInfo()
})

//获取信息
function getUserInfo() {
    // 发送ajax
    $.ajax({
        url: '/my/userinfo',
        // headers 就是请求头配置对象
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('res.message')
            }
            // 调用 renderAvatar 渲染用户的头像
            renderAvatar(res.data)
        }
    })
}
// 渲染用户头像和名称
function renderAvatar(user) {
    // 获取用户的名称
    var name = user.nickname || user.username
    // 设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 按需渲染用户的头像
    if (user.user_pic !== null) {
        // 渲染图片头像
        $(".layui-nav-img").attr('src', user.user_pic).show()
        // 隐藏文本头像
        $('.text-avatar').hide()
    } else {
        $('.layui-nav-img').hide()
        var first = name[0].toUpperCase() //toUpperCase大写
        $('.text-avatar').html(first).show()
    }
}

// 退出
var layer = layui.layer
// 点击按钮,实现退出功能
$("#btnOut").on('click', function () {
    // 提示用户是否退出
    layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function (index) {
        // 清空本地存储的token
        localStorage.removeItem("token")
        // 重新跳转到登录页面
        location.href = "/login.html"
        // 关闭 confirm 询问框
        layer.close(index);
    });
})
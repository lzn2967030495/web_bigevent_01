// 在ajaxPrefilter中统一拼接请求的根路径
// 每次调用 $.get() 或 $.post() 或 $.ajax() 的时候，
// 会先调用 ajaxPrefilter 这个函数
// 在这个函数中，可以拿到我们给Ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    // console.log(options.url); ///api/login
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    // 在发起真正的 Ajax 请求之前，统一拼接请求的根路径

    // 为有权限的接口设置headers请求头
    // indexOf 查询，没有查到返回-1
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 控制用户访问权限
    // 在调用有权限接口的时候，指定complete回调函数，这个回调函数不管成功还是失败都会调用
    options.complete = function (res) {
        // console.log(res);
        // responseJSON: {status: 1, message: "身份认证失败！"}
        if (res.responseJSON.status === 1 && res.responseJSON.message === "身份认证失败！") {
            // 强制清空token
            localStorage.removeItem('token')
            // 强制跳转登录页面
            location.href = '/login.html'
        }
    }
})
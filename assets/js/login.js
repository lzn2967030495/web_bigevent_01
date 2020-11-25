//入口函数
$(function () {
    //点击登录显示登录页面，隐藏注册页面
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })
    //点击注册显示注册页面，隐藏登录页面
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    //自定义校验规则
    var form = layui.form // layui相当于jq中的$
    form.verify({
        // 自定义密码校验规则
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框中的内容 value
            // 通过属性选择器获取密码的值
            var pwd = $('.reg-box input[name=password]').val()
            if (value !== pwd) {
                return '两次密码输入不一致!'
            }
        }
    })

    // 发起注册用户的Ajax请求
    // 监听注册表单的提交事件
    var layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        // 1. 阻止默认的提交行为
        e.preventDefault()
        // 2. 发起Ajax的POST请求
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('.reg-box [name=username]').val(),// 用户名
                password: $('.reg-box [name=password]').val(),// 密码
            },
            success: function (res) {
                // console.log(res);
                //判断
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 })
                }
                layer.msg("恭喜您,注册成功!", { icon: 6 })
                // 模拟人的点击行为
                $('#link_login').click()
                // 回车
                $('.layui-btn').on('keyup', function () {
                    if (keyCode === 13) {
                        $('#link_login').click()
                    }
                })
                // 注册完成后清空表单内容
                $('#form_reg')[0].reset()
            }
        })
    })

    // 发起登录的Ajax请求
    $('#form_login').submit(function (e) {
        // 阻止默认行为
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: '/api/login',
            // 快速获取表单中数据
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status !== 0) {
                    return layer.msg('登录失败！', { icon: 5 })
                }
                layer.msg('登录成功！', { icon: 6 })
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token', res.token)
                // 跳转到后台主页
                location.href = '/index.html'
            }
        })
    })
})
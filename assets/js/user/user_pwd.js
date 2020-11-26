$(function () {

    // 自定义校验规则
    var form = layui.form
    // console.log(form);
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新旧不重复
        samePwd: function (value) {
            // value 新密码
            // 获取旧密码
            var old = $("[name=oldPwd]").val()
            // console.log(old);
            if (value === old) {
                return '原密码不能与新密码相同'
            }
        },
        // 两次密码输入一致
        rePwd: function (value) {
            // value 确认密码的值
            if (value !== $("[name=newPwd]").val()) {
                return '两次密码输入不一致！'
            }
        }
    })

    // 发起请求实现重置密码的功能
    $('.layui-form').on('submit', function (e) {
        // 阻止默认提交
        e.preventDefault()
        // 发送请求
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message, { icon: 5 })
                }
                layui.layer.msg(res.message, { icon: 6 })
                // 重置表单
                $('.layui-form')[0].reset()
            }
        })
    })
})
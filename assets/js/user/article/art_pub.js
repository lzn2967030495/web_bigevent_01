$(function () {

    var layer = layui.layer
    var form = layui.form

    // 获取数据分类
    initCate()
    function initCate() {
        // 发起请求
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                // console.log(res);
                // {status: 0, message: "获取文章分类列表成功！", data: Array(5)}
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                // layer.msg(res.message)
                // 渲染
                var html = template('tpl_option', res)
                $('[name=cate_id]').html(html)
                // 重新渲染 没有效果
                form.render()
            }
        })
    }

    // 初始化富文本编辑器
    initEditor()

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //  更换裁剪的图片
    $('#btn-Add').on('click', function (res) {
        $('#file').click()
    })
    // 选择的图片设置到裁剪区域中
    $('#file').on('change', function (e) {
        // 获取文件
        var files = e.target.files
        // console.log(files);
        // 判断是否选择了文件
        if (files.length === 0) {
            return
        }
        // 根据文件创建url地址
        var newImgURL = URL.createObjectURL(files[0])
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    // 定义文章发布状态
    var atr_state = '已发布'
    // 为存为草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        // 改变其状态
        atr_state = '草稿'
    })

    // 给form绑定提交事件
    $('#form-pub').on('submit', function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault()
        // 创建对象
        var fd = new FormData(this)
        // 将文章的发布状态，存到 fd 中
        fd.append('state', atr_state)
        // 将封面裁剪过后的图片，输出为一个文件对象
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                // console.log(...fd);
                // 6. 发起 ajax 数据请求
                publishArticle(fd)
            })
    })

    // 发起Ajax请求实现发布文章的功能
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交的是 FormData 格式的数据，
            // 必须添加以下两个配置项
            contentType: false,
            processData: false,
            success:function(res){
                // console.log(res);
                if(res.status !== 0 ){
                    return layer.msg(res.message)
                }
                layer.msg(res.message)
                // 发布成功后跳转页码
                // location.href = '/article/art_list.html'
                setTimeout(function(){
                    window.parent.document.getElementById('art_list').click()
                },500)
            }
        })
    }
})
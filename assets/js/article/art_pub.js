$(function () {


    //定义函数
    var layer = layui.layer
    var form = layui.form

    cate()
    // 初始化富文本编辑器
    initEditor()


    function cate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类失败')
                }
                var htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr);
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择封面按钮天机点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverFile').click();
    })
    //监听coverfile的change事件
    $('#coverFile').on('change', function (e) {
        var file = e.target.files[0]//获取到文件的列表数组，根据target指向用户选择的文件，如果数组中没有数据则，用户没有训中文件
        if (file.length === 0) {
            return layer.msg('您还没有选择图片')
        }
        //根据文件创建对应的url地址，注意这里是转换为base64位
        var newImgURL = URL.createObjectURL(file)
        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })

    //文章默认的发布状态
    //定义文章的发布状态
    var art_state = '已发布'
    //村委草稿按钮，绑定点击事件处理函数
    $('#btnSave2').on('click', function () {
        art_state = '草稿'
    })

    //绑定表单的submit事件提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        fd = new FormData($(this)[0]);
        fd.append('state', art_state)
        $image
            .cropper('getCroppedCanvas', {
                //创建一个画布canvas
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
        // fd.forEach(function (v, k) {//注意，v是值   k是键
        //     console.log(v)
        //     console.log(k)
        // })
    })
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //注意，如果向服务器提交的是formdata格式的数据
            //必须添加如下两个配置项
            contentType: false,
            processData: false,
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功!')
                location.href = '/article/art_list.html'
            }
        })
    }
})
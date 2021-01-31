$(function () {
    var form = layui.form
    var layer = layui.layer

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6个字符之间!'
            }
        }
    })
    initUserInfo()
    function initUserInfo() {
        $.ajax({
            method: 'get',
            url: '/my/userinfo',
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('用户信息获取失败!');
                }
                console.log(res)
                // console.log(res.data);
                //调用form.val()快速为表单赋值
                form.val('formUserInfo', res.data)
            }

        })
    }
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        //阻止默认行为后重新发起一次ajax请求
        initUserInfo();
    })
    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户数据失败！')
                }
                layer.msg('更新用户数据成功!')
                //同时更新一下父元素的头像和名称
                window.parent.getUserInfo();
            }
        })
    })
})
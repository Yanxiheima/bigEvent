$(function () {
    // 点击“去注册账号”的链接
    $('#link_reg').on('click', function () {
        $('.login-box').hide()
        $('.reg-box').show()
    })

    // 点击“去登录”的链接
    $('#link_login').on('click', function () {
        $('.login-box').show()
        $('.reg-box').hide()
    })

    //给按钮添加点击变色
    $('buton').on('mousedown', function () {
        $(this).removeClass('.layui-btn-normal').addClass('.layui-btn-warm');
    })
    //从layui中获取form对象
    var form = layui.form;
    var layer = layui.layer;
    //自定义了一个叫pwd的校验规则,不能有空格，并且是6到12位密码
    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'],

        //注意下面这个函数是取repwd确认密码框的值,
        repwd: function (value) {
            //通过查找.reg-box 里面的值name包裹的password属性的值
            //注意下面取的值是，password
            var pwd = $('.reg-box [name = password]').val();
            if (pwd !== value)
                return '两次密码不一致'
        }
    })

    //下面是------注册------模块通过post请求
    $('#form_reg').on('submit', function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        $.post('/api/reguser', {
            username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val()
        }, function (res) {
            if (res.status !== 0) {
                return layer.msg('不开心，用户名被使用过来', { icon: res.message });
                // return console.log(res.message);
            }
            // console.log('注册成功!!!!!!');
            layer.msg('注册成功!!!!!!');
            //如果注册成功模拟人的操作，点击去登录按钮，跳转到登录页面
            $('#link_login').click();

        })
    })
    $('#form_login').submit(function (e) {
        //阻止表单默认提交行为
        e.preventDefault();
        $.ajax({
            method: 'post',
            url: '/api/login',
            data: $(this).serialize(),
            success(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!');
                }
                layer.msg('登录成功!');
                //将登录成功的token字符串保存到本地存储里面
                localStorage.setItem('token', res.token)
                locat();
            }
        })
    })
    function locat() {
        setTimeout(function () {
            //跳转到后台主页
            location.href = './index.html'
        }, 2000)
    }

})

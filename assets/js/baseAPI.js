$(function () {
    $.ajaxPrefilter(function (options) {
        //在发起ajax请求之前统一发起根路径
        options.url = 'http://ajax.frontend.itheima.net' + options.url


        //统一为有权限的接口，设置headers请求头
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = { Authorization: localStorage.getItem('token') || '' }
        }

        //全局统一挂载complete回调函数
        options.complete = function (res) {
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //强制清除内存中的token
                console.log('我在localStorage这里')
                localStorage.removeItem('token')
                //强制跳转页面
                location.href = '/login.html'
            }
        }
    })
})
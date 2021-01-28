$.ajaxPrefilter(function (options) {
    //在发起ajax请求之前统一发起根路径
    options.url = 'http://ajax.frontend.itheima.net' + options.url
})
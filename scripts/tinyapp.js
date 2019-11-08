/*
支付宝小程序hook脚本 alipay v10.1.75
 */

Java.perform(function () {
    // webview 证书绑定
    const H5WebViewClient = Java.use('com.alipay.mobile.nebulacore.web.H5WebViewClient');
    const SslErrorHandler = Java.use("android.webkit.SslErrorHandler");
    H5WebViewClient.onReceivedSslError.implementation = function(webview, sslHandler, sslError){
        console.log('H5WebViewClient onReceivedSslError called, proceed');
        var handler = Java.cast(sslHandler, SslErrorHandler);
        handler.proceed();
    };
    // h5小程序 log
    const H5Log = Java.use("com.alipay.mobile.nebula.util.H5Log");
    H5Log.d.overload("java.lang.String", "java.lang.String").implementation = function (tag, msg) {
        console.log("debug: [", tag, "] - ", msg);

    };

    // disable ssl hostname check
    const AbstractVerifier = Java.use("org.apache.http.conn.ssl.AbstractVerifier");
    AbstractVerifier.verify.overload('java.lang.String', '[Ljava.lang.String;', '[Ljava.lang.String;', 'boolean').implementation=function(a,b,c,d){
        console.log('HostnameVerifier wants to verify ', a, ' disabled');
        return;
    };

    console.log('injected');
});
/*
支付宝小程序hook脚本 alipay v10.1.75
 */

Java.perform(function () {
    // webview 证书绑定
    const H5WebViewClient = Java.use('com.alipay.mobile.nebulacore.web.H5WebViewClient');
    const SslErrorHandler = Java.use("android.webkit.SslErrorHandler");
    H5WebViewClient.onReceivedSslError.implementation = function (webview, sslHandler, sslError) {
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
    AbstractVerifier.verify.overload('java.lang.String', '[Ljava.lang.String;', '[Ljava.lang.String;', 'boolean').implementation = function (a, b, c, d) {
        console.log('HostnameVerifier wants to verify ', a, ' disabled');
        return;
    };

    // disable ssl check
    const X509TrustManager = Java.use('javax.net.ssl.X509TrustManager');
    const SSLContext = Java.use('javax.net.ssl.SSLContext');
    const SecureRandom = Java.use('java.security.SecureRandom');
    const HostnameVerifier = Java.use("javax.net.ssl.HostnameVerifier");
    const HttpsURLConnection = Java.use("javax.net.ssl.HttpsURLConnection");

    var MyTrustManager = Java.registerClass({
        name: 'com.example.MyTrustManager',
        implements: [X509TrustManager],
        methods: {
            checkClientTrusted: function (chain, authType) {
            },
            checkServerTrusted: function (chain, authType) {
            },
            getAcceptedIssuers: function () {
                return [];
            },
        }
    });
    var sc = SSLContext.getInstance("TLS");
    sc.init(null, Java.array('com.example.MyTrustManager', [MyTrustManager.$new()]), SecureRandom.$new());
    HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());

    var MyHostnameVerifier = Java.registerClass({
        name: 'com.example.MyHostnameVerifier',
        implements: [HostnameVerifier],
        methods: {
            verify: function (hostname, session) {
                return true;
            },
        }
    });

    HttpsURLConnection.setDefaultHostnameVerifier(MyHostnameVerifier.$new());


    console.log('injected');
});
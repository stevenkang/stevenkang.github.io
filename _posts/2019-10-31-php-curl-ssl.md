---
layout: post
title:  "PHP 使用 curl 访问获取 https 网站的内容"
date:   2019-10-31 09:29:00 +0800
categories: default 编程
tags: php
comments: 1
---
遇到一个 PHP 获取 https 网站内容的问题，这里整理成博文供搭建参考。
需求是目前自己搭建了一个国外的博文网站，打算使用国内的服务器进行加速访问。

查阅了 PHP 相关资料之后，发现 PHP 的 get_file_contents 和 curl 均可以实现。
get_file_contents 能实现简单的，考虑到要实现 Header 等内容的获取和传输，
于是使用了 curl 实现。编码完成之后发现报以下错误信息：
```
Exception 35: SSL connect error
```
面向搜索引擎解决 BUG，发现是因为 SSL 协议的问题，默认的情况下服务器端禁用了低版本的 SSL 协议，
于是我们需要指定 PHP 使用高版本的 SSL 协议请求服务器端（国外的博文网站）。
```php
// 这是我的博客网站
$siteUrl = 'https://blog.xiaoi.me';

function httpGet($url) {
    try {
        $ch = curl_init();
    
        if (FALSE === $ch)
            throw new Exception('failed to initialize');
 
        curl_setopt($ch,CURLOPT_URL, $url);
        // 这里为关键代码，经过几次测试只有，发现需要调整到 6 以上，具体可参考博文底部链接
        curl_setopt($ch, CURLOPT_SSLVERSION, 6);
    
        $content = curl_exec($ch);
    
        if (FALSE === $content)
            throw new Exception(curl_error($ch), curl_errno($ch));
    
        var_dump($content);
    } catch(Exception $e) {
        echo 'Exception ' . $e->getCode() . ': ' . $e->getMessage();
    }
}

echo httpGet($siteUrl . $_GET['uri']);
```
通过使用以上的 PHP 代码即可完成基本的加速访问，原来使用 ```https://blog.xiaoi.me/a/b/c.html`` 访问的内容，
可以通过 PHP 加速访问，例如：```proxy.php?uri=/a/b/c.html```

# 总结
低版本 SSL 协议安全性很低，建议将自己的网站等应用禁用低版本 SSL 协议，并且有类似本文这样的需求时，
同时也将客户端的 SSL 协议版本提高，这样保证数据安全以及代码可用性。

# 参考文献
 - [PHP: curl_setopt - Manual](https://www.php.net/manual/en/function.curl-setopt.php)

# 版权
 > 版权声明：自由转载-非商用-非衍生-保持署名（创意共享3.0许可证）
 > 原创作者：10086@xiaoi.me 发表于 Xiaoi's Blog：[https://blog.xiaoi.me](https://blog.xiaoi.me)
 > 原文链接：{{site.url}}{{page.url}}

扫码关注我，在线与我沟通、咨询
![Xiaoi's Blog](/assets/res/qrcode.png)

***转载请保留原文链接以及版权信息***
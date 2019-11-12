---
layout: post
title:  "搭建 Elasticsearch 单节点以及简单的使用教程"
categories: 软件使用
tags: Java elastic
comments: 1
---
Elasticsearch是一个基于Lucene库的搜索引擎。它提供了一个分布式、支持多租户的全文搜索引擎，具有HTTP Web接口和无模式JSON文档。Elasticsearch是用Java开发的，并在Apache许可证下作为开源软件发布。官方客户端在Java、.NET（C#）、PHP、Python、Apache Groovy、Ruby和许多其他语言中都是可用的。[5]根据DB-Engines的排名显示，Elasticsearch是最受欢迎的企业搜索引擎，其次是Apache Solr，也是基于Lucene。 —— 维基百科

# 搭建 Elasticsearch 单节点以及简单的使用教程
接下来介绍如何本地搭建一个单节点的 Elasticsearch 服务器以及进行一些增删改查的简单操作。

## 安装 Elasticsearch 
 * 第一步：所需要的软件环境：最新稳定版 Java，若使用 docker 方式则不必安装 Java；
 * 第二步：下载[最新版 Elasticsearch](https://github.com/elastic/Elasticsearch/releases)；
 * 第三步：解压下载的 Elasticsearch，建议位置选择一个用于存放数据的目录，磁盘剩余空间尽量留大一点；
 * 第四步：运行 Elasticsearch，Linux 或者 macOS 运行 bin/Elasticsearch，Windows 运行 bin\Elasticsearch.bat；
 * 第五步：使用命令 ```curl -X GET http://localhost:9200/``` 检查运行状态，或者直接复制链接到浏览器中打开也可以，
 正常情况下会显示以下类似的内容：
 ```json
{
  "name" : "DESKTOP-FHFP51P",
  "cluster_name" : "Elasticsearch",
  "cluster_uuid" : "lAdgnvl8TrmSrzRn321AKw",
  "version" : {
    "number" : "7.4.2",
    "build_flavor" : "default",
    "build_type" : "zip",
    "build_hash" : "2f90bbf7b93631e52bafb59b3b049cb44ec25e96",
    "build_date" : "2019-10-28T20:40:44.881551Z",
    "build_snapshot" : false,
    "lucene_version" : "8.2.0",
    "minimum_wire_compatibility_version" : "6.8.0",
    "minimum_index_compatibility_version" : "6.0.0-beta1"
  },
  "tagline" : "You Know, for Search"
}
 ```

## 使用 Elasticsearch 进行简单的操作

### 添加数据
```curl
curl -XPOST 'http://localhost:9200/twitter/_doc/?pretty' -H 'Content-Type: application/json' -d '
{
    "user": "kimchy",
    "post_date": "2009-11-15T13:12:00",
    "message": "Trying out Elasticsearch, so far so good?"
}'
```

### 查找数据
```curl
curl -XGET 'http://localhost:9200/twitter/_search?pretty=true' -H 'Content-Type: application/json' -d '
{
    "query" : {
        "match_all" : {}
    }
}'
```

### 修改数据
```curl
curl -XPUT 'http://localhost:9200/twitter/_doc/{ID}?pretty' -H 'Content-Type: application/json' -d '
{
    "user": "kimchy",
    "post_date": "2009-11-15T13:12:00",
    "message": "Trying out Elasticsearch, so far so good?"
}'
```

### 删除数据（不建议直接删除）
```curl
curl -XDELETE 'http://localhost:9200/twitter/_doc/{ID}?pretty''
```
注意：上文中的{ID}为变量，具体要操作哪条数据应当传入数据的实际 ID

## Elasticsearch 性能测试
经过上文的教程，我们对 Elasticsearch 有了初步的了解以及学会了如何使用基本的操作，接下来我们测一下单节点的性能。

首先我们主要使用的是 ab 命令（Apache-Bench）进行压力测试，命令如下
```sh
ab -n100000 -c10 -p ./postfile.ab -T 'application/json' http://localhost:9200/twitter/_doc/?pretty=true
```
其中，postfile.ab 为我们需要发送给 Elasticsearch 的模拟数据，数据内容参考如下
```json
{
    "user": "kimchy",
    "post_date": "2009-11-15T13:12:00",
    "message": "Trying out Elasticsearch, so far so good?"
}
```

### 并发 10TPS 请求 10 万次
测试报告如下
```text
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:
Server Hostname:        localhost
Server Port:            9200

Document Path:          /twitter/_doc/?pretty=true
Document Length:        243 bytes

Concurrency Level:      10
Time taken for tests:   28.107 seconds
Complete requests:      10000
Failed requests:        5557
   (Connect: 0, Receive: 0, Length: 5557, Exceptions: 0)
Total transferred:      3815557 bytes
Total body sent:        2860000
HTML transferred:       2435557 bytes
Requests per second:    355.79 [#/sec] (mean)
Time per request:       28.107 [ms] (mean)
Time per request:       2.811 [ms] (mean, across all concurrent requests)
Transfer rate:          132.57 [Kbytes/sec] received
                        99.37 kb/s sent
                        231.94 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        1    6   6.5      5     170
Processing:     6   21  19.5     17     529
Waiting:        4   17  17.4     13     527
Total:         11   28  21.7     23     534

Percentage of the requests served within a certain time (ms)
  50%     23
  66%     26
  75%     29
  80%     31
  90%     41
  95%     53
  98%     79
  99%    112
 100%    534 (longest request)
```
通过 ab 的测试报告可以看出，单节点的 Elasticsearch 性能非常强悍，达到了 355.79 / 秒处理量，另外通过观测 JVM 的系统资源使用，也是比较低的水平。
![{{page.title}}](/assets/res/img/20191112105205.png)

### 并发 400TPS 请求 10 万次
接下来我们进行更高的并发测试
```text
This is ApacheBench, Version 2.3 <$Revision: 1807734 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:
Server Hostname:        localhost
Server Port:            9200

Document Path:          /twitter/_doc/?pretty=true
Document Length:        245 bytes

Concurrency Level:      400
Time taken for tests:   209.947 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      38300000 bytes
Total body sent:        28600000
HTML transferred:       24500000 bytes
Requests per second:    476.31 [#/sec] (mean)
Time per request:       839.787 [ms] (mean)
Time per request:       2.099 [ms] (mean, across all concurrent requests)
Transfer rate:          178.15 [Kbytes/sec] received
                        133.03 kb/s sent
                        311.18 kb/s total

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:       87  392 214.7    345    3133
Processing:    26  445 216.2    397    3697
Waiting:       25  300 188.6    265    2722
Total:        443  838 380.2    746    6498

Percentage of the requests served within a certain time (ms)
  50%    746
  66%    822
  75%    884
  80%    951
  90%   1074
  95%   1314
  98%   1637
  99%   2002
 100%   6498 (longest request)
```
可以看出，并发量达到了 476.31 / 秒，JVM 的资源使用情况也没有发生大幅提升的情况，可以说是非常的稳定。
![{{page.title}}](/assets/res/img/20191112105940.png)

# 总结
Elasticsearch 单节点的性能已经非常强悍了，并且支持分布式提升更大的性能扩容，可以说是完全满足日常的需求已经高并发的需求。
另外我们可以将系统日志、网络日志、应用日志、业务日志等易产生大量数据的接入 Elasticsearch 进行统一的管理，这样既保证效率，也避免了日志分散、数量大无法维护等带来问题。

# 参考文献
 - [Elasticsearch - Getting Started](https://github.com/elastic/Elasticsearch)
 - [Elasticsearch - 维基百科，自由的百科全书](https://zh.wikipedia.org/zh-hans/Elasticsearch)

# 版权
> 版权声明：自由转载-非商用-非衍生-保持署名（创意共享3.0许可证）<br/>
> 原创作者：10086@xiaoi.me 发表于 Xiaoi's Blog：[https://blog.xiaoi.me](https://blog.xiaoi.me)<br/>
> 原文链接：[{{site.url}}{{page.url}}]({{site.url}}{{page.url}})<br/>

扫码关注我，在线与我沟通、咨询
![Xiaoi's Blog](/assets/res/qrcode.png)

***转载请保留原文链接以及版权信息***
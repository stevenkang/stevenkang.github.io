---
layout: post
title:  "临时笔记"
categories: default
tags: tool
comments: 1
---


-- 更新超过转让时间的未失效状态
update `p2p_transfer` set state = 3
where create_date >= '2019-10-01'
and state = 1 and end_date < now();

# PHP CURL SSL Error
https://blog.51cto.com/xoyabc/2417615

# PHP any-api
帐号间数据隔离
自主设计索引系统
模块私有化、公有化
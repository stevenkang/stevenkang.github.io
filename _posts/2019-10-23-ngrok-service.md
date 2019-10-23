---
layout: post
title:  "使用 ngrok 内网穿透工具"
date:   2019-10-23 14:08:00 +0800
categories: default service 推荐
tags: tool
comments: 1
---

ngrok 微信开发必备神器，ngrok 是一个反向代理，通过在公共的端点和本地运行的 Web 服务器之间建立一个安全的通道。QQ群：619152722

## 使用
 * 下载客户端，解压之后运行 start.bat，默认 8080 可直接通过生成的随机域名访问。
 * 若本地非 8080 端口，右键编辑 start.bat 文件，将最后的 8080 换成指定端口，例如 80 即可。
 * 若需要固定域名例如: test ，修改内容：```ngrok -config ngrok.cfg --subdomain test 8080```，访问时通过：http://test.4kb.cn（或者：https://test.4kb.cn 加密访问） 即可。
 * 如果无法连接服务器，请使用命令 ```ping ngrok.4kb.cn``` 检查 IP 是否为 ```112.124.46.214```，若不是，请手动绑定 HOSTS，若不知道如何绑定 HOSTS，请善用搜索引擎

## 下载
### 64 位系统
 * [Windows 客户端](https://img.xiaoi.me/static/ngrok_windows_x64-0.0.2.zip)
 * [Linux 客户端](https://img.xiaoi.me/static/ngrok_linux_x64-0.0.2.zip)
 * [Mac 客户端](https://img.xiaoi.me/static/ngrok_mac_x64-0.0.2.zip)

### 32 位系统
 * [Windows 客户端（32位）](https://img.xiaoi.me/static/ngrok_windows-0.0.2.zip)
 * [Linux 客户端（32位）](https://img.xiaoi.me/static/ngrok_linux-0.0.2.zip)
 * [Mac 客户端（32位）](https://img.xiaoi.me/static/ngrok_mac-0.0.2.zip)
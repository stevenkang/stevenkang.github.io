---
layout: post
title:  "使用 docker 运行 frp 服务端，并且上传到 docker hub 在线仓库"
date:   2019-10-23 10:23:00 +0800
categories: default
tags: Linux
comments: 1
---
最近在使用 frp 内网穿透服务，运行了一段时间，发现 frp 挺稳定的，突发奇想，之前学习了一下 docker 的使用，何不把 frp 打包成 docker 镜像，这样在任意服务器上就能快速开启 frp 服务了，于是折腾了一下午总算是搞定了。

如果不想自己配置，可以使用 ```docker run -p 7000:7000 xiaoi/frp_for_docker:0.27.0``` 命令直接运行已经打包好的镜像。若要修改配置，覆盖镜像中的 /app/frps.ini 配置文件即可。

# 操作步骤
## 下载和配置 frp
首先我们需要下载一个 frp 服务端程序，可以在 [github.com](https://github.com/fatedier/frp/releases) 上下载到最新发布的版本，这里下载 [frp_0.27.0_linux_386.tar.gz](https://github.com/fatedier/frp/releases/download/v0.27.0/frp_0.27.0_linux_386.tar.gz) 版本作为演示。

下载好了之后解压得到相关的应用程序和配置文件，我们只需要保留 frps 和 frps.ini 即可。若有需要可以在 frps.ini 进行自定义配置。
![image](/assets/res/img/601c77bc816e902053b08ef01f614cfc53c82303.png)

## Dockerfile 编写
接下来我们编写 Dockerfile 文件，由于 frp 使用 golang 开发，发布的版本可以直接在 alpine 环境下运行，于是我们的工作变得非常简单，按照如下的代码编写即可
```
FROM alpine:latest

WORKDIR /app

COPY . /app

EXPOSE 7000

CMD ["./start.sh"]
```
由于我在 frps.ini 中配置的 7000 端口，这里 EXPOSE 也设置 7000 端口保持一致。

CMD 这里填写 ```"./start.sh"```方便启动，start.sh 内容如下
```
#!/bin/sh
./frps -c ./frps.ini
```

## docker 命令打包镜像
编写好 Dockerfile 和启动脚本之后，我们就可以使用 docker 命令打包了
```
docker build --tag=frp_for_docker .
```
打包好了之后使用 docker image ls 查看打包好的镜像
![image](/assets/res/img/2185aeb84f9982879e8f44a9b0439f40e524d180.png)


## 运行和检查镜像
使用 ```docker run -p 7000:7000 frp_for_docker``` 运行我们打包好的镜像，出现 success 等字样信息表明运行成功
![image](/assets/res/img/21ddb25956d3f290b3f3f5ffc7938245def518a6.png)


## 上传镜像至在线仓库
如果想要在任意地方都能运行我们打包好的镜像，则需要上传镜像至 [hub.docker.com](https://hub.docker.com) 在线仓库，上传之前需要 [注册 docker 账号](https://hub.docker.com/signup)

注册好了之后回到控制台运行 ```docker login``` 然后输入账号密码登录

然后将我们的镜像改名，格式为 ```用户名/镜像名:版本号``` ，例如我的用户名为 xiaoi，镜像名我定义为 frp_for_docker ，版本号我这里按照 frp 版本号来定义，其中除了用户名不能自定义，镜像名和版本号都是可以任意命名，使用如下命令将本地镜像改名。
```
docker tag frp_by_docker xiaoi/frp_by_docker:0.27.0
```
改好之后使用 docker push 命令上传至在线仓库
```
docker push xiaoi/frp_for_docker:0.27.0
```
上传完成之后我们就可以在 [hub.docker.com](https://hub.docker.com) 在线仓库中查看我们的镜像了
![image](/assets/res/img/aeb5c75aeeb375eb398a26237ae5c2a697c0f820.png)


## 在别处直接运行在线仓库中的镜像
在有 docker 环境的服务器或者个人电脑上使用 ```docker run``` 命令就可以运行在线仓库中的镜像，例如运行我们上传的镜像
```
docker run -p 7000:7000 xiaoi/frp_for_docker:0.27.0
```
运行命令之后，接下来的这一切都是自动化完成的，无需我们再做任何操作
![image](/assets/res/img/9929ddd33af26d74c34d748aa2ec81c389ca467e.png)


# 总结
 * 使用 docker 我们可以很容易的将一个应用程序分发到各个地方运行，便于后期的维护和管理，同时也不用担心跨平台的问题产生；
 * 程序所依赖的环境我们也可以通过编写 Dockerfile 来解决，不必再为各个环境依赖重复安装运行环境，这样极大的减轻来工作量；
 * docker 能运行的程序远不于此，我们可以将所熟悉的一切软件都使用 docker 来运行和管理；

# 版权
 > 版权声明：自由转载-非商用-非衍生-保持署名（创意共享3.0许可证）

原创作者 10086@xiaoi.me 发表于阿里云·云栖社区：[https://yq.aliyun.com/users/y4epujtm5wye6](https://yq.aliyun.com/users/y4epujtm5wye6)

扫码关注我，在线与我沟通、咨询
![image](/assets/res/qrcode.png)

**转载请保留原文链接以及版权信息**
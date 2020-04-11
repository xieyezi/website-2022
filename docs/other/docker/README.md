---
title: docker基本知识
tags:
  - docker
  - nginx
---

# docker 基本知识

### 镜像(image)文件

1. docker 把应用程序及其依赖，打包在 image 文件里面
2. image 文件可以看做是容器的模板，docker 根据 image 文件生成容器的实例
3. 同一个 image 文件，可以生成多个同时运行的模板
4. `docker image pull` 是抓取 image 文件的命令 (eg: `docker image pull hello-world`)
5. 使用`docker image ls`查看本机下面的已有的 docker image 文件
6. 运行 image 文件:`docker container run hello-world`,该命令会从 image 文件，生成一个正在运行的容器实例
7. 终止正在运行的容器: `docker container kill [containID]`
<!-- more -->

### 容器(container)文件

1.  容器文件指的是 image 文件生成的容器实例
2.  关闭容器不会删除容器，只会停止运行
3.  查看本机正在运行的容器: `docker container ls`
4.  查看本机所有的容器(运行和非运行): `docker container ls --all`
5.  删除容器: `docker container rm [containerID]`

### Dcokerfile 文件

用来配置 image 的文本文件。 Docker 会根据该文件生成二进制的 image 文件。
写 Dockerfile 文件的步骤:

1. 先 clone 自己的项目: `git clone xxxx`;
2. 在项目的根目录下，新建一个文本文件:`.dockerignore`:

```
.git
 node_modules
 npm-debug.log
```

该文件会排除以上的三个路径下的文件，告诉 docker 不要将这三个打包到 image 文件。

3. 在项目的根目录下，新建一个文本文件`Dockerfile`:

```
  FROM node:8.4       //指定node的版本
  COPY . /app        //将当前目录下的所有文件，都拷贝至iamge文件的/app目录
  WORKDIR /app       // 指定接下来的工作路径为/app
  RUN npm install --registry=https://registry.npm.taobao.org  // 在/app目录下，运行npm intall 安装项目依赖，这些依赖都会被打包进image文件
  EXPOSE 3000        //将容器的3000端口暴露出来，允许外部连接
```

### 创建 image 文件

有了 Dockerfile 文件之后，就可以使用 `docker iamge build` 命令来创建 image 文件了。
创建命令:

```
docker image build -t [imageName] .
```

或者:

```
docker image build -t [imageName]:0.0.1 .
```

`-t` 指定文件 image 文件的名字， 最后那个点则是 Dockerfile 文件所在的路径，还可以使用`:`来指定标签
执行完成之后，查看当前 image 文件: `docker image ls`

### 生成容器

`docker container run` 命令会从 image 文件生成容器:

```
 docker run -p 8000:3000 -it [iamgeName] /bin/bash
```

或者:

```
 docker run -p 8000:3000 -it [iamgeName]:0.0.1 /bin/bash
```

或者:

```
docker run -p 3000:80 -d --name [containerName] [iamgeName]
```

`-p`参数: 容器的 3000 端口映射到本机的 8000 端口

`-it`参数: 容器的 Shell 映射到当前的 Shell，然后你在本机窗口输入的命令，就会传入到容器

`-d`参数: 让容器在后台运行

`--name`参数: 指定容器名称

`/bin/bash`参数: 容器启动以后，内部第一个执行的命令，这里是启动 Bash，保证用户可以使用 Shell
当跑完这些命令的时候，会返回一个命令行提示符，然后就可以在里面执行命令了

### 其他有用的命令

（1）`docker container start`  
 前面的 docker container run 命令是新建容器，每运行一次，就会新建一个容器。同样的命令运行两次，就会生成两个一模一样的容器文件。如果希望重复使用容器，就要使用 docker container start 命令，它用来启动已经生成、已经停止运行的容器文件:

```
   docker container start [containerID]
```

（2）`docker container stop`  
 前面的 docker container kill 命令终止容器运行，相当于向容器里面的主进程发出 SIGKILL 信号。而 docker container stop 命令也是用来终止容器运行，相当于向容器里面的主进程发出 SIGTERM 信号，然后过一段时间再发出 SIGKILL 信号。

```
   bash container stop [containerID]
```

这两个信号的差别是，应用程序收到 SIGTERM 信号以后，可以自行进行收尾清理工作，但也可以不理会这个信号。如果收到 SIGKILL 信号，就会强行立即终止，那些正在进行中的操作会全部丢失。

（3）`docker container logs`

`docker container logs` 命令用来查看 docker 容器的输出，即容器里面 Shell 的标准输出。如果 docker run 命令运行容器的时候，没有使用-it 参数，就要用这个命令查看输出。

```
    docker container logs [containerID]
```

（4）`docker container exec`

`docker container exec` 命令用于进入一个正在运行的 docker 容器。如果 docker run 命令运行容器的时候，没有使用-it 参数，就要用这个命令进入容器。一旦进入了容器，就可以在容器的 Shell 执行命令了。

```
docker container exec -it [containerID] /bin/bash
```

（5）`docker container cp`

`docker container cp` 命令用于从正在运行的 Docker 容器里面，将文件拷贝到本机。下面是拷贝到当前目录的写法。

```
docker container cp [containID]:[/path/to/file]
```

### Docker Compose 工具

Compose 可以管理多个 Docker 容器组成一个应用。定义一个 `.yaml`的配置文件 `docker-compose.yml`,在这个文件里面写好多个容器之间的调用关系。然后只要一个命令，即可同时启动/关闭这些容器:

```
docker-compose up   //启动所有服务
docker-compose stop //关闭所有服务
docker-compose rm   // 删除所有容器
```

### docker 更改镜像加速器

进入 `/etc/docker/daemon.json` 里面编辑(没有这个文件请新建):

```
{
  "registry-mirrors": [
    "https://dockerhub.azk8s.cn",
    "https://reg-mirror.qiniu.com"
  ]
}
```

然后重启 docker 即可:

```
$ sudo systemctl daemon-reload
$ sudo systemctl restart docker
```

然后执行 `docker info` 查看配置是否生效

### 需要继续深入学习的东西

1. Dockerfile 文件的编写
2. docker-compose.yaml 的编写

### 现在的问题

1. 是不是写了 Dockerfile 文件之后，在服务器直接拉取代码，然后根据 Dcokerfile 制作项目 image，如果是 vue 项目，是否就不用打包了？因为只需根据 Dockerfile 制作的 image 启动容器即可。

   我的看法：应当还是要打包的，但是打包操作是在 Dockerfile 文件里面执行吗？或者还有一种思路，就是先在本地打包，并把 Dcokerfile 也打包进 dist 目录，在服务器上拉取代码，然后进入 dist 目录，再根据 Dockerfile 文件制作 image？

2. 如何利用 `docker-compose` 将 vue 前台服务和后台服务写到同一个 image 里面？(前台和后台是分开的，前台的请求会反向代理到后台，后台为一个 Node.js 服务，不涉及到数据库。等于说，前台服务需要 nginx，后台则需要 node)

3) 如何实现以下的 docker 编排？

![docker服务编排.png](https://i.loli.net/2019/08/20/ZTr3s1CbV7vG9Bq.png)

### 查看 container 的 IP 地址

```
docker exect -it [containerName] bash
cat /etc/hosts
```

或者直接使用 `docker inspect [containerName]` 查看 IP 地址

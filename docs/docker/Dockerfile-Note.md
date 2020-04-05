---
title: Dockerfile文件的编写
tags:
  - docker
---

# Dockerfile 文件的编写

### Dockerfile 文件的编写

`FROM` : 指定基础镜像 (可以到[Docker Hub](https://hub.docker.com/)上面去寻找想要的镜像)
`RUN` : 执行命令，有两种模式:

1. shell 格式：`RUN <命令>`，就像直接在命令行中输入的命令一样;例如 `rm -rf xxx`,`npm install`等等;
2. exec 格式：`RUN ["可执行文件", "参数1", "参数2"]`，这更像是函数调用中的格式。
   > 为了保持 Dockerfile 文件的可读性，可理解性，以及可维护性，建议将长的或复杂的 RUN 指令用反斜杠 \ 分割成多行,例如:

```
RUN rm -f package-lock.json \
  ; rm -rf .idea \
  ; rm -rf node_modules \
  ; npm config set registry "https://registry.npm.taobao.org/" \
  && npm install
```

`COPY` : COPY 指令将从构建上下文目录中 <源路径> 的文件/目录复制到新的一层的镜像内的 <目标路径> 位置.

1. `COPY [--chown=<user>:<group>] <源路径>... <目标路径>`
2. `COPY [--chown=<user>:<group>] ["<源路径1>",... "<目标路径>"]`

例如:

```
COPY package.json /usr/src/app/
```

将 package.json 文件复制到镜像内的`/usr/src/app`下面

`LABEL` : 可以给镜像添加标签来帮助组织镜像、记录许可信息、辅助自动化构建等。

```
  # 设置一个或多个LABEL
  LABEL com.example.version="0.0.1-beta"

  LABEL vendor="ACME Incorporated"

  LABEL com.example.release-date="2015-02-12"

  LABEL com.example.version.is-production=""
```

一个镜像可以包含多个标签，但建议将多个标签放入到一个 LABEL 指令中:

```
# Set multiple labels at once, using line-continuation characters to break long lines
LABEL vendor=ACME\ Incorporated \
    com.example.is-beta= \
    com.example.is-production="" \
    com.example.version="0.0.1-beta" \
    com.example.release-date="2015-02-12"
```

`CMD` : 用于执行目标镜像中包含的软件，可以包含参数

1.  shell 格式：CMD <命令>
2.  exec 格式：CMD ["可执行文件", "参数 1", "参数 2"...]
3.  参数列表格式：CMD ["参数 1", "参数 2"...]。在指定了 ENTRYPOINT 指令后，用 CMD 指定具体的参数。
    > CMD 大多数情况下都应该以 CMD ["executable", "param1", "param2"...] 的形式使用

`ENV` : 设置环境变量

1.  `ENV <key> <value>`
2.  `ENV <key1>=<value1> <key2>=<value2>...`

`VOLUME` : 用于暴露任何数据库存储文件，配置文件，或容器创建的文件和目录.

1. `VOLUME ["<路径1>", "<路径2>"...]`
2. `VOLUME <路径>`
   > 强烈建议使用 VOLUME 来管理镜像中的可变部分和用户可以改变的部分。

`EXPOSE` : 声明运行时容器提供服务端口

```
EXPOSE <端口1> [<端口2>...]
```

> 要将 EXPOSE 和在运行时使用 -p <宿主端口>:<容器端口> 区分开来。-p，是映射宿主端口和容器端口，换句话说，就是将容器的对应端口服务公开给外界访问，而 EXPOSE 仅仅是声明容器打算使用什么端口而已，并不会自动在宿主进行端口映射。

`WORKDIR` : 指定工作目录，如该目录不存在，WORKDIR 会帮你建立目录。

```
WORKDIR <工作目录路径>
```

`USER` : 指定当前用户.

```
USER <用户名>[:<用户组>]
```

`HEALTHCHECK` : HEALTHCHECK 指令是告诉 Docker 应该如何进行判断容器的状态是否正常。

```
HEALTHCHECK [选项] CMD <命令>：设置检查容器健康状况的命令
HEALTHCHECK NONE：如果基础镜像有健康检查指令，使用这行可以屏蔽掉其健康检查指令
```

`MAINTAINER` : 设置镜像的作者，可以是任意字符串。

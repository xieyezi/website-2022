---
title: docker-compose 部署项目
tags:
  - docker
---

# docker-compose 部署项目

## 说在前面

我们都知道，docker 可以实现很简便的部署环境。现在我们有一个前后端分离的项目，前端基于 Vue 开发、利用 Webpakc 打包为 dist 文件夹。后端则是一个 Node.js 服务，提供 API 接口，前端和后端是分离的。所以我们肯定是前端项目一个 container,后台项目也是一个 container。那么如果是在生产环境，就会产生跨域问题。前端的请求要反向代理到后台。大家肯定首先想到的就是使用`Nginx`设置`proxy_pass`。是的没有错。那么我们有了这些想法。我们如何通过`docker-compose`来实现呢？

## 开始动手

其实我也是才开始了解 docker 的。所以有很多不明白的地方，例如在 docker 里面，是通过 image 生成一个 container,那么这个 container，就可以当作是一个独立的系统，这个系统也就有自己独立的端口。那么就像我们刚刚那样的需求，假设我们的前端在`container1`里面暴露 80 端口，同时映射到宿主机的 80 端口，后端在`container2`里面暴露 3000 端口，同时映射到宿主机的 3000 端口。那我们反向代理请求的时候，是通过宿主机来反向代理呢，还是通过 container 来实现呢？我在网上查阅并学习了很多其他大佬的文章，还有官网的文档。发现直接通过 container 就可以实现这种需求。为什么呢？因为 docker-compose，会将所有的 container 构建在同一网络下，我们要找其他 container，我们只需通过 docker-compose 里面的`service name` 即可找到。
下面先来看看我们的目录:

```js
  vueMusic
  ├─ .git
  ├─ .gitignore
  ├─ LICENSE
  ├─ README.md
  ├─ babel.config.js
  ├─ dist
  ├─ docker-compose.yml
  ├─ docs
  ├─ nginx.conf
  ├─ package-lock.json
  ├─ package.json
  ├─ public
  ├─ server
  ├─ src
  └─ vue.config.js
```

dist 是我们的前端项目。server 是我们的后端项目。
下面再来看看我们的`docker-compose.yml`:

```docker
  version: '3'
  services:
  music-web:  #前端项目的service name
      container_name: 'music-web-container'  #容器名称
      image: nginx  #指定镜像
      restart: always
      ports:
      - 80:80
      volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf  #挂载nginx配置
      - ./dist:/usr/share/nginx/html/    #挂载项目
      depends_on:
      - music-server
  music-server:    #后端项目的service name
      container_name: 'music-server-container'
      build: ./server  #根据server目录下面的Dockerfile构建镜像
      restart: always
      expose:
      - 3000
```

可以看见，我们通过`volumes`属性将宿主机的`nginx.conf`挂载到容器内的 nginx 配置文件，用来覆盖原有的配置文件,同时也将`dist`挂载到容器内。我们将前端项目的容器暴露并映射给宿主机的 80 端口，我们将后端项目的容器暴露 3000 端口。那么我们在哪里实现反向代理请求呢？请看`nginx.conf`:

```nginx
  #user  nobody;
  worker_processes  1;
  events {
      worker_connections  1024;
  }
  http {
      include       mime.types;
      default_type  application/octet-stream;
      sendfile        on;
      #tcp_nopush     on;
      #keepalive_timeout  0;
      keepalive_timeout  65;
      #gzip  on;
      gzip on;
      gzip_min_length  5k;
      gzip_buffers     4 16k;
      #gzip_http_version 1.0;
      gzip_comp_level 3;
      gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
      gzip_vary on;
      server {
          listen  80;
          server_name  www.xieyezi.com;
          #音乐app项目
          location / {
          index index.html index.htm;   #添加属性。
          root /usr/share/nginx/html;   #站点目录
          }
          #音乐app项目设置代理转发
          location /api/ {
          proxy_pass  http://music-server:3000/;
          }
          error_page   500 502 503 504  /50x.html;
          location = /50x.html {
              root   /usr/share/nginx/html;
          }
      }
  }
```

可以看上面的`proxy_pass http://music-server:3000/;`。其中`music-server`是我们后端项目的服务名，我们通过服务名来找到这个容器，这样就实现了反向代理。

## 部署

1. 到我们的服务器，指定一个目录，利用 git 拉取我们的项目。
2. 进入项目的根目录，执行`docker-compose up -d` 运行服务。
3. 执行`docker ps`即可看见我们刚刚启动的容器。

## 部署的架构图

> 这里还有我另外一个项目：resume

![docker服务编排 (1).png](https://i.loli.net/2019/08/28/O1X4pLvfng9578y.png)

## 总结

我们应当保持一个虔诚谦虚的态度去学习。也许你已经熟知某一领域，别人向你请教的时候，请不要高高在上、目中无人。每个厉害的大牛，都是小人物成长起来的，谁都有这样一个过程。所以，人生苦短，请与人为善。

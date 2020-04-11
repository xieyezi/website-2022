---
title: docker部署vue静态项目
tags:
  - docker
---

## 说在前面

   我在网上搜索了很多docker部署vue项目的教程，其中很多的文章不乏都是先将vue项目执行`npm run build` 在本地进行打包，传到自己的仓库去，然后到服务器去拉取我们的代码，获取`dist`文件，再将该文件挂载到dockr容器内。其实这种操作应当是有缺陷的，我们应当把打包的操作也放到docker的镜像里面去操作。
   <!-- more -->

## 部署步骤
  
  在项目根目录下面新建`Dockerfile`文件:
  ```docker
    # resum Dockerfile

    #指定node镜像对项目进行依赖安装和打包
    FROM node:10.16.0 AS builder
    # 将容器的工作目录设置为/app(当前目录，如果/app不存在，WORKDIR会创建/app文件夹)
    WORKDIR /app 
    COPY package.json /app/ 
    RUN npm config set registry "https://registry.npm.taobao.org/" \
        && npm install
    
    COPY . /app   
    RUN npm run build 

    #指定nginx配置项目，--from=builder 指的是从上一次 build 的结果中提取了编译结果(FROM node:alpine as builder)，即是把刚刚打包生成的dist放进nginx中
    FROM nginx
    COPY --from=builder app/dist /usr/share/nginx/html/
    COPY --from=builder app/nginx.conf /etc/nginx/nginx.conf

    #暴露容器80端口
    EXPOSE 80
  ```

  可以看到，在这里我将打包操作也放到`Dokcerfile`里面进行操作了。 
  ```
  COPY --from=builder app/dist /usr/share/nginx/html/
  ```
  该条命令是将我们在镜像里面打包生成的`dist`文件放进容器内`nginx`的web目录下面。
  ```
  COPY --from=builder app/nginx.conf /etc/nginx/
  ```
  该条命令是将我们项目目录下面的`nginx.conf`文件复制到容器内`nginx`的配置文件的目录下面，从而覆盖原有的配置文件。   
  `nginx.conf`:
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
        keepalive_timeout  65;

        #gzip  on;
        gzip on;
        gzip_min_length  5k;
        gzip_buffers     4 16k;
        #gzip_http_version 1.0;
        gzip_comp_level 3;
        gzip_types text/plain application/javascript application/x-javascript text/css application/xml text/javascript application/x-httpd-php image/jpeg image/gif image/png;
        gzip_vary on;
        
        # 设置简历项目
        server {
            listen  80;
            server_name www.xieyezi.com;
            location / {
                root /usr/share/nginx/html;   #站点目录
                index index.html index.htm;   #添加属性。 
            }
        
            location = /50x.html {
                root   /usr/share/nginx/html;
            }
        }
    }
   ```
  进入自己的服务器(我的服务器为ubuntu 18.04)，在根目录下面创建一个`web`目录。接着进入该目录，利用git拉取我们的项目代码到该目录。
  1. clone自己的项目: `git clone xxxx`;
  2. 在项目的根目录下，新建一个文本文件:`.dockerignore`:
  ```
   .git
   node_modules
   npm-debug.log
  ```
  该文件会排除以上的三个路径下的文件，告诉docker不要将这三个打包到image文件。  
  3. 制作镜像
  ```
  docker image build -t [imageName]:1.0 .
  ```
  制作镜像之后,我们即可根据容器运行我们的镜像:
  ```
  docker run -p 8080:80 -d --name [containerName] [iamgeName]
  ```
  接着在控制台输入`docker ps`命令即可看见我们刚刚启动的容器信息。
  接着输入域名进行测试，正常运行。
---
title: Tomcat配置域名访问
tags:
  - Tomcat
---

### Tomcat基本配置

  我们在构建一个网站的时候,常常选择Tomcat作为服务器的工程项目容器.所以我们需要将域名配置到Tomcat上,也就是说我们可以通过域名直接访问我们的网站.
  <!-- more -->
  先将你的项目打包上传至服务器.然后放置到Tomcat目录下的webapps下.
  ![文件](http://wx1.sinaimg.cn/mw690/89296167gy1fvvasnv5rwj211w0hwn05.jpg)

  然后进入conf目录下,打开server.xml进行编辑.
  配置域名能直接访问项目,需要在server.xml添加以下代码：
  ```
  <Host name="www.xieyezi.com"  appBase="webapps"
      unpackWARs="true" autoDeploy="true">
      <Context docBase="C:\Program Files\apache-tomcat-9.0.7-windows-x64\apache-tomcat-9.0.7\webapps\Xydesign" path="" reloadable="true"/>
  <!-- SingleSignOn valve, share authentication between web applications
       Documentation at: /docs/config/valve.html -->
  <!--
  <Valve className="org.apache.catalina.authenticator.SingleSignOn" />
  -->

  <!-- Access log processes all example.
       Documentation at: /docs/config/valve.html
       Note: The pattern used is equivalent to using pattern="common" -->
  <Valve className="org.apache.catalina.valves.AccessLogValve" directory="logs"
         prefix="localhost_access_log" suffix=".txt"
         pattern="%h %l %u %t &quot;%r&quot; %s %b" />

</Host>
  ```
  1. 配置项目通过域名访问    


  ```
  <Host name="www.xieyezi.com"  appBase="hcode"
            unpackWARs="true" autoDeploy="true">
  ```
  将Host标签的name设置为你的域名,appBase设置为你的项目的路径(可以为绝对路径和相对路径,你可以看见我这里设置为相对路径).
  配置完成即可保存,然后通过 http://www.xieyezi.com/Xydesign 访问.

  2. 配置项目名缺省进行访问     


  一般的,我们一般是直接访问域名就进行访问.而不是通过在域名末尾添加项目名进行访问.
  ```
  <Context docBase="hcode" path="" />
  ```
  其中,docBase即为项目的绝对路径,此时通过 http://www.xieyezi.com 即可进行项目名缺省的访问.

  3. 部署多个项目到Tomcat     


  将你的项目打包放置到webapps路径下,然后在server.xml的Host下面添加以下代码:
  ```
  <Context path="" docBase="" debug="0" reloadable="false"/>
  ```
  将path标签设置为`/你的项目名`,docBase设置为`你的项目根目录的绝对路径`.
  配置完成即可保存,然后通过 http://www.xieyezi.com/项目名 访问.


  4. https访问配置    


  在server.xml添加以下代码:
  ```
  <Connector port="443" protocol="org.apache.coyote.http11.Http11Protocol"
               maxThreads="150" SSLEnabled="true" scheme="https" secure="true"
               clientAuth="false"
                sslProtocol="TLS"
                keystoreFile="/home/doc/keys/213972284410468.pfx"
                keystoreType="PKCS12"
                keystorePass="213972284410468"         />
  ```
  添加keystoreFile,keystoreType,keystorePass即可进行https访问.

  5. 自动跳转到https连接    


  如果希望输入http链接时自动跳转到https,需要在web.xml中添加如下内容:
  ```
  <login-config>
                <!-- Authorization setting for SSL -->
                <auth-method>CLIENT-CERT</auth-method>
                        <realm-name>Client Cert Users-only Area</realm-name>
        </login-config>
        <security-constraint>
                <!-- Authorization setting for SSL -->
                <web-resource-collection >
                        <web-resource-name >SSL</web-resource-name>
                        <url-pattern>/*</url-pattern>
                </web-resource-collection>
                <user-data-constraint>
                        <transport-guarantee>CONFIDENTIAL</transport-guarantee>
                </user-data-constraint>
        </security-constraint>
  ```
  以上内容位置在``</web-app>``内,添加后输入http访问时会自动跳转到https连接.

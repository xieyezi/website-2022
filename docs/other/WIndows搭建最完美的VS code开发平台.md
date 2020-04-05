---
title: Windows搭建最完美的VScode开发平台
tags:
  - Windows
  - VScode
---



## 说在前面
  公司的电脑是Windows电脑,且显示器的分辨率只有1080P,在使用vscode写代码的过程中,眼睛简直要瞎了,跟Mac对比起来,太过于模糊.于是开始了一番折腾,包括字体、文件图标、主题等等一系列的设置.
### 主题

   主题我经过千挑万选,最终选定了One Dark Pro Vivid,安装请直接在vscode扩展里面搜索即可.<!-- more -->

### 图标
   
   图标选择了Meterial Icon Theme,安装在vscode扩展里面也能直接搜索.

### 字体
   写代码时,我们得一直面对着电脑屏幕,所以字体的显示很重要.默认字体配上1080P,简直要瞎眼.
   我千挑万选,选了两款字体：[FiraCode](https://github.com/tonsky/FiraCode)和[Operator Mono](https://www.typography.com/blog/introducing-operator?source=post_page---------------------------).




   字体预览：





   FiraCode：

   ![TIM图片20190718184622.png](https://i.loli.net/2019/07/18/5d304e1e977ca96618.png)

   Operator Mono：
   ![TIM图片20190718184539.png](https://i.loli.net/2019/07/18/5d304e1e8772b67232.png)

   其中Operator Mono为付费字体,但是我已经将其下载好了,直接clone项目,解压安装即可.




   安装方法：
   1. 先colone项目,找到压缩包,解压：

![TIM图片20190718185740.png](https://i.loli.net/2019/07/18/5d3050b5ea1a552809.png)

   2. 打开解压之后的安装包,全选,点击为所有用户安装:

![TIM图片20190718183729.png](https://i.loli.net/2019/07/18/5d304c084cd1d29005.png)

   3. 到vscode里面进行设置font-family即可,也可以直接复制我的setting.json文件里的内容到你的setting.json文件里面,我已经将字体的粗细、行高都调整好了.

   重启Vscode,即可成功应用字体.
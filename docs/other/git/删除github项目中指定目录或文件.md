---
title: 删除github项目中指定的目录和文件
tags:
  - git
  - GitHub
---



### 说在前面

  有时候我们将项目托管至github之后才发现,我们可能需要删除部分指定的目录或者文件,但是直接在`.gitignore`文件标注说明,推送到github之后,你会发现想要删除的目录仍然没有删除,所以此时我们需要使用git命令来进行删除.<!-- more -->

### 删除指定目录或文件



1. 先删除本地的git缓存

```
git rm -r --cached <filename>
```



2. 在.gitignore中加入需要忽略的文件夹或文件

3. 重新提交

   

```
git add -A
git commit -m "remove files"
```



4. 推送到GitHub

   

```
git push origin master
```

到Github查看,大功告成！
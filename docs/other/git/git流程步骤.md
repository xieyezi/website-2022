---
title: Git流程
---

# Git 流程

一、要开发一个新的功能的时候，从 master 切一个分支出来

1.  拉取最新代码
    git pull --rebase (gup)

2.  起一个新的分支
    功能分支:
    git checkout -b feature/xxxx
    修复分支:
    git checkout -b hotfix/xxxx
    开发完毕提 mr，如果 mr 没有冲突，则到此为止，直接通知相应人员就好了，如果产生了冲突，请按照下面步骤操作

二、功能开发完毕，需要合并到 master。这时候要先 rebase 下最新的 master 分支，再合并

1.  切换 master 分支
    git checkout master (gcm)
2.  拉取最新代码
    git pull --rebase (gup)
3.  切换到自己的分支
    git checkout feature/xxx (gco feature/xxx)
    以上步骤完成之后，请按照下面步骤操作
4.  基于 master 做 rebase
    git rebase master (grbm)
5.  这个时候会产生冲突，产生冲突时，手动解决冲突
    git add .
6.  进入下一个冲突
    git rebase --continue (grbc)
7.  如果都解决完了
    git push --force-with-lease (gpf)
8.  大功告成，让 mr 负责人直接合并代码吧
    rebase 的一些其他命令
    如果不需要当前的 log
    grbs （git rebase --skip）
    如果需要终止当前 rebase
    grba （git rebase --abort）

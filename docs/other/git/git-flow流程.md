Gitflow是一个基于feature分支管理的版本发布方案。它是由荷兰程序猿Vincent Driessen设计研发，开源项目地址gitflow-avh。
大致流程是：
- 不同feature在不同feature分支上单独开发(或测试)。
- 确定版本号和此版本将要发布的功能后，将相应featustre分支统一向develop分支合并，然后拉出新的release预发布分支。
- release分支作为持续集成关注的分支，修复bug。
- 待release分支测试验收通过后，统一向master分支和develop分支合并，并在master分支打tag。
- 根据tag发布apk版本。

若线上发现严重bug，需走hotfix流程。
- 基于master分支拉出hotfix分支修复线上问题。
- bug修复完成统一向master和develop分支合并。
- master分支打上新的tag，发布新版本。

下面将介绍如何使用Gitflow命令完成上述版本发布，一条Gitflow指令可能对应了一系列git命令，为的是规范化开发流程，提高代码管理效率。

### Mac平台安装
```
brew install git-flow
```
brew表示Homebrew，它是mac平台常用的包管理器，没有安装则需先安装，安装可参考Mac OS下brew的安装和使用。

### 初始化

先将远程仓库克隆到本地。
```
git clone <project_url>
```
各种初始化Gitflow配置。
```
git flow init
```
命令行会提示你是否修改Gitflow提供的默认分支前缀。不同场景的分支前缀不同，默认情况下分支前缀是这样的：
场景 | 分支前缀
-- | --
新功能 | feature
预发布 | release
热修复 | hotfix
打tag | 空

分支前缀的作用是区分不同分支的使用场景，同时当你使用Gitflow命令时就不需手动添加分支前缀了，Gitflow会帮你加上。
比如开发新功能需创建一个feature分支，名为gitworkflow，使用下面的代码将会创建一个名为feature/gitworkflow本地分支。

```
git flow feature start gitworkflow
```
通常情况下不需要修改默认的命名前缀，只需加上-d就可跳过修改命名阶段。
```
git flow init -d
```

### 行为/Action
通常来说，一种场景的完整生命周期应至少包含以下几种行为：
- start 开始开发
- publish 发布到远程分支
- finish 完成开发、合并到主分支

我们首先以feature场景为例，看看如何完成工作流。

### feature流程

#### start
新功能开始开发前，需准备好开发分支。
```
git flow feature start <feature_name>
```
执行上面的命令将会在本地创建名为<feature_name>的分支，并切换到该分支，而且不论当前所处哪个分支都是基于develop分支创建，相当于执行了下面的git的命令。

```
git checkout -b feature/<feature_name> develop
```
需要注意基于的是本地的develop分支，执行此命令前一般需要拉取最新的远程代码。

#### publish

在本地开发完成新功能并commit后，需要将本地代码push到远程仓库。
```
git flow feature publish <feature_name>
```
这行指令做了三件事。
- 创建一个名为feature/<feature_name>的远程分支。
- 本地分支track上述远程分支。
- 如果本地有未push代码，则执行push。

转换成git命令就是下面的样子：
```
git push origin feature/<feature_name>
git push --set-upstream origin feature/<feature_name>
git push origin
```

注意：如果已经执行过publish后又有新的代码需push，再次执行将报错，因为它始终会试图创建一个远程分支。此时需执行正常的push命令git push origin。
#### finish
当功能开发完毕后就将进入测试阶段，此时需将一个或多个feature分支统一合并到develop分支。
```
git flow feature finish <feature_name>
```
这行指令也做了三件事。
- 切换到develop分支。
- 合并代码到develop分支
- 删除本地feature/<feature_name>分支。
等价于执行下面的git命令：
```
git checkout develop
git merge feature/<feature_name>
git branch -d feature/<feature_name>
```
如果merge时发生了冲突，则在第二步merge时终止流程，即不会再删除本地分支。但当前已处于develop分支，待本地冲突解决并commit后，重新执行`git flow feature finish <feature_name>`即可完成finish流程。
细心的同学可以已经发现finish还有两件事没做。
- develop分支代码还未push。
- 未删除远程分支feature/<feature_name>。

也就是还需执行
```
git push origin develop
git push origin :feature/<feature_name>
```
### release流程
当新功能开发完毕，将进入测试阶段，此时需要基于develop分支拉出release分支进行集成测试，也有将release场景作为预发布环境进行测试的，即feature场景已完成常规测试，在这种情况下，一般而言release只有少数改动。在这里我们先不讨论项目流程问题。
使用start指令开启一个release场景，通常以版本号命令，我们以v2.0为例：
```
git flow release start v2.0
```
此命令会基于本地的develop分支创建一个release/v2.0分支，并切换到这个分支上。
为了让其他协同人员也能看到此分支，需要将其发布出去。
```
git flow release publish v2.0
```
以上和feature场景十分类似。
待测试通过需要发布正式版：
```
git flow release finish v2.0
```
这一步做的动作有点多，大致是：
- git fetch
- release/v2.0分支代码向master合并。
- 生成名为v2.0的tag。
- release/v2.0分支代码向develop合并。
- 删除本地release/v2.0分支。
- 切换回develop分支。

如果merge产生冲突不会终止流程，只是不会将本地的release分支删除，待解决完冲突后需再次执行finish指令。
另外需要注意的是，如果本地还有未finish的release分支，将不允许使用start指令开启新的release分支，这一点是对并行发布的一个限制。
release finish只是完成了本地代码的一系列操作，还需要同步到远程仓库。
```
git push origin develop
git push origin master
git push origin v2.0
```
或者使用下面的命令推送所有的分支和tag。
```
git push origin --all
git push origin --tags
```

### hotfix 流程

当tag打完，也表示正式版本发布出去了，如果此时在线上发现了严重的bug，需要进行紧急修复。
此时我们假设版本号变为v2.0-patch。
```
git flow hotfix start v2.0-patch
```
这将创建一个hotfix/v2.0本地分支并切换到该分支。 hotfix没有publish指令，认为hotfix应该是个小范围改动，不需要其他协同人员参与。
待本地修改结束commit后，执行finish指令。
```
git flow hotfix finish v2.0-patch
```
按照Gitflow工作流，它会执行下面的任务，与release基本一致。
- git fetch
- hotfix/v2.0-patch分支代码向master合并。
- 生成名为v2.0-patch的tag。
- hotfix/v2.0-patch分支代码向develop合并。
- 删除本地hotfix/v2.0-patch分支。
- 切换回develop分支。

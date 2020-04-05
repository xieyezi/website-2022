module.exports = {
  title: "xieyezi", //左上角的博客标题以及网站显示的标题
  description: "使用vuepress搭建的个人博客",
  theme: "antdocs",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }], // 增加一个自定义的 favicon(网页标签的图标)
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],

    [
      "link",
      {
        rel: "stylesheet",
        href: "https://cdn.jsdelivr.net/npm/katex@0.11.1/dist/katex.min.css",
      },
    ],
  ],
  themeConfig: {
    //主题配置项
    logo: "/logo.png",
    smoothScroll: true, //平滑滚动
    sidebarDepth: 1,
    editLinks: true, // 编辑链接
    editLinkText: "帮助我改善这个页面", // 链接字段
    lastUpdated: "最后更新时间", // 最后更新时间
    backToTop: true,
    nav: [
      //导航栏
      { text: "Home", link: "/" },
      { text: "Flutter", link: "/flutter/" },
      { text: "Vue", link: "/vue/" },
      { text: "React", link: "/react/" },
      { text: "Typescript", link: "/typescript/" },
      { text: "Javascript", link: "/javascript/" },
      { text: "Docker", link: "/docker/" },
      { text: "Other", link: "/other/" },
      {
        text: "Conatact",
        items: [
          {
            text: "Github",
            link: "https://github.com/xieyezi",
          },
          {
            text: "掘金",
            link: "https://juejin.im/user/5c1cfe85e51d4511851c478d/posts",
          },
          {
            text: "微信",
            link: "https://i.loli.net/2020/04/05/itpSUfw1vNQc3sH.jpg",
          },
        ],
      },
    ],
  },

  plugins: [
    //美化相关：
    ["cursor-effects"], //鼠标点击特效
    ["vuepress-plugin-reading-progress"], //顶部进度条
    [
      "vuepress-plugin-code-copy",
      {
        color: "#6D7EAD",
        successText: "🌈复制成功！🌈",
      },
    ],
    ["go-top"], // 悬挂猫返回顶部,yarn add -D vuepress-plugin-go-top

    //功能添加：
    [
      "vuepress-plugin-auto-sidebar",
      {
        titleMode: "uppercase",
      },
    ], //自动生成侧边栏
    [
      "permalink-pinyin",
      {
        lowercase: true,
        separator: "-",
      },
    ], //转换链接汉字为英文的插件
  ],
};

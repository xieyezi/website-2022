/**
 * 生成侧边栏的脚本
 */
const fs = require("fs");
const path = require("path");
const whiteListFileType = [".md"]; // 文件白名单，只提取.md文件
let resultTextList = []; // 结果字符串数组
const pathRoutePath = "docs/other"; // 从哪个文件开始读
const pathRouter = "other"; // 根路由
const targetFileName = path.join(__dirname, "docs/.vuepress/config/other.js"); // 生成文件的位置

/*
 * @export
 * @param {string} pathName 遍历根路径
 * @param {string} pathRouter 根据路径生成的路由
 */
function traverse(pathName, pathRouter) {
  if (fs.statSync(pathName).isDirectory()) {
    const pathText = pathName;
    const sonPathList = fs.readdirSync(pathName); // 返回子路径列表
    sonPathList.forEach((sonName) => {
      // 遍历子路径
      traverse(path.join(pathText, sonName), `${pathRouter}/${sonName}`);
    });
  } else {
    if (!whiteListFileType.includes(path.extname(pathName))) return;
    pathRouter = pathRouter.replace(/.md/, "");
    const routerName = path.basename(pathName).replace(/.md/, "");
    const routerItem = `/${pathRouter}","${routerName}`;
    // console.log(routerItem);
    resultTextList.push(routerItem);
  }
}

// 将生成的结果数组写入文件
function geneRateRouter() {
  resultTextList = resultTextList.map((item) => {
    return `["${item}"]`;
  });
  const text = fs.readFileSync(targetFileName).toString(); // 读取目标文件
  //   console.log(text);
  const str = text.replace('"token"', resultTextList.toString());
//   console.log(str);
  // 替换目标文件
  fs.writeFileSync(targetFileName, str);
}

/////// 开始执行
traverse(path.resolve(__dirname, pathRoutePath), pathRouter);
geneRateRouter();

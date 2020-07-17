const fs = require('fs');
const colors = require('colors/safe');
const process = require('process');

function fileContentType (filePath, fileName, defaultContent, override) {
  if (defaultContent) {
    const writeContent =
      typeof defaultContent === 'object'
        ? JSON.stringify(defaultContent, null, 4)
        : defaultContent;

    const outMsg = `
      ${override ? '正在' : '文件不存在,开始'}生成文件${fileName}..
      文件路径: ${colors.yellow(filePath)}
      继续执行构建-->`.replace(/^\s+/gm, '');
    console.log(colors.green(outMsg)); // eslint-disable-line no-console
    try {
      fs.writeFileSync(filePath, writeContent);
    } catch (error) {
      console.log(colors.red.underline('写入失败,进程结束')); // eslint-disable-line no-console
      process.exit(1);
    }
  }
}

/**
 *
 * @param {string} filePath - 文件路径
 * @param {string} fileName - 文件名
 * @param {object|string} defaultContent - 创建文件填充的默认内容
 * @param {boolean} override -  是否强制写入
 */
function noExsistsFileCreate (filePath, fileName, defaultContent, override) {
  if (override) {
    fileContentType(filePath, fileName, defaultContent, override);
  } else {
    try {
      console.log(colors.rainbow(`正在查找项目配置文件${fileName}是否存在...`)); // eslint-disable-line no-console
      if (fs.existsSync(filePath)) {
        console.log(colors.green(`${fileName}存在,继续执行构建-->`)); // eslint-disable-line no-console
        return;
      } else {
        fileContentType(filePath, fileName, defaultContent, override);
      }
    } catch (e) {
      fileContentType(filePath, fileName, defaultContent, override);
    }
  }
}

module.exports = noExsistsFileCreate;

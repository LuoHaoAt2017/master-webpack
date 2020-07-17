/* eslint-disable no-console */
const { execSync } = require('child_process');
const path = require('path');
const process = require('process');
const fs = require('fs');
const distPath = path.resolve(process.cwd(), './dist');
console.log('distPath: ', distPath);
const colors = require('colors/safe');

try {
  const distPathStat = fs.statSync(distPath);
  if (distPathStat && distPathStat.isDirectory()) {
    console.log(colors.green(`正在删除清除${distPath}目录的js sourcemap文件`));
    execSync(`find ${distPath} -name "*.js.map" | xargs rm -rf`).toString();
    const st = setTimeout(() => {
      clearTimeout(st);
      console.log(colors.green('成功清除dist目录的js sourcemap文件'));
    }, 300);
  }
} catch (error) {
  console.log(colors.red(error));
  process.exit(1);
}

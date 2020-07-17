#!/bin/bash
current_path=$(cd `dirname $0`; pwd)
pro_path="${current_path}/.."
target_path="${current_path}/../../Web"
modules=(Mobile)
nexusH3BPM=http://120.78.157.233:8888/repository/npm-all/
nexusH3Yun=http://172.18.92.55:8081/repository/npm-all/
taobaoRegistry=https://registry.npm.taobao.org
new_npm=http://npm.h3yun.net:4873/

function init(){
  [ -d "${target_path}" ] && rm -rf ${target_path}
  mkdir -p ${target_path}
  echo "isDeBug is ${isDeBug}"
}

function checktools() {
  node --version
  [ $? -ne 0 ] && echo "node commod is not exist" && exit 1
  cnpm --version
  if [ $? -ne 0 ] ;then
     npm install -g cnpm --registry=https://registry.npm.taobao.org
     #npm install -g cnpm --registry=http://npm.h3yun.net:4873/
     cnpm --version
     [ $? -ne 0 ] && echo "cnpm install fail" && exit 1
  fi

}

function cnpm_commond()
{
  cnpm install
  if [ $? -ne 0 ] ;then
    echo "cnpm  fail"
    [ -d "node_modules" ] && rm -rf node_modules
    cnpm cache clean --force
    cnpm install
    [ $? -ne 0 ] && echo "cnpm  fail again" && exit 1
  else
    echo "download module needpackage success"
  fi
}

function npm_commond()
{
  npm config set registry ${new_npm}
  npm install
  if [ $? -ne 0 ];then
    echo "npm $1 fail"
    [ -d "node_modules" ] && rm -rf node_modules && echo "delete node_modules"
    npm cache clean --force
    #npm init -f
    npm config set registry ${new_npm};npm install
    [ $? -ne 0 ] && echo "npm $1 fail again" && exit 1
  fi
  if [ ! -z "${isDeBug}" ] && [[ "${isDeBug}" != "NO" ]] ;then
    npm run ${isDeBug}
  else
    npm run build
  fi
  [ $? -ne 0 ] && echo "package $1 fail" && exit 1
  echo "package $1 success"
}

function Mobile() {
  local modulePath=${pro_path}
  local targetModulePath=${target_path}/m/
  mkdir -p ${targetModulePath}/
  if [ ! -d "${modulePath}" ] ;then
    echo "Mobile project is not exist"
    exit 1
  fi
  [ -d "${modulePath}/dist" ] && rm -rf ${modulePath}/dist
  [ -d "${modulePath}/node_modules" ] && rm -rf ${modulePath}/node_modules
  [ -d "${modulePath}/env.local.json" ] && rm -f ${modulePath}/env.local.json
  cd ${modulePath}
  npm_commond Mobile

  if [ ! -z "${isDeBug}" ] && [[ "${isDeBug}" != "NO" ]];then
    local version_rc="`cat ${modulePath}/dist/.h3packagerc |grep HASH|awk -F '=' '{print $2}'|awk '{print $1}'`"
    [ ! -f "${modulePath}/dist/.h3packagerc" ] && echo "the file .h3packagerc is not exist" && exit 1
    [ -z "${version_rc}" ] && echo "versionHASH is Null" && exit 1
    cp -f ${modulePath}/dist/.h3packagerc ${targetModulePath}/
  fi

  #copy dist (index.html sw.js manifest.json)
  cp -rf ${modulePath}/dist/* ${targetModulePath}/
  cp -rf ${modulePath}/dist/index.html ${target_path}/
  cp -rf ${modulePath}/dist/sw.js ${target_path}/
  cp -rf ${modulePath}/dist/sw-m.js ${target_path}/
  cp -rf ${modulePath}/dist/manifest.json ${target_path}/
  mkdir -p ${target_path}/icons/
  cp -rf ${modulePath}/dist/icons/* ${target_path}/icons/
  [ $? -ne 0 ] && echo "copy Mobile fail" && exit 1
  echo "copy Mobile success"
  # commitID
  git version
  [ $? -ne 0 ] && yum install git -y
  cd ${pro_path}
  commitID=`git rev-parse HEAD`
  echo "commit_id:${commitID}" >> ${targetModulePath}/changeset.txt
  echo "CDN:${version_rc}" >> ${targetModulePath}/changeset.txt
  return 0
}


function main() {
  init
  checktools
  for i in "$@"
  do
    for j in "${modules[@]}"
    do
      if [ "$i" == "$j" ] ;then
        $i
        [ $? -ne 0 ] && echo "$i return value is $?" && exit 1
      fi
    done
  done
  return 0
}

main $@
exit $?

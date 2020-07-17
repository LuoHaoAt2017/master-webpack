/**
 *
 * @param {string} devEnvs - 需要快速生成代理服务器主域名字
 * @param {object} options - 可以配置协议和域名
 * @returns {object}
 * @description - 返回快速生成的键值对域名
 */
function genDomainObject (devEnvs, protocalOptions) {
  if (!devEnvs || (Array.isArray(devEnvs) && devEnvs.length === 0)) {
    return genDomainObject([
      'master',
      'kappa',
      'odesy',
      'delta',
      'swork',
      'swat',
      'wind',
      'report',
      'reporting',
      'infrastructure',
    ]);
  }
  const result = {};
  const cacheOptions = {
    protocol: 'https',
    domainName: 'h3yun.com',
    ...protocalOptions,
  };
  if (Array.isArray(devEnvs)) {
    devEnvs.forEach(item => {
      if (typeof item === 'string') {
        result[
          item
        ] = `${cacheOptions.protocol}://${item}.${cacheOptions.domainName}`;
      }
    });
  }
  return result;
}

/**
 * @param {array} devEnv- 需要快速生成的域名数组,数组项字符串则根据规则生成，键值对直接浅赋值
 * @param {object} options -  devEnv提供域名和协议的重置，devServers则浅合并到 proxy
 * @description -  返回 webpack proxy 的数组(多个 endpoint映射)
 */
function getDevServers (
  devEnv,
  options = {
    devEnv: {},
    devServers: {},
  },
) {
  const testEnvs = genDomainObject(devEnv, options.devEnv);

  const devServers = {};
  for (const server in testEnvs) {
    const serverPrefix = `/${server}Api`;
    const serverPath = testEnvs[server];
    devServers[serverPrefix] = {
      target: serverPath,
      changeOrigin: true,
      secure: false,
      pathRewrite: { [`^${serverPrefix}`]: '' },
      ...options.devServers,
    };
  }
  return devServers;
}
// console.log(getDevServers(["master", "kappa", "odesy", "delta"]));
// console.log(getDevServers());

module.exports = getDevServers;

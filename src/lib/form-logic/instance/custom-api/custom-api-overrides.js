// 需要注入当前表单对象
export const CustomApiOverride = (customApi, h3PluginDeveloper) => {
  const overrides = {
    IQuery (name) {
      return customApi.RequestParameters && customApi.RequestParameters[name];
    },
  };
  return Object.assign({}, h3PluginDeveloper, overrides);
};

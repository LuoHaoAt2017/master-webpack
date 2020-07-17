function getRandom(num) {
  const r = Math.random();
  return Math.floor(num * r);
}
export function generateAppDatas(appNum, hasRecent, options) {
  const appGroups = [];
  const recent = [];
  const apps = [];
  const opts = options || {};
  const appCount = appNum || 6;
  for (let i = 0; i < appCount; i += 1) {
    const groupCount = opts.groupCount || getRandom(2) + 1;
    const DisplayName = `测试应用${i}`;
    const AppCode = `D00${i}Test${i}`;
    apps.push({
      DisplayName,
      SchemaCode: AppCode, // apps中的SchemaCode 是 appGroups 中的AppCode
    });
    for (let j = 0; j < groupCount; j += 1) {
      const formCount = opts.groupCount || getRandom(8);
      const appGroup = {
        AppCode,
        DisplayName,
        GroupCode: `app${i}group${j}`,
        GroupDisplayName: `分组${j}`,
        Childrens: [],
      };
      for (let k = 0; k < formCount; k += 1) {
        const SchemaCode = `app${i}group${j}form${k}`;
        appGroup.Childrens.push({
          AppCode,
          SchemaCode,
          Code: SchemaCode,
          DisplayName: `表单${i}${j}${k}`,
          ParentCode: appGroup.GroupCode,
          OpenType: 1,
          IconCss: 'icon-cgfk',
          appIconCss: `font-icon icon-cgfk app-icon-color-${k % 4}`,
        });
      }
      appGroups.push(appGroup);
    }
  }
  if (hasRecent) {
    for (let m = 0; m < 4; m += 1) {
      const appGroupIndex = getRandom(appGroups.length);
      const targetGroup = appGroups[appGroupIndex];
      if (targetGroup) {
        const formIndex = getRandom(targetGroup.Childrens.length);
        const form = targetGroup.Childrens[formIndex];
        if (form && recent.every(r => r.SchemaCode !== form.SchemaCode)) {
          recent.push(form);
        }
      }
    }
  }
  return {
    Apps: apps,
    AppGroups: appGroups,
    RecentModules: recent,
  };
}
function queryAppDatas(
  appCode, solutionCode, appType,
  includeReport = true, workflowOnly = false,
) {
  switch (appCode) {
    case 'singleApp':
      return generateAppDatas(1, false, { includeReport, workflowOnly });
    case 'singlewidthRecent':
      return generateAppDatas(1, true, { includeReport, workflowOnly });
    case 'multi':
      return generateAppDatas(8, false, { includeReport, workflowOnly });
    case 'static':
      return generateAppDatas(8, false, {
        groupCount: 1,
        formCount: 4,
        includeReport,
        workflowOnly,
      });
    default:
      return generateAppDatas();
  }
}

export default queryAppDatas;

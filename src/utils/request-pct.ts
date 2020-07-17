/**
 * @author YJH
 * 请求地址数据源，并做本地缓存
 */
import axios from 'axios';
import { jsonParse } from './index';

interface FlatItem {
  id: string;
  name: string;
  level: string;
}
interface TreeItem {
  id: string;
  name: string;
  center: string;
  level: number;
  children?: TreeItem[];
}
interface AreaData {
  treeData: TreeItem[];
  flatData: FlatItem[];
}

const version = 'v3';
const localStorageKey = 'H3_LOCAL_AREA_PCT';
let instance = null;

export default (): Promise<AreaData> => {
  if (instance) {
    return instance;
  }
  const resourceUrl = process.env.RESOURCE_URL;
  const localAreaData = getLocalAreaData();
  const emptyData: AreaData = {
    treeData: [], flatData: [],
  };
  // 若本地无缓存数据
  // 或者代码中版本与本地版本 不相等，即重新请求
  if (!localAreaData || version !== localAreaData.version) {
    instance = new Promise((resolve) => {
      axios.get(`${resourceUrl}/lib/pct/${version}/pct.min.json`).then((resourceResponse) => {
        if (resourceResponse && resourceResponse.data) {
          const areaData: TreeItem[] = resourceResponse.data;
          if (Array.isArray(areaData)) {
            window.localStorage.setItem(localStorageKey, JSON.stringify({
              data: areaData,
              version,
            }));
            resolve({
              treeData: areaData,
              flatData: flatArea(areaData),
            });
          }
        }
        resolve(emptyData);
      }).catch(() => {
        resolve(emptyData);
      });
    });
  } else if (localAreaData && localAreaData.data instanceof Array) {
    // 可以使用本地缓存，数据源版本无变化
    instance = Promise.resolve({
      treeData: localAreaData.data,
      flatData: flatArea(localAreaData.data),
    });
  } else {
    instance = Promise.resolve(emptyData);
  }
  return instance;
};

function getLocalAreaData () {
  if (typeof window !== 'undefined') {
    const localAreaDataJson = window.localStorage.getItem(localStorageKey);
    if (localAreaDataJson) {
      const areaData = jsonParse(localAreaDataJson);
      if (areaData) {
        return areaData;
      }
    }
  }
  return false;
}

/**
 * 将地址的树型数据拉平
 * @param area 树型数据
 * @param parent 当前节点是否有父节点
 */
function flatArea (area: TreeItem[], parent = ''): FlatItem[] {
  const result: any = [];
  const levelMap = {
    1: 'province',
    2: 'city',
    3: 'district',
    4: 'street',
  };
  area.forEach(item => {
    const {
      id, name, children = [], level,
    } = item;
    result.push({ id, name, parent, value: id, level: levelMap[level] }, ...flatArea(children, id));
  });
  return result;
}

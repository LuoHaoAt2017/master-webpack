/**
 * 路由拦截
 */
import {excludeComponentCache} from "@/config/cache";
import store from "@/store";
import { getSolutionGoodsInfo } from '@/service/common.service';

function setSolutionGoodsInfo(data) {
  let obj: any = {};
  for (let item of data) {
    obj[item.SolutionCode] = item.GoodsCode;
  }
  store.state.solutionGoodsInfo = obj;
}

export async function routerBeforeEach (to, from, next) {
  //设置页面跳转不缓存组件
  const excludeComponent = excludeComponentCache[from.name]
  if(excludeComponent){
    if(excludeComponent.indexOf(to.name) !== -1){
      store.state.excludeComp = [from.name];
    }else{
      store.state.excludeComp = []
    }
  }

  try{
    const solutionGoodsInfo = store.state.solutionGoodsInfo;
    if (solutionGoodsInfo && Object.keys(solutionGoodsInfo).length > 0) {
      const result: any = await getSolutionGoodsInfo();
      if (result.Successful) {
        setSolutionGoodsInfo(result.Data);
      }
    }
  }catch(err) {
    alert('获取到期提醒失败');
  }

  if (to.meta.title) {
    document.title = to.meta.title;
  }

  next();
}

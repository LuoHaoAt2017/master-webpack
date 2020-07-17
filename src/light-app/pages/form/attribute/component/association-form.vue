<template>
  <div class="light-form-association">
    <!-- 展示表单 -->
    <div
      class="association__item"
      @click="openTreeLayer"
      v-if="!showTreeLayler && !loading"
    >
      <div
        v-if="selectedName"
        class="association__item-selected"
      >{{ selectedName }}
        <i
          @click.stop="clearSelected"
          class="clear h3yun_All close fa box-icon"
        ></i>
      </div>
      <div
        v-else
        class="association__item-placeholder"
      >请选择关联表单</div>
      <i class="association__item-icon icon h3yun_All form-related-o"></i>
    </div>
    <!-- 骨架加载 -->
    <skeleton
      class="association__item--loading"
      v-if="loading"
    ></skeleton>
    <!-- 选择层 -->
    <div
      class="association-layer"
      v-if="showTreeLayler"
    >
      <!-- 搜索模块 -->
      <association-search @selected="onSearchSelected"></association-search>
      <!-- 树形选择区 -->
      <div
        class="association-layer-wrapper"
        ref="listWrapper"
      >
        <!-- 应用层 -->
        <div
          class="app-list-item"
          v-for="app in treeNodes"
          :key="app.code"
        >
          <div
            class="app-list-item__app"
            @click="onGetTreesChildren(app)"
          >
            <span class="item-title">{{ app.title }}</span>
            <i
              v-if="!app.loading"
              class="arrow h3yun_All right-o fa box-icon"
              :class="{expand: app.expand}"
            ></i>
            <h3-icon
              v-else
              class="arrow"
              style="color: #c4cad9; font-size: 12px;"
              type="loading"
            />
          </div>
          <!-- 表单和分组层 -->
          <ul
            class="app-list-item__sheet-list"
            :class="{expand: app.expand}"
            v-show="app.expand"
          >
            <li
              class="app-list-item__sheet-list-item"
              v-for="child in app.children"
              :key="child.key"
              :style="child.expand ? `height: ${1.493333 + getListHeight(child)}rem` : ''"
            >
              <div class="app-list-item__subsheet">
                <i
                  class="icon h3yun_All icon-cgfk"
                  v-if="child.type !== 230"
                ></i>
                <span
                  class="item-title"
                  :class="{selected: selectedValue === child.key}"
                  @click="onSelected(child)"
                >{{ child.title }}</span>
                <i
                  v-if="!child.isLeaf && !child.loading"
                  class="arrow h3yun_All right-o fa box-icon"
                  :class="{expand: child.expand}"
                  @click="onGetTreesChildren(child)"
                ></i>
                <h3-icon
                  v-if="child.loading"
                  class="arrow"
                  style="color: #c4cad9; font-size: 12px;"
                  type="loading"
                />
              </div>
              <!-- 明细表和分组表单层 -->
              <ul
                class="app-list-item__subsheet-list"
                :class="{expand: child.expand}"
                v-show="child.expand"
              >
                <li
                  class="app-list-item__subsheet-list-item"
                  v-for="grandson in child.children"
                  :key="grandson.key"
                >
                  <i class="icon h3yun_All text-file-o"></i>
                  <span
                    class="item-title"
                    :class="{selected: selectedValue === grandson.key}"
                    @click="onSelected(grandson)"
                  >{{ grandson.title }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang='ts'>
import {
  Vue,
  Component,
  Prop,
  Emit,
  Watch,
  Mixins
} from 'vue-property-decorator';
import { State, Getter, Mutation, Action, namespace } from 'vuex-class';
import associationSearch from './association-search.vue';
import cloneDeep from 'lodash/cloneDeep';
import { AssociationNodeType } from '@/light-app/config/const';
import { getAssociatedApps } from '@/light-app/service';
import skeleton from '@/components/common/skeleton-loading.vue';
import { H3Icon } from 'h3-mobile-vue';
import _get from 'lodash/get';

const LightApp = namespace('LightApp');

@Component({
  name: 'FormAssociation',
  components: {
    associationSearch,
    skeleton,
    H3Icon
  }
})
export default class AssociationForm extends Vue {
  @Prop()
  defaultValue!: string;

  loading: boolean = true;

  showTreeLayler: boolean = false;

  selectedName: string = '';

  selectedValue: string = '';

  selectedIndexes: number[] = [];

  treeNodes: any[] = [];

  BOSchemaInfo: any = {
    AppPackage: null,
    AppGroup: null,
    AppMenu: null,
    BOSchemaCode: null,
    IsChildSchema: null,
    formControl: null
  };

  baseListHeight: number = 112;

  /**
   * 获取列表高度，用于二级展开
   */
  getListHeight(app) {
    let height = 0;
    let borderCount = 0;
    const baseListHeight = this.baseListHeight;
    const loop = data => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.children && item.children.length) {
          loop(item.children);
        }
        height += baseListHeight;
        borderCount += 1;
      }
    };
    loop(app.children);
    return height / 75;
  }

  created() {
    // 有默认值，构造参数展开选中项
    if (this.defaultValue) {
      this.BOSchemaInfo = this.defaultValue;
      if (this.BOSchemaInfo.AppPackage) {
        this.selectedValue = this.BOSchemaInfo.BOSchemaCode;
        this.autoExpandTree(this.BOSchemaInfo);
      }
    } else {
      this.autoExpandTree();
    }
  }

  /**
   * 滚动到合适位置
   */
  scrollTo() {
    if (this.selectedIndexes.length) {
      const total = this.selectedIndexes.reduce((b, n) => b + n);
      (this.$refs.listWrapper as any).scrollTop = total * (this.baseListHeight / 2);
    }
  }
  /**
   * 清楚选中项
   */
  clearSelected() {
    this.selectedName = '';
    this.selectedValue = '';
    this.onChange(null);
  }

  /**
   * 展开树
   */
  async autoExpandTree(params?: any) {
    const res = await getAssociatedApps(params);
    if (res.success) {
      const tree = [];
      this.setTreeData(tree, res.returnData.children);
      this.treeNodes = tree;
      this.loading = false;
    } else {
      this.$h3.toast.show({text: '请求失败'});
      this.loading = false;
    }
  }

  /**
   * 设置树形结构数据
   */
  setTreeData(parent, children) {
    let tree;
    if (children && children.length > 0) {
      if (!parent || parent.length === 0) {
        tree = parent;
      } else {
        tree = parent.children;
      }

        const isSubtable =
        !Array.isArray(parent) &&
        _get(parent, 'dataRef.parent.dataRef.nodeType') ===
          AssociationNodeType.AppPackage;

      children.forEach((node, index) => {
        const treeNode = {
          key: node.code,
          title: isSubtable
            ? `${parent.title}.${node.displayName}`
            : node.displayName,
          value: node.code,
          isLeaf: !node.hasChild,
          selectable: node.canCheck,
          type: node.type,
          children: [],
          expand: node.children ? true : false,
          icon: node.type !== AssociationNodeType.GroupModule ? '' : '',
          index,
          loading: false,
          dataRef: {
            hasChild: node.hasChild,
            code: node.code,
            nodeType: node.type,
            title: node.displayName,
            parent: node.type === AssociationNodeType.AppPackage ? null : parent
          }
        };
        // 递归设置数据
        if (node.children && node.children.length > 0) {
          this.setTreeData(treeNode, node.children);
        }
        
        // 定位到选中节点
        if (this.selectedValue === treeNode.value) {
          this.selectedName = treeNode.title;
          // 记录展开index，方便计算top
          const parent = treeNode.dataRef.parent;
          if (parent) {
            this.selectedIndexes.push(parent.index);
            if (parent.dataRef.parent) {
              this.selectedIndexes.push(parent.dataRef.parent.index);
            }
            this.selectedIndexes.push(index);
          } else {
            this.selectedIndexes.push(index);
          }
        }
        tree.push(treeNode);
      });
    }
  }

  /**
   * 打开树浮层
   */
  openTreeLayer() {
    this.showTreeLayler = true;
    // 确保dom元素挂载
    this.$nextTick(() => {
      this.scrollTo();
    });
    this.backStack.push(() => {
      this.onClosed();
    });
  }

  /**
   * 获取子节点数据
   */
  async onGetTreesChildren(node:any) {
    const dataRef = node.dataRef || {};
    const { code, hasChild, nodeType, expand } = node.dataRef;
    // 无数据的情况进行请求
    if (!(node.children && node.children.length)) {
      node.loading = true;
      const res = await getAssociatedApps({
        ParentCode: code
      });
      if (res.success) {
        node.expand = true;
        node.loading = false;
        let children = res.returnData.children;
        const temp = children.map((child, index) => ({
          key: child.code,
          title:
            dataRef.parent &&
            dataRef.parent.type === AssociationNodeType.AppPackage
              ? `${dataRef.title}.${child.displayName}`
              : child.displayName,
          value: child.code,
          isLeaf: !child.hasChild,
          children: child.children || [],
          type: child.type,
          selectable: child.canCheck,
          expand: child.children ? true : false,
          loading: false,
          index,
          dataRef: {
            hasChild: child.hasChild,
            code: child.code,
            nodeType: child.type,
            title: child.displayName,
            parent: {
              type: node.dataRef.nodeType,
              value: node.dataRef.code,
              title: node.dataRef.title,
              dataRef: {
                parent: node.dataRef.parent
              }
            }
          }
        }));
        // 回填子节点数据
        this.rebuildTreeData([...this.treeNodes], node.dataRef.code, temp);
        this.treeNodes = [...this.treeNodes];
      }
    } else {
      // 直接展开/收起
      node.expand = !node.expand;
    }
  }

  /**
   * 递归回填子节点数据
   */
  rebuildTreeData(treeNode, targetKey, childNodes) {
    const loop = data => {
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (item.children && item.children.length) {
          loop(item.children);
        }
        if (targetKey.indexOf(item.key) === 0) {
          item.children = childNodes;
          break; // 及时跳出循环
        }
      }
    };
    loop(treeNode);
  }

  /**
   * 选中节点回调
   */
  onSelected(node) {
    // 节点不可选时
    if (!node.selectable) {
      return;
    }
    this.selectedValue = node.value;
    this.selectedName = node.title;
    // 确保设置了正确信息
    this.setInfo(node.value, node).then(() => {
      this.onChange(node.value);
      this.onClosed();
    });
  }

  /**
   * change回调
   */
  onChange(val: string) {
    if (!val) {
      this.$emit('change');
      return;
    }
    const copy = JSON.parse(JSON.stringify(this.BOSchemaInfo));
    delete copy.BOSchemaCode;
    this.$emit('change', {
      BOSchemaInfo: JSON.stringify(copy),
      BOSchemaCode: this.BOSchemaInfo.BOSchemaCode,
      BOSchemaName: ''
    });
    // this.$emit('change', JSON.stringify(this.BOSchemaInfo));
  }

  /**
   * 搜索时选中回调
   */
  onSearchSelected(node) {
    this.selectedValue = node.code;
    this.selectedName = node.nameCopy;
    let AppPackage = node.appCode;
    let AppGroup = node.groupCode;
    let AppMenu = node.code;
    let SchemaCode = node.code;
    let IsChildSchema = false;
    this.BOSchemaInfo = {
      AppPackage,
      AppGroup,
      AppMenu,
      BOSchemaCode: SchemaCode,
      IsChildSchema
    };
    this.onChange(SchemaCode);
    this.onClosed();
  }

  /**
   * 设置基础信息
   */
  setInfo(val: string, node: any) {
    return new Promise(resolve => {
      let AppPackage = '';
      let AppGroup = '';
      let AppMenu = '';
      let SchemaCode = val;
      let parent = node.dataRef.parent;
      // 回溯找到上层code
      while (parent) {
        if (parent.type === AssociationNodeType.AppPackage) {
          // 应用下的表单
          AppPackage = parent.value;
        } else if (parent.type === AssociationNodeType.GroupModule) {
          AppGroup = parent.value;
        } else {
          AppMenu = parent.value;
        }
        parent = parent.dataRef.parent;
      }
      this.BOSchemaInfo = {
        AppPackage,
        AppGroup,
        AppMenu,
        BOSchemaCode: SchemaCode,
        IsChildSchema: !!(AppMenu && AppMenu !== SchemaCode)
      };
      resolve();
    });
  }

  // 关闭时回调
  onClosed() {
    this.backStack.pop();
    this.showTreeLayler = false;
    this.selectedIndexes = [];
  }
}
</script>
<style lang='less' scoped>
@import '~@/styles/form-base.less';
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}

.light-form-association {
  .association {
    &__item {
      display: flex;
      justify-content: space-between;
      // .px2rem(height, 64);
      .px2rem(padding-top, 12);
      .px2rem(padding-bottom, 12);
      .px2rem(padding-left, 16);
      .px2rem(padding-right, 16);
      .px2rem(border-radius, 4);
      border: 1px solid #e0e0e0;
      &--loading {
        width: 100%;
        .px2rem(height, 88);
      }
      &-selected {
        // white-space: nowrap;
        // overflow: hidden;
        display: flex;
        align-items: center;
        max-width: calc(~'100% - 0.64rem');
        .px2rem(min-height, 40);
        // .px2rem(height, 64);
        line-height: 1.5;
        .px2rem(padding-left, 16);
        .px2rem(padding-right, 16);
        .px2rem(padding-top, 12);
        .px2rem(padding-bottom, 12);
        text-overflow: ellipsis;
        background: #e7f2fd;
        .px2rem(border-radius, 4);
        .px2rem(font-size, 30);
        color: #107ff0;
        word-break: break-all;
        .clear {
          .px2rem(padding-left, 6);
          .px2rem(font-size, 26);
          color: #389cff;
        }
      }
      &-placeholder {
        display: flex;
        align-items: center;
        max-width: calc(~'100% - 0.64rem');
        .px2rem(min-height, 40);
        // .px2rem(height, 64);
        line-height: 1.5;
        .px2rem(padding-left, 6);
        .px2rem(padding-right, 16);
        .px2rem(padding-top, 12);
        .px2rem(padding-bottom, 12);
        text-overflow: ellipsis;
        .px2rem(font-size, 30);
        color: #ccc;
      }
      &-icon {
        .px2rem(width, 28);
        .px2rem(margin-top, 16);
        .px2rem(margin-left, 16);
        .px2rem(font-size, 28);
        color: #b4b7bc;
      }
    }
    &__tree {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 10000;
      overflow: auto;
      background: #fff;
    }
    &-layer {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 10000;
      background: #fff;
      &-wrapper {
        .px2rem(margin-top, 110);
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        .app-list-item {
          &__app {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .px2rem(height, 110);
            .px2rem(padding-left, 30);
            // .px2rem(padding-right, 30);
            border-bottom: 1px solid #ebedf2;
            &.last {
              border-bottom: none;
            }
            .item-title {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              &.selected {
                color: #107fff;
              }
            }
            .arrow {
              .px2rem(width, 100);
              color: #c4cad9;
              text-align: center;
              transition: transform 0.15s ease;
              &.expand {
                transform: rotate(90deg);
              }
            }
          }
          &__sheet-list {
            opacity: 0;
            transition: height 0.15s ease, opacity 0.15s ease;
            &.expand {
              opacity: 1;
            }
            &-item {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              justify-content: space-between;
              // .px2rem(height, 110);
              .px2rem(margin-left, 60);
              // .px2rem(padding-left, 30);
              // border-bottom: 1px solid #ebedf2;
              &.last {
                border-bottom: none;
              }
              .icon {
                .px2rem(margin-right, 10);
              }
              .item-title {
                flex: 1;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                &.selected {
                  color: #107fff;
                }
              }
              .arrow {
                .px2rem(width, 100);
                color: #c4cad9;
                text-align: center;
                transition: transform 0.15s ease;
                &.expand {
                  transform: rotate(90deg);
                }
              }
            }
          }
          &__subsheet {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            width: calc(~'100% - 0.4rem');
            .px2rem(height, 110);
            .px2rem(padding-left, 30);
            border-bottom: 1px solid #ebedf2;
            &.last {
              border-bottom: none;
            }
            .icon {
              .px2rem(margin-right, 10);
            }
            .item-title {
              flex: 1;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              &.selected {
                color: #107fff;
              }
            }
            .arrow {
              .px2rem(width, 100);
              color: #c4cad9;
              text-align: center;
              transition: transform 0.15s ease;
              &.expand {
                transform: rotate(90deg);
              }
            }
            &-list {
              width: 100%;
              opacity: 0;
              transition: height 0.15s ease, opacity 0.15s ease;
              &.expand {
                opacity: 1;
              }
              &-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                .px2rem(height, 110);
                .px2rem(margin-left, 60);
                .px2rem(padding-left, 30);
                .px2rem(padding-right, 30);
                border-bottom: 1px solid #ebedf2;
                &.last {
                  border-bottom: none;
                }
                .icon {
                  .px2rem(margin-right, 10);
                }
                .item-title {
                  flex: 1;
                  white-space: nowrap;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  &.selected {
                    color: #107fff;
                  }
                }
                .arrow {
                  .px2rem(width, 100);
                  color: #c4cad9;
                  text-align: center;
                  transition: transform 0.15s ease;
                  &.expand {
                    transform: rotate(90deg);
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>

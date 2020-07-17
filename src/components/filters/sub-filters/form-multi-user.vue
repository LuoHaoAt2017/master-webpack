<template>
    <div class="bd-bot filter-user" @click="chooseDepUser" v-show="formVal.IsDisplay">
        <div class="param-title">
            <div>{{formVal.DisplayName}}</div>
            <div v-if="!formVal.OrgUnitVisible && formVal.UserVisible && selected.length>0">{{'已选择'+selected.length+'人'}}</div>
        </div>
        <div class="param-value" @click="chooseDepUser">
            <span v-if="selected.length===0">{{placeHolder}}</span>
            <div class="selected" v-if="selectedUsers.length>0">
                <div v-for="(user,index) in selectedUsers"  :key="user.UnitID || user.ObjectId"  class="user-selected" @click.stop.prevent="removeSelected(user)">
                    <div class="avator" :style="{background:colors[index%5]}">
                        <img :src="user.ProfilePhotoUrl || user.Avatar" v-if="user.ProfilePhotoUrl || user.Avatar" v-cloak />
                        <span class="avator-name" v-if="!user.ProfilePhotoUrl && !user.Avatar" >
                            {{(user.Name && user.Name.substr(user.Name.length-2,2)) || (user.DisplayName && user.DisplayName.substr(user.DisplayName.length-2,2))}}
                        </span>
                        <i class="remove icon-reset"></i>
                    </div>
                    <div class="name">
                        {{user.Name}}
                    </div>
                </div>
            </div>
            <div class="selected" v-if="selectedDeps.length>0">
                <div v-for="dep in selectedDeps"  :key="dep.UnitID || dep.ObjectId"  class="dep-selected" @click="removeSelected(dep)">
                    {{dep.Name || dep.DisplayName}}
                </div>
            </div>
        </div>
        <div class="icon h3yun_All user-o" @click="chooseDepUser" v-if="(!formVal.OrgUnitVisible && formVal.UserVisible && selected.length===0)"></div>
        <div class="icon h3yun_All right-o" v-if="formVal.OrgUnitVisible" @click="chooseDepUser"></div>
    </div>
</template>

<script>
// zyq;
import { getMultiFormUser } from '../../../service/get-data';

export default {
  name: 'FormMultiUser',
  props: ['formVal', 'keyName'],
  data() {
    return {
      placeHolder: '请选择',
      selected: [], // 选中对象
      colors: ['#956FEA', '#FFAD69', '#00A2FF', ' #46CFB6', '#5CD5FC'],
      backUpValue: null,
    };
  },
  // 从父组件传递过来的数据
  created() {
    if (this.formVal.DefaultValue) {
      // 判断值类型，如果是字符串id类型，需要向后台发起请求
      this.setValue(this.formVal.DefaultValue);
    }
    const event = `assignVal${this.formVal.DataField}`;
    // 接收选人值
    this.$root.eventHub.$on(event, (data) => {
      if (data.length > 0) {
        for (const unit of data) {
          if (!unit.Name) {
            unit.Name = unit.DisplayName;
          }
        }
        this.selected = data;
      } else {
        this.selected = [];
      }
      const that = this;
      setTimeout(() => {
        that.$root.eventHub.$emit('refreshScroll', 'organization');
      }, 300);
    });
  },
  mounted() {
    //   this.$store.state.readyFiltersCount++;
  },
  methods: {
    getValue() {
      this.backUpValue = null;
      const res = [];
      for (const item of this.selected) {
        res.push(item.UnitID || item.ObjectId);
      }
      return res;
    },
    setValue(val) {
      if (!val) {
        this.reset();
        return;
      }
      if (this.formVal.DataField === 'OwnerId') {
        if (val.constructor === Array) {
          this.addValue(val[0].ObjectId);
        } else if (val.constructor === String) {
          this.addValue(val);
        } else if (val.constructor === Object) {
          this.addValue(val.ObjectId);
        }
      } else if (val.constructor === Array || val.constructor === String) {
        this.addValue(val);
      } else if (val.constructor === Object) {
        this.addValue(val.ObjectId);
      }
    },
    reset() {
      this.backUpValue = this.selected;
      this.selected = [];
    },
    rollBack() {
      if (this.backUpValue) {
        this.selected = this.backUpValue;
      }
    },
    // 获取已经存在的用户，不用重新去服务端请求
    getExistsUnit(unitId) {
      for (const unit of this.$store.state.FormMultiUserData.OrgUnitItems) {
        const tmpId = unit.ObjectId || unit.UnitID;
        if (tmpId === unitId) {
          return unit;
        }
      }
      for (const unit of this.$store.state.FormMultiUserData.UserItems) {
        const tmpId = unit.ObjectId || unit.UnitID;
        if (tmpId === unitId) {
          return unit;
        }
      }
      return null;
    },
    // 判断unit对象是否只有ObjectId值
    isOnlyObjectIdObj(obj) {
      return Object.prototype.hasOwnProperty.call(obj, 'ObjectId') && !Object.prototype.hasOwnProperty.call(obj, 'ParentId');
    },
    addValue(obj) {
      const that = this;
      if (!obj) {
        return;
      }
      const res = [];
      const news = [];
      if (obj.constructor === Array) {
        let exist = null;
        for (let i = 0, len = obj.length; i < len; i += 1) {
          if (obj[i].constructor === Object) {
            if (that.isOnlyObjectIdObj(obj[i])) {
              exist = that.getExistsUnit(obj[i].ObjectId);
              if (exist) {
                res.push(exist);
              } else {
                news.push(obj[i].ObjectId);
              }
            } else {
              res.push(obj[i]);
              // 判断是否已经存在缓存中了，如果存在，则不用处理，不存在，则请求
              if (obj[i].UnitType === 4 || obj[i].Type === 4) {
                this.$store.state.FormMultiUserData.UserItems.push(obj[i]);
              } else {
                this.$store.state.FormMultiUserData.OrgUnitItems.push(obj[i]);
              }
            }
          } else if (obj[i].constructor === String) {
            exist = that.getExistsUnit(obj[i]);
            if (exist) {
              res.push(exist);
            } else {
              news.push(obj[i]);
            }
          }
        }
      } else if (obj.constructor === Object) {
        if (that.isOnlyObjectIdObj(obj)) {
          const exist = that.getExistsUnit(obj.ObjectId);
          if (exist) {
            res.push(exist);
          } else {
            news.push(obj.ObjectId);
          }
        } else {
          res.push(obj);
          // 判断是否已经存在缓存中了，如果存在，则不用处理，不存在，则请求
          if (obj.UnitType === 4 || obj.Type === 4) {
            this.$store.state.FormMultiUserData.UserItems.push(obj);
          } else {
            this.$store.state.FormMultiUserData.OrgUnitItems.push(obj);
          }
        }
      } else if (obj.constructor === String) {
        const exist = that.getExistsUnit(obj);
        if (exist) {
          res.push(exist);
        } else {
          news.push(obj);
        }
      }

      if (news.length > 0) {
        this.requestMultiFormUser(JSON.stringify(news), res);
      } else {
        this.selected = res;
        setTimeout(() => {
          that.$root.eventHub.$emit('refreshScroll');
        }, 300);
      }
    },
    removeSelected(unit) {
      for (let i = this.selected.length - 1; i >= 0; i -= 1) {
        const item = this.selected[i];
        if ((item.UnitID && item.UnitID === unit.UnitID)
        || (item.ObjectId && item.ObjectId === unit.ObjectId)) {
          this.selected.splice(i, 1);
          break;
        }
      }
    },
    async requestMultiFormUser(unitID, res) {
      let data = await getMultiFormUser(unitID);
      if (data.Successful) {
        data = data.ReturnData.UnitItems;
        // 直接添加到缓存和结果中
        for (let i = 0, len = data.length; i < len; i += 1) {
          res.push(data[i]);
          if (data[i].UnitType === 4 || data[i].Type === 4) {
            // 用户
            this.$store.state.FormMultiUserData.UserItems.push(data[i]);
          } else {
            // 部门
            this.$store.state.FormMultiUserData.OrgUnitItems.push(data[i]);
          }
        }
        this.selected = res;
        const that = this;
        setTimeout(() => {
          that.$root.eventHub.$emit('refreshScroll');
        }, 300);
      }
    },
    chooseDepUser() {
      const filterBox = document.getElementsByClassName('listfilter-box');
      if (filterBox && filterBox.length > 0) {
        this.$store.state.lastFilterBoxPosition = filterBox[0].scrollTop;
      }
      this.$router.push({
        name: 'userDepartmentChoosePage',
        params: {
          valueArr: this.value,
          showUnActive: false,
          userVisible: this.formVal.UserVisible,
          orgUnitVisible: this.formVal.OrgUnitVisible ? 'true' : 'false',
          isMultiple: 'true',
          keyName: this.formVal.DataField,
          isFilter: true,
          eventMark: this.formVal.DataField,
          value: this.selected,
        },
      });
    },
  },
  computed: {
    selectedUsers() {
      const res = [];
      for (const item of this.selected) {
        if (item.UnitType === 4 || item.Type === 4 || item.ParentName) {
          res.push(item);
        }
      }
      return res;
    },
    selectedDeps() {
      const res = [];
      for (const item of this.selected) {
        if (item.UnitType === 2 || item.Type === 2 || item.Type === 1) {
          res.push(item);
        }
      }
      return res;
    },
  },
};
</script>

<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.filter-user {
  position: relative;
  .px2rem(padding,24);
  display: flex;
  align-items: flex-start;
  div.selected {
    display: flex;
    flex-wrap: wrap;
    .user-selected {
      .px2rem(width,84);
      .px2rem(margin-right,36);
      .px2rem(margin-bottom,24);
      &:nth-child(3n) {
        margin-right: 0;
      }
      div.avator {
        position: relative;
        .px2rem(width,84);
        .px2rem(height,84);
        .px2rem(line-height,84);
        border-radius: 50%;
        .px2rem(font-size,28);
        text-align: center;
        span.avator-name {
          color: #fff !important;
        }
        img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
        i.remove {
          position: absolute;
          top: 0;
          right: -5px;
          .px2rem(font-size,26);
        }
      }
      div.name {
        .px2rem(margin-top,18);
        .px2rem(font-size,18);
        color: #999;
      }
    }
    .dep-selected {
      .px2rem(margin-right,14);
      .px2rem(margin-bottom,20);
      .px2rem(padding-left,20);
      .px2rem(padding-right,20);
      .px2rem(height,42);
      .px2rem(line-height,42);
      .px2rem(border-radius,10);
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      border: 1px solid #467db9;
      .px2rem(font-size,24);
      color: #467db9;
    }
  }

  .icon {
    position: absolute;
  }
}
</style>

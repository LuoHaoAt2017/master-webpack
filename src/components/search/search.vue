<template>
	<div class="bar">
		<div class="row search-row">
			<div class="input-wrapper">
				<div class="relative">
					<input type="search" placeholder="搜索" @input="sheetSearch()" v-model="keyword" class="search-input">
					<i class="icon icon-search h3yun_All search-o search-left" v-show="keyword.length==0"></i>
					<i class="icon icon-close h3yun_All close search-right" v-show="keyword.length>0" @click="cancelFastSearch()"></i>
				</div>
			</div>
			<div v-if="showSort" class="top-bar-btn mian-color" @click="openSortModal()">排序</div>
			<div class="top-bar-btn mian-color" @click="openSideModal()">筛选</div>
		</div>
	</div>
</template>
<script>
// zyq;
export default {
  name: 'search',
  props: ['showSort', 'SchemaCode', 'IsWorkflow', 'defalutSort', 'defalutOrder'],
  data() {
    return {
      keyword: '',
      filterShow: false,
      filterCount: 'clicked',
    };
  },
  methods: {
    sheetSearch() {
      this.$emit('sheet-search', this.keyword);
    },
    cancelFastSearch() {
      this.keyword = '';
      this.$emit('cancel-search');
    },
    openSortModal() {
      // 点击加载排序组件
      this.$root.eventHub.$emit('query-sort-data'); // 点击排序触发排序数据请求加载
      this.$router.push({
        name: 'sort',
        params: {
          SchemaCode: this.SchemaCode,
          IsWorkflow: this.IsWorkflow,
          defalutSort: this.defalutSort,
          defalutOrder: this.defalutOrder,
        },
      });
    },
    openSideModal() {
      // 点击加载筛选组件
      const timesTamp = `${new Date().getTime()}`;
      this.$root.eventHub.$emit('query-fiter-data', timesTamp);
    },
  },
};
</script>
<style scoped lang="less">
.bar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-transform: translate3d(0, 0, 0);
  transform: translate3d(0, 0, 0);
  -webkit-user-select: none;
  user-select: none;
  /*  position: absolute;*/
  right: 0;
  left: 0;
  z-index: 9;
  box-sizing: border-box;
  padding: 5px;
  width: 100%;
  height: 44px;
  border-width: 0;
  border-style: solid;
  border-top: 1px solid transparent;
  border-bottom: 1px solid #ddd;
  background-color: white;
  background-size: 0;
  position: relative;
  padding: 0px;
  margin-bottom: 14px;
  // padding-top: 1rem;
}

.row {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  padding: 5px;
  width: 100%;
}

.search-row {
  height: 44px;
  position: relative;
  display: -webkit-box;
  display: -moz-box;
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: center;
  -moz-justify-content: center;
  -webkit-justify-content: center;
  justify-content: center;
  -webkit-box-align: center;
  -moz-align-items: center;
  -webkit-align-items: center;
  align-items: center;
  padding-left: 12px;
  .input-wrapper {
    line-height: 30px;
    -webkit-flex: 1;
    flex: 1;
    margin-right: 6px;
    .icon-search {
      line-height: 28px;
      font-size: 14px;
    }
    .search-left {
      font-size: 16px;
      position: absolute;
      left: 50%;
      line-height: 29px;
      height: 28px;
      top: 50%;
      color: #999;
      -webkit-transform: translate(-16px, -14px);
      transform: translate(-16px, -14px);
      -webkit-transition: all 0.2s ease-out;
      transition: all 0.2s ease-out;
    }
  }
  .relative {
    position: relative;
    width: 100%;
    .search-input {
      box-sizing: border-box;
      text-align: left;
      height: 28px;
      padding: 5px 10px 5px 25px;
      width: 100%;
      color: #999;
      border: 0;
      border-radius: 3px;
      background-color: #f8f8f8;
      line-height: 18px;
      padding-left: 50%;
      -webkit-transition: padding 0.2s ease-out;
      transition: padding 0.2s ease-out;
      vertical-align: middle;

      &:focus {
        text-align: left;
        padding-left: 25px;
      }
      &:focus + .search-left {
        left: 7px;
        -webkit-transform: translate(0%, -14px);
        transform: translate(0%, -14px);
      }
    }
    .search-right {
      color: #ccc;
      font-size: 16px;
      position: absolute;
      right: 4px;
      line-height: 25px;
      height: 25px;
      top: 50%;
      -webkit-transform: translateY(-12px);
      transform: translateY(-12px);
    }
  }
  input::-webkit-search-cancel-button {
    display: none;
  }
  .top-bar-btn {
    text-align: center;
    font-family: 'PingFang-SC-Regular';
    color: #6f6f6f;
    padding: 6px 0;
    font-size: 14px;
    width: 40px;
    text-align: center;
  }

  .search-row .search-input:focus + .search-left,
  .search-row .search-input.input-focus + .search-left {
    left: 7px;
    -webkit-transform: translate(0%, -14px);
    transform: translate(0%, -14px);
  }
}

#bg-box {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  opacity: 0.56;
  background-color: #414141;
  z-index: 10005;
}
</style>

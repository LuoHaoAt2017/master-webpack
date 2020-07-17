/* eslint-disable */

import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld';

const accordion = r => require.ensure([], () => r(require('../demos/accordion')), 'accordion');
const actionsheet = r => require.ensure([], () => r(require('../demos/actionsheet')), 'actionsheet');
const activityIndicator = r => require.ensure([], () => r(require('../demos/activity-indicator')), 'activityIndicator');
const areaSelector = r => require.ensure([], () => r(require('../demos/area-selector')), 'areaSelector');
const badge = r => require.ensure([], () => r(require('../demos/badge')), 'badge');
const button = r => require.ensure([], () => r(require('../demos/button')), 'button');
const card = r => require.ensure([], () => r(require('../demos/card')), 'card');
const checkbox = r => require.ensure([], () => r(require('../demos/checkbox')), 'checkbox');
const datetime = r => require.ensure([], () => r(require('../demos/datetime')), 'datetime');
const flexbox = r => require.ensure([], () => r(require('../demos/flexbox')), 'flexbox');
const grid = r => require.ensure([], () => r(require('../demos/grid')), 'grid');
const input = r => require.ensure([], () => r(require('../demos/input')), 'input');
const list = r => require.ensure([], () => r(require('../demos/list')), 'list');
const navbar = r => require.ensure([], () => r(require('../demos/navbar')), 'navbar');
const noticebar = r => require.ensure([], () => r(require('../demos/notice-bar')), 'noticebar');
const picker = r => require.ensure([], () => r(require('../demos/picker')), 'picker');
const pickerview = r => require.ensure([], () => r(require('../demos/pickerview')), 'pickerview');
const popover = r => require.ensure([], () => r(require('../demos/popover')), 'popover');
const popoverPicker = r => require.ensure([], () => r(require('../demos/popup-picker')), 'popup-picker');
const popup = r => require.ensure([], () => r(require('../demos/popup')), 'popup');
const radio = r => require.ensure([], () => r(require('../demos/radio')), 'radio');
const scroll = r => require.ensure([], () => r(require('../demos/scroll')), 'scroll');
const searchbar = r => require.ensure([], () => r(require('../demos/search-bar')), 'searchBar');
const swipeout = r => require.ensure([], () => r(require('../demos/swipeout')), 'swipeout');
const swipe = r => require.ensure([], () => r(require('../demos/swipe')), 'swipe');
const h3switch = r => require.ensure([], () => r(require('../demos/switch')), 'switch');
const tab = r => require.ensure([], () => r(require('../demos/tab')), 'tab');
const tabbar = r => require.ensure([], () => r(require('../demos/tabbar')), 'tabbar');
const textarea = r => require.ensure([], () => r(require('../demos/textarea')), 'textarea');
const toast = r => require.ensure([], () => r(require('../demos/toast')), 'toast');
const whitespace = r => require.ensure([], () => r(require('../demos/whitespace')), 'whitespace');
const wingblank = r => require.ensure([], () => r(require('../demos/wingblank')), 'wingblank');
const demo = r => require.ensure([], () => r(require('../demos/demo')), 'demo');
const tag = r => require.ensure([], () => r(require('../demos/tag')), 'tag');
const dialog = r => require.ensure([], () => r(require('../demos/dialog')), 'dialog');
const icon = r => require.ensure([], () => r(require('../demos/icon')), 'icon');
const modal = r => require.ensure([], () => r(require('../demos/modal')), 'modal');
const userselect = r => require.ensure([], () => r(require('../components/h3-organization/h3-user-select-page')), 'userselect');
const h3userdemo = r => require.ensure([], () => r(require('../demos/h3user')), 'h3userdemo');

const avatar = r => require.ensure([], () => r(require('../demos/avatar')), 'avatar');
const slider = r => require.ensure([], () => r(require('../demos/slider')), 'slider');
const imageviewer = r => require.ensure([], () => r(require('../demos/imageviewer')), 'imageviewer');

const field = r => require.ensure([], () => r(require('../demos/field')), 'field');
const photofield = r => require.ensure([], () => r(require('../demos/photofield')), 'photofield');
const filefield = r => require.ensure([], () => r(require('../demos/filefield')), 'filefield');


const property =  r => require.ensure([], () => r(require('../demos/property')), 'property');
const association =  r => require.ensure([], () => r(require('../demos/association')), 'association');
const sortlist =  r => require.ensure([], () => r(require('../demos/sortlist')), 'sortlist');
const calendar =  r => require.ensure([], () => r(require('../demos/calendar')), 'calendar');

const title =  r => require.ensure([], () => r(require('../demos/title')), 'title');
const cardNew =  r => require.ensure([], () => r(require('../demos/card-new')), 'cardNew');
const buttonGroup =  r => require.ensure([], () => r(require('../demos/simple-button-group')), 'buttonGroup');
const toolTip =  r => require.ensure([], () => r(require('../demos/tool-tip')), 'toolTip');
const qrcode =  r => require.ensure([], () => r(require('../demos/qrcode')), 'qrcode');
const signaturePad =  r => require.ensure([], () => r(require('../demos/signature')), 'signaturePad');
const testDataList =  r => require.ensure([], () => r(require('../businessdemos/data-list/index')), 'testDataList');
const dataListFrist = r => require.ensure([], () => r(require('../businessdemos/data-list/portrait-scroll-checkbox.vue')), 'dataListFrist');
const dataListSecond = r => require.ensure([], () => r(require('../businessdemos/data-list/without-portrait.vue')), 'dataListSecond');
const dataListSingleCheck = r => require.ensure([], () => r(require('../businessdemos/data-list/demo-single-check.vue')), 'dataListSingleCheck');
const cardToDoListDemo = r => require.ensure([], () => r(require('../widgets/h3-card-todo-list/demo.vue')), 'cardToDoListDemo');
const cardToDoDemo = r => require.ensure([], () => r(require('../widgets/h3-card-todo/index.vue')), 'cardToDoDemo');
const filterConditionDemo = r => require.ensure([], () => r(require('../widgets/h3-filter/h3-filter-condition-demo.vue')), 'filterConditionDemo');
// 表单详情页
const formInfoIndex = r => require.ensure([], () => r(require('../businessdemos/data-detail/demo.vue')), 'formInfoIndex');
const formComment = r => require.ensure([], () => r(require('../businessdemos/data-detail/demo-comment-list.vue')), 'formComment');
const dataShare = r => require.ensure([], () => r(require('../businessdemos/data-share/index.vue')), 'dataShare');
const remarkTest = r => require.ensure([], () => r(require('../businessdemos/demo-tab/remark.vue')), 'remarkTest');
const signature = r => require.ensure([], () => r(require('../businessdemos/signature/signature.vue')), 'signature');
const signatureTest = r => require.ensure([], () => r(require('../businessdemos/signature/signature-test.vue')), 'signatureTest');
const remarkSignature = r => require.ensure([], () => r(require('../businessdemos/signature/remark-signature.vue')), 'remarkSignature');
const remarkSignatureList = r => require.ensure([], () => r(require('../businessdemos/signature/remark-signature-list.vue')), 'remarkSignatureList');
const personalTest = r => require.ensure([], () => r(require('../businessdemos/demo-tab/personal-test.vue')), 'personalTest');
const sheetHomeTest = r => require.ensure([], () => r(require('../businessdemos/demo-tab/sheet-home-test.vue')), 'sheetHomeTest');
const testTimelineSticky = r => require.ensure([], () => r(require('../widgets/h3-time-line/h3-timeline-demo-sticky.vue')), 'testTimelineSticky');
const testTimelineStatic = r => require.ensure([], () => r(require('../widgets/h3-time-line/h3-timeline-demo.vue')), 'testTimelineStatic');

// 子表部分
const viewChildrenForm = r => require.ensure([], () => r(require('../businessdemos/children-form/view-children-form.vue')), 'viewChildrenForm');
const editChildrenForm = r => require.ensure([], () => r(require('../businessdemos/children-form/edit-children-form.vue')), 'editChildrenForm');
const childrenFormtab = r => require.ensure([], () => r(require('../businessdemos/children-form/children-form-tab.vue')), 'childrenFormtab');

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld,
    },
    {
      path: '/accordion',
      name: 'accordion',
      component: accordion,
    },
    {
      path: '/actionsheet',
      name: 'actionsheet',
      component: actionsheet,
    },
    {
      path: '/activityIndicator',
      name: 'activityIndicator',
      component: activityIndicator,
    },
    {
      path: '/areaSelector',
      name: 'areaSelector',
      component: areaSelector,
    },
    {
      path: '/badge',
      name: 'badge',
      component: badge,
    },
    {
      path: '/button',
      name: 'button',
      component: button,
    },
    {
      path: '/card',
      name: 'card',
      component: card,
    },
    {
      path: '/checkbox',
      name: 'checkbox',
      component: checkbox,
    },
    {
      path: '/datetime',
      name: 'datetime',
      component: datetime,
    },
    {
      path: '/flexbox',
      name: 'flexbox',
      component: flexbox,
    },
    {
      path: '/grid',
      name: 'grid',
      component: grid,
    },
    {
      path: '/input',
      name: 'input',
      component: input,
    },
    {
      path: '/list',
      name: 'list',
      component: list,
    },
    {
      path: '/navbar',
      name: 'navbar',
      component: navbar,
    },
    {
      path: '/noticebar',
      name: 'noticebar',
      component: noticebar,
    },
    {
      path: '/picker',
      name: 'picker',
      component: picker,
    },
    {
      path: '/popover',
      name: 'popover',
      component: popover,
    },
    {
      path: '/pickerview',
      name: 'pickerview',
      component: pickerview,
    },
    {
      path: '/popup',
      name: 'popup',
      component: popup,
    },
    {
      path: '/radio',
      name: 'radio',
      component: radio,
    },
    {
      path: '/scroll',
      name: 'scroll',
      component: scroll,
    },
    {
      path: '/searchbar',
      name: 'searchbar',
      component: searchbar,
    },
    {
      path: '/swipeout',
      name: 'swipeout',
      component: swipeout,
    },
    {
      path: '/swipe',
      name: 'swipe',
      component: swipe,
    },
    {
      path: '/h3switch',
      name: 'h3switch',
      component: h3switch,
    },
    {
      path: '/tab',
      name: 'tab',
      component: tab,
    },
    {
      path: '/tabbar',
      name: 'tabbar',
      component: tabbar,
      children: [
        {
          path: '/demo',
          name: 'demo',
          component: demo,
        },
      ],
    },
    {
      path: '/textarea',
      name: 'textarea',
      component: textarea,
    },
    {
      path: '/toast',
      name: 'toast',
      component: toast,
    },
    {
      path: '/whitespace',
      name: 'whitespace',
      component: whitespace,
    },
    {
      path: '/wingblank',
      name: 'wingblank',
      component: wingblank,
    },
    {
      path: '/tag',
      name: 'tag',
      component: tag,
    },
    {
      path: '/dialog',
      name: 'dialog',
      component: dialog,
    },
    {
      path: '/icon',
      name: 'icon',
      component: icon,
    },
    {
      path: '/modal',
      name: 'modal',
      component: modal,
    },
    {
      path: '/userselect',
      name: 'userselect',
      component: userselect,
    },
    {
      path: '/h3userdemo',
      name: 'h3userdemo',
      component: h3userdemo,
    },
    {
      path: '/avatar',
      name: 'avatar',
      component: avatar,
    },
    {
      path: '/slider',
      name: 'slider',
      component: slider,
    },
    {
      path: '/imageviewer',
      name: 'imageviewer',
      component: imageviewer,
    },
    {
      path: '/field',
      name: 'field',
      component: field,
    },
    {
      path: '/userselect',
      name: 'userselect',
      component: userselect,
    },
    {
      path: '/h3userdemo',
      name: 'h3userdemo',
      component: h3userdemo,
    },
    {
      path: '/photofield',
      name: 'photofield',
      component: photofield,
    },
    {
      path: '/filefield',
      name: 'filefield',
      component: filefield,
    },
    {
      path: '/property',
      name: 'property',
      component: property,
    },
    {
      path: '/association',
      name: 'association',
      component: association,
    },
    {
      path: '/sortlist',
      name: 'sortlist',
      component: sortlist,
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: calendar,
    },
    {
      path: '/title',
      name: 'title',
      component: title,
    },
    {
      path: '/cardNew',
      name: 'cardNew',
      component: cardNew,
    },
    {
      path: '/buttonGroup',
      name: 'buttonGroup',
      component: buttonGroup,
    },
    {
      path: '/toolTip',
      name: 'toolTip',
      component: toolTip,
    },
    {
      path: '/qrcode',
      name: 'qrcode',
      component: qrcode,
    },
    {
      path: '/signaturePad',
      name: 'signaturePad',
      component: signaturePad,
    },
    {
      path: '/testDataList',
      name: 'testDataList',
      component: testDataList,
    },
    {
      path: '/dataListFrist',
      name: 'dataListFrist',
      component: dataListFrist,
    },
    {
      path: '/dataListSecond',
      name: 'dataListSecond',
      component: dataListSecond,
    },
    {
      path: '/dataListSingleCheck',
      name: 'dataListSingleCheck',
      component: dataListSingleCheck,
    },
    {
      path: '/formInfoIndex',
      name: 'formInfoIndex',
      component: formInfoIndex,
    },
    {
      path: '/formComment',
      name: 'formComment',
      component: formComment,
    },
    {
      path: '/dataShare',
      name: 'dataShare',
      component: dataShare,
    },
    {
      path: '/testTimelineSticky',
      name: 'testTimelineSticky',
      component: testTimelineSticky,
    },
    {
      path: '/testTimelineStatic',
      name: 'testTimelineStatic',
      component: testTimelineStatic,
    },
    {
      path: '/remarkTest',
      name: 'remarkTest',
      component: remarkTest,
    },
    {
      path: '/personalTest',
      name: 'personalTest',
      component: personalTest,
    },
    {
      path: '/sheetHomeTest',
      name: 'sheetHomeTest',
      component: sheetHomeTest,
    },
    {
      path: '/signature',
      name: 'signature',
      component: signature,
    },
    {
      path: '/signatureTest',
      name: 'signatureTest',
      component: signatureTest,
    },
    {
      path: '/remarkSignature',
      name: 'remarkSignature',
      component: remarkSignature,
    },
    {
      path: '/remarkSignatureList',
      name: 'remarkSignatureList',
      component: remarkSignatureList,
    },
    {
      path: '/viewChildrenForm',
      name: 'viewChildrenForm',
      component: viewChildrenForm,
    },
    {
      path: '/editChildrenForm',
      name: 'editChildrenForm',
      component: editChildrenForm,
    },
    {
      path: '/childrenFormtab',
      name: 'childrenFormtab',
      component: childrenFormtab,
    },
    {
      path: '/cardToDoListDemo',
      name: 'cardToDoListDemo',
      component: cardToDoListDemo,
    },
    {
      path: '/cardToDoDemo',
      name: 'cardToDoDemo',
      component: cardToDoDemo,
    },
    {
      path: '/filterConditionDemo',
      name: 'filterConditionDemo',
      component: filterConditionDemo,
    },
  ],
});

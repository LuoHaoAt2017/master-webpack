<template>
  <div>
    <h3-card-to-do-list 
    title="任务标题/消息描述消息消息描述消息消息描述消息消息描述消息消息描述消息" 
    dataTitle="数据标题"
    progress ="经理审批"
    :waitedDay="23"
    :waitedHour ="23"
    :waitedMinute ="23"
    :currentParticipant ="'刘瑞'"
    :arriveTime ="'2015.09.11 23:23'"
    :name="'发起人'"
    :objectId ="'item.WorkItemID'"
    :request="true"
    requestResult ="approving"
    requestResultTime ="2010.10.10 10:10"
  ></h3-card-to-do-list>
  <h3-card-to-do-list 
    title="任务标题/消息描述消息消息描述消息消息描述消息消息描述消息消息描述消息" 
    progress ="经理审批"
    :waitedDay="23"
    :waitedHour ="23"
    :waitedMinute ="23"
    :currentParticipant ="'刘瑞'"
    :arriveTime ="'2015.09.11 23:23'"
    :name="'发起人'"
    :objectId ="'item.WorkItemID'"
    :request="true"
    requestResult ="approving"
    requestResultTime ="2010.10.10 10:10"
  ></h3-card-to-do-list>
  <h3-card-to-do-list 
    title="任务标题/消息描述消息消息描述消息消息描述消息消息描述消息消息描述消息" 
    progress ="经理审批"
    :waitedDay="23"
    :waitedHour ="23"
    :waitedMinute ="23"
    :currentParticipant ="'刘瑞'"
    :arriveTime ="'2015.09.11 23:23'"
    :name="'发起人'"
    :objectId ="'item.WorkItemID'"
    :request="true"
    requestResult ="executed"
    requestResultTime ="2010.10.10 10:10"
  ></h3-card-to-do-list>
  </div>
</template>
<script>
import H3CardToDoList from './index';

export default {
  name: 'h3-card-to-do-demo',
  components: {
    H3CardToDoList,
  },
  props: {
    photo: {
      type: String,
    },
    name: String,
    title: String,
    dataTitle: String,
    progress: String,
    currentParticipant: String,
    waitedDay: [String, Number],
    waitedHour: [String, Number],
    waitedMinute: [String, Number],
    arriveTime: String,
    allowedTime: String,
    finishTime: String,
    deadlineDay: [String, Number],
    deadlineHour: Number,
    deadlineMinute: Number,
    reviewResult: String,
    highLightText: String,
    handle: {
      type: Boolean,
      default: false,
    },
    approve: {
      type: Boolean,
      default: false,
    },
    isEditing: {
      type: Boolean,
      default: false,
    },
    selected: {
      type: Boolean,
      default: false,
    },
    objectId: {
      type: String,
      required: true,
    },
    chaosong: {
      type: Boolean,
      default: false,
    },
    chaosongState: {
      type: String,
    },
    request: {
      type: Boolean,
      default: false,
    },
    requestResult: {
      type: String,
    },
    requestResultTime: {
      type: String,
    },
    toDo: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    toggleSelected() {
      if (this.chaosong && this.isEditing) {
        this.$emit('toggleSelected', this.objectId);
      } else {
        this.$emit('openSheet');
      }
    },
    getDataTitleName (dataTitle) {
      if (dataTitle) {
        return dataTitle.replace(this.highLightText, `<span class='h3-card-grid-highlight'>${this.highLightText}</span>`);
      }
      return dataTitle;
    },
    onClickUrgeButton () {
      this.$emit('urge');
    },
  },
};
</script>
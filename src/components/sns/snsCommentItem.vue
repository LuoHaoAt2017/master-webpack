<template>
    <div class="sns-comment-item">
        <div class="item-sns-comment__title">
            <div class="title-avator">
                <span v-if="!comment.ProfilePhotoUrl" class="title-avator__name">{{comment.Name.substr(comment.Name.length-2,2)}}</span>
                <img v-if="comment.ProfilePhotoUrl" :src="comment.ProfilePhotoUrl" alt="头像">
            </div>
            <div class="title-content">
                <div class="title-name dp-font30">{{comment.Name}}</div>
                <div class="title-time dp-font24">{{comment.FormatCreatedTime}}</div>
            </div>
        </div>
        <div class="textarea-view-wraper dp-font30"
            :class="viewWrapperCls" 
            ref="readonlytextarea">
            <div v-html="showValue"
                :class="viewTextCls"
                class="textarea-view-text"
                ref="inputTextareaText">
            </div>
        </div>
        <div
            v-if="showViewOpreation"
            class="textarea-view-operate-warpper"
            @click="toogleViewText">
            <div
            class="textarea-view-operate dp-font24"
            v-if="!isMore && showViewOpreation"
            >收起<i class="icon aufont icon-base-up"></i></div>
            <div
            class="textarea-view-operate dp-font24"
            v-if="isMore && showViewOpreation"
            >展开<i class="icon aufont icon-base-down dp-font16"></i></div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'snsCommentItem',
    props: {
        value: {
            type: String,
            default: '',
        },
        userName: {
            type: String,
            default: '',
        },
        comment: Object,
    },
    data() {
        return {
            viewWrapperCls: '',
            isMore: false,
            showViewOpreation: false,
        };
    },
    mounted() {
        if (this.$refs.readonlytextarea) {
            const parentHeight = this.$refs.readonlytextarea.offsetHeight;
            const height = this.$refs.inputTextareaText.offsetHeight;
            if (height > parentHeight) {
                this.showViewOpreation = true;
                this.isMore = true;
            }
        }
    },
    methods:{
        toogleViewText() {
            this.isMore = !this.isMore;
            this.viewWrapperCls = 'input-view-wrapper-operating';
        },
    },
    computed: {
        viewTextCls() {
            if (this.isMore) {
                return 'textarea-view-text-overflow';
            }
            return '';
        },
        showValue() {
            return `<span class="comment-name">回复：</span>${this.value}`;
        }
    }
}
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.sns-comment-item {
    padding-top: 5px;
    background-color: #FAFAFA;
    .px2rem(padding-left, 26);
    .px2rem(padding-right, 26);
    border-bottom: 1px solid #F5F7F9;
    .item-sns-comment__title {
        display: flex;
        .px2rem(margin-bottom, 26);
        .title-avator {
            .px2rem(margin-right, 26);
            .px2rem(width, 72);
            .px2rem(height, 72);
            flex-shrink: 0;
            border-radius: 50%;
            overflow: hidden;
            img, .title-avator__name {
                // .px2rem(width, 72);
                // .px2rem(height, 72);
                width: 100%;
                height: 100%;
                .px2rem(line-height, 72);
                // border-radius: 50%;
            }
            .title-avator__name {
                text-align: center;
                display: inline-block;
                background-color: #38adff;
                color: white;
            }
        }
        .title-time {
            color: #CCCCCC;
        }
    }
    .textarea-view-wraper {
        .px2rem(line-height, 50);
        // line-height: 25px;
        height: auto;
        .px2rem(max-height, 200);
        // max-height: 100px;
        word-break: break-all;
        .textarea-view-text {
            // .px2rem(line-height, 25);
        }
        .textarea-view-text-overflow {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 4;
            overflow: hidden;
        }
    }
    .textarea-view-operate-warpper {
        .px2rem(line-height, 25);
        .px2rem(margin-top, 28);
        // font-size: 15px;
        color: #1890ff;
    }
    .textarea-view-operate {
        float:right;
        .px2rem(margin-top,  -20);
    }
    .input-view-wrapper-operating{
        max-height: none;
    }
}
</style>



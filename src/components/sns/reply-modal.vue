<template>
    <div class="reply-modal" @click="closeModal">
        <div class="reply__content-wrap">
            <textarea
                class="dp-font30"
                id="replayModal"
                rows="4"
                maxlength="2000"
                ref="snsReplyModal"
                :placeholder="placeholder"
                v-model="text"
                @click="clickTextarea"
                ></textarea>
            <div class="reply__footer">
                <div class="reply__counter dp-font28">{{text.length}}/2000</div>
                <button class="reply__button dp-font26" @click="confirm">确定</button>
            </div>
        </div>
    </div>
</template>
<script>
import { addComment } from '../../service/get-data';
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { isiOS } from '../../config/common';

export default {
    name: 'replyModal',
    props: ['schemacode', 'bizObjectId', 'replyItem'],
    data() {
        return {
            placeholder: '回复',
            text: '',
            isReplying: false
        };
    },
    mounted() {
        this.placeholder = `回复${this.replyItem.Name}`;
        this.$refs.snsReplyModal.focus();
        window.scrollTo(0, 10000);
    },
    destroyed(){
        console.log('destroyed')
    },
    methods:{
        autofocus(){
            this.$refs.snsReplyModal.focus(); 
        },
        autoblur(){
            this.$refs.snsReplyModal.blur();
        },
        clickTextarea() {
            this.$refs.snsReplyModal.focus();
            this.$emit('input');
        },
        confirm() {
            if (!this.text) {
                H3PluginDeveloper.IShowWarn('提示', '请输入内容');
                return;
            }
            if (this.isReplying) return;
            this.isReplying = true;
            this.addComments();
        },
        closeModal(e) {
            if (e.target.className === 'reply-modal') {
                this.$emit('close');
            }
        },
        escape (value) {
            value = value.replace(/&/g,"&amp;");
            value = value.replace(/</g,"&lt;");
            value = value.replace(/>/g,"&gt;");
            value = value.replace(/ /g,"&nbsp;");
            value = value.replace(/"/g,'&quot;');
            return value
        },
        async addComments() {
            // this.text = this.text.replace(/"/g, '\\"');
            const result = await addComment(this.replyItem.ObjectId, this.escape(this.text));
            if (result.Successful) {
                this.isReplying = false;
                H3PluginDeveloper.IShowSuccess('提示', '回复成功');
                this.$emit('confirm');
            }
        }
    },
}
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.reply-modal {
    position: absolute;
    //position: relative;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.6);
    width: 100%;
    height: 100%;
    z-index: 99;
    .reply__content-wrap {
        background-color: white;
        .px2rem(height, 350);
        //.px2rem(margin-top, 451);
        border-radius:10px 10px 0px 0px;
        border:1px solid rgba(151,151,151,1);
        .px2rem(padding-top, 23);
        .px2rem(padding-right, 20);
        .px2rem(padding-left, 20);
        // opacity: 0;
        // animation: slide 0.3s linear 0.1s 1 forwards;
        // position: fixed;
        width: 100%;
        z-index: 999;
        box-sizing: border-box;
        // left: 0;
        // bottom: 0;
        textarea {
            width: 100%;
            border-radius:10px;
            border:1px solid #E2E2E2;
            .px2rem(padding-top, 18);
            .px2rem(padding-right, 18);
            .px2rem(padding-bottom, 18);
            .px2rem(padding-left, 18);
            box-sizing: border-box;
        }
        .reply__footer {
            display: flex;
            align-items: center;
            justify-content: flex-end;
            .px2rem(margin-top, 16);
        }
        .reply__counter {
            color: #999999;
            .px2rem(margin-right, 14);
        }
        .reply__button {
            .px2rem(width, 112);
            .px2rem(height, 60);
            background-color: #1890FF;
            color: white;
            .px2rem(border-radius, 10);
            border: none;
        }
    }
}
@keyframes slide {
  from {
    transform: translate3d(0, 100%, 0);
    opacity: 0;
  }

  to {
    transform: translate3d(0, 0, 0);
    opacity: 1;
  }
}
</style>



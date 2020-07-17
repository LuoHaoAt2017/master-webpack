<template>
    <div class="transfer-modal">
        <div class="transfer__content-wrap">
            <div class="transfer__header">
                <div class="header__name">
                    <span class="header__title dp-font30">转交给：</span>
                    <span class="dep__name dp-font30">{{user.source.DepartmentName || user.source.ParentName}}-</span>
                    <span class="user__name dp-font30">{{user.name}}</span>
                </div>
                <button class="cancel__button dp-font30" @click="cancel">取消</button>
            </div>
            <textarea
                ref="transferModal"
                class="dp-font30"
                rows="3"
                maxlength="2000"
                autofocus
                :placeholder="placeholder"
                v-model="comments"
                @click="clickTextarea"
            ></textarea>
            <button class="transfer__button dp-font26" @click="confirm">确定</button>
        </div>
    </div>
</template>
<script>
import H3PluginDeveloper from '../../lib/h3-plugins-developer';
import { isiOS } from '../../config/common';

export default {
    name: 'transferModal',
    props: ['user'],
    data() {
        return {
            placeholder: '输入你的转交意见',
            comments: null,
        };
    },
    mounted() {
        this.$refs.transferModal.focus();
    },
    methods:{
        clickTextarea() {
            this.$refs.transferModal.focus();
            this.$emit('input');
        },
        confirm() {
            // if (!this.comments) {
            //     H3PluginDeveloper.IShowWarn('提示', '请输入内容');
            //     return;
            // }
            this.$emit('confirmForward', this.comments);
        },
        cancel() {
            this.$emit('cancel');
        }
    },
}
</script>
<style lang="less">
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}

.transfer-modal {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0,0,0,.6);
    width: 100%;
    height: 100%;
    z-index: 200;

    .transfer__content-wrap {
        background-color: white;
        .px2rem(height, 350);
        .px2rem(margin-top, 451);
        border-radius:10px 10px 0px 0px;
        border:1px solid rgba(151,151,151,1);
        .px2rem(padding-top, 23);
        .px2rem(padding-right, 20);
        .px2rem(padding-left, 20);
        // opacity: 0;
        // animation: slide 0.3s linear 0.1s 1 forwards;
        position: absolute;
        width: 100%;
        box-sizing: border-box;
        bottom: 0;
        .transfer__header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            .px2rem(padding-right, 12);
            .px2rem(padding-left, 12);
            .px2rem(margin-bottom, 30);
            .header__name {
                .px2rem(max-width, 580);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .header__title , .header__name {
                color: #333333;
            }
            .header__title {
                font-weight: bold;
            }
            .cancel__button {
                color: #107FF0;
                background-color: transparent;
                margin: 0;
                padding: 0;
                border: none;
                outline: none;
            }
        }
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
        .transfer__button {
            .px2rem(width, 112);
            .px2rem(height, 60);
            background-color: #1890FF;
            color: white;
            .px2rem(border-radius, 10);
            border: none;
            float: right;
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



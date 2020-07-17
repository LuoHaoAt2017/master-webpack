<template>
    <div class="container">
        <div class="title">
            <p class="title-text" v-if="target.title.type === 'text'">
                {{target.title.value}}
            </p>
            <img class="title-icon" v-else :src="target.title.value" alt="title">
        </div>
        <div class="words">
            <slot></slot>
        </div>
        <div class="graph">
            <img :src="target.graph.src" :alt="target.graph.alt">
        </div>
    </div>
</template>

<script>
export default {
    name: 'WelcomeToH3',
    props: ['target', 'index']
}
</script>

<style lang="less" scoped>
@import "../../styles/common.less";
@baseFontSize: 75;
.px2rem(@name,@px) {
    @{name}: @px/@baseFontSize * 1rem;
}
.container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    width: 100%;
    height: 100%;
    .px2rem(padding-top, 135);
    background-image: url('~@/assets/img/guidance/背景.png');
    background-origin: border-box;
    background-position: center;
    background-size: 100%;
    .title {
        text-align: center;
        .title-text {
            font-family:PingFangSC-Medium,PingFang SC;
            font-weight:500;
            color:rgba(51,51,51,1);
            .px2rem(line-height, 78);
            .px2rem(font-size, 56);
        }
        .title-icon {
            display: inline-block;
            .px2rem(width, 187);
            .px2rem(height, 79);
        }
    }
    .graph {
        width: 100%;
        text-align: center;
    }
}
</style>
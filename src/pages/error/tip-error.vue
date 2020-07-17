<template>
    <div class="tip-error-show">
        <p>
            请在电脑端钉钉点击该链接。
        </p>
        
    </div>
</template>
<style lang="less" scoped>
@baseFontSize: 100;
.px2rem(@name,@px) {
  @{name}: @px/@baseFontSize * 1rem;
}
.tip-error-show{
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    margin-top: -10px;
    p{
        line-height: 20px;
        color: #999;
    }
}
</style>
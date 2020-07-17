<template>
  <div class="association">
    <l-label
      title="关联表单"
      :required="true"
    >
      <associationForm
        :defaultValue="defaultValue"
        @change="onChange"
      ></associationForm>
    </l-label>
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
import { LLabel } from '@/light-app/components';
import associationForm from './association-form.vue';

@Component({
  name: 'LAssociation',
  components: {
    LLabel,
    associationForm
  }
})
export default class LAssociation extends Vue {
  @Prop()
  list!: [];

  @Prop()
  defaultValue!: string;

  onChange(params) {
    this.$emit('click', params);
  }
}
</script>

<style lang='less' scoped>
@baseFontSize: 75;
.px2rem(@name,@px) {
  @{name}: @px / @baseFontSize * 1rem;
}

</style>

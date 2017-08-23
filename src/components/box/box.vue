<template lang="html">
  <div class="e-box">
    <div class="e-box-title">
      {{ title }}
    </div>
    <div class="e-box-body">
      <slot></slot>
    </div>
    <div class="e-box-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EBox',
  props: {
    title: {
      tyle: String,
      default: '',
      required: true
    }
  }
}
</script>

<style lang="css">
.e-box {
  padding: 10px;
  margin-bottom: 10px;
  background: #fff;
  border: 1px solid #d1dbe5;
  box-shadow: 0 2px 4px 0 rgba(0,0,0,.12), 0 0 6px 0 rgba(0,0,0,.04);
  overflow: hidden;
}
</style>

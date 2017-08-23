<template lang="html">
  <div :style="{ height: height + 'px', lineHeight: height + 'px' }" class="e-tag">
    <span class="e-tag-title">{{ title }}</span>
    <span class="e-tag-num">{{ num }}</span>
    <span class="e-tag-unit">{{ unit }}</span>
  </div>
</template>

<script>
export default {
  name: 'ETag',
  props: {
    title: {
      type: String,
      default: '',
      required: true
    },
    num: {
      type: String,
      default: ''
    },
    unit: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 40
    }
  }
}
</script>

<style lang="css">

.e-tag {
  background: #F5F5F6;
  border: 1px solid #F5F5F6;
  transition: all 0.15s, 0.15s;
  padding: 0 10px;
}
.e-tag:hover {
  background: #fff;
  border: 1px solid #20a0ff;
}
.e-tag span{
  display: inline-block;
}
.e-tag-title {
  width: 50%;
}
.e-tag-num {
  width: 10%;
}
.e-tag-unit {
  float: right;
  width: 20%;
  text-align: right;
}

</style>

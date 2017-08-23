<template lang="html">
  <section>
    <transition name="dialog-fade">
      <div class="v-dialog-wrapper" v-show="visible">
        <div class="v-dialog" :class="[sizeClass, customClass]">
          <div @click="closeDialog" class="v-dialog-close">
            <i class="el-icon-close"></i>
          </div>
          <div class="v-dialog-body">
            <slot></slot>
          </div>
          <slot name="footer"></slot>
        </div>
      </div>
    </transition>
  </section>
</template>

<script>
export default {
  name: 'EDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true
    },
    size: {
      type: String,
      default: 'small'
    },
  },
  computed: {
    sizeClass() {
      return `el-dialog--${ this.size }`;
    },
    style() {
      return this.size === 'full' ? {} : { 'top': this.top };
    }
  },
  methods: {
    closeDialog () {
      this.visible = false
      this.$emit('close', false)
    }
  }
}
</script>

<style lang="css">

.v-dialog-wrapper {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.3);
  z-index: 2000;
  overflow: auto;
}
.v-dialog {
  width: 60%;
  position: absolute;
  top: 15%;
  left: 50%;
  padding: 50px;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0,0,0,.3);
  box-sizing: border-box;
  margin-bottom: 50px;
}
.v-dialog-close {
  cursor: pointer;
  color: #bfcbd9;
  font-size: 14px;
  position: absolute;
  top: 20px;
  right: 20px;
}
</style>

<template>
  <button class="sw-button" :class="classes" v-bind="$attrs" v-on="$listeners">
    <slot />
  </button>
</template>
<script>
export default {
  name: "SwButton",
  props: {
    link: {
      type: [String, Object],
      default: null,
    },
    medium: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    classes() {
      return [{ "sw-button--md": this.medium }]
    },
  },
}
</script>

<style scoped lang="scss">
.sw-button {
  line-height: 17px;
  font-size: 14px;
  border-radius: 5px;
  padding: 6px 12px;
  border: 1px solid var(--c-accent);
  background-color: var(--c-accent);
  color: white;

  &.block {
    width: 100%;
  }

  &:disabled {
    background-color: gray;
    border-color: gray;
  }

  &.sw-button--md {
    line-height: 20px;
  }
}
</style>

<template>
  <!-- TODO: use pure button instead of SfButton -->
  <SfButton v-bind="{ ...$props, ...$attrs }" v-on="$listeners">
    <slot />
  </SfButton>
</template>
<script>
import { SfButton } from "@storefront-ui/vue";

export default {
  name: "SwButton",
  components: {
    SfButton,
  },
  props: {
    link: {
      type: [String, Object],
      default: "",
    },
  },
};
</script>

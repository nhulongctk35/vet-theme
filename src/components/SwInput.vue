<template>
  <div class="sw-input">
    <label>
      {{ label }}
      <input v-if="componentType == 'input'" v-model="internalValue" v-bind="$attrs" />
      <textarea v-else v-model="internalValue" v-bind="$attrs" />
    </label>
  </div>
</template>

<script>
import { computed } from "@vue/composition-api"
export default {
  name: "SwInput",
  inheritAttrs: false,
  props: {
    value: {
      type: [Number, String],
      required: true,
    },
    label: {
      type: String,
    },
    componentType: {
      value: String,
      default: "input",
    },
  },
  setup(props, { emit }) {
    const internalValue = computed({
      get() {
        return props.value
      },
      set(value) {
        emit("input", value)
      },
    })

    return {
      internalValue,
    }
  },
}
</script>

<style scoped lang="scss">
label {
  display: flex;
  flex-direction: column;
  font-weight: 700;
  gap: 5px;
}

input,
textarea {
  padding: 8px 12px;
  border: 1px solid var(--c-border);
  border-radius: 4px;
  line-height: 17px;
}

.sw-input {
  margin-bottom: 20px;
  font-size: 14px;
}
</style>

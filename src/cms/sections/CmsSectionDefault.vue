<template>
  <div
    class="sw-default-section"
    :style="sectionStyles"
    :class="{ 'sw-default-section--boxed': isSizingModeBoxed, ...cmsClass }"
  >
    <CmsGenericBlock v-for="cmsBlock in getBlocks" :key="cmsBlock.id" :content="cmsBlock" />
  </div>
</template>

<script>
import CmsGenericBlock from "sw-cms/CmsGenericBlock"
import { useCms } from "@shopware-pwa/composables"
import { computed } from "@vue/composition-api"

export default {
  components: { CmsGenericBlock },
  name: "CmsSectionDefault",
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { root: { $route } }) {
    const { page } = useCms()

    const category = computed(() => {
      const { category } = page.value

      return category
    })

    return {
      category,
    }
  },
  computed: {
    getBlocks() {
      return this.content.blocks || []
    },
    cmsClass() {
      return this.content?.cssClass
    },
    isSizingModeBoxed() {
      return this.content.sizingMode === "boxed"
    },
    sectionStyles() {
      const { backgroundColor, backgroundMedia, marginBottom, marginLeft, marginRight, marginTop } = this.content
      return {
        backgroundColor,
        backgroundImage: backgroundMedia ? `url(${backgroundMedia.url})` : null,
        marginBottom,
        marginLeft,
        marginRight,
        marginTop,
      }
    },
  },
}
</script>

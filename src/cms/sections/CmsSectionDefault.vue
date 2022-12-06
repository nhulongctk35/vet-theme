<template>
  <div
    class="sw-default-section"
    :style="sectionStyles"
    :class="{ 'sw-default-section--boxed': isSizingModeBoxed, ...cmsClass }"
  >
    <article class="blog" v-if="isCustomCmsSectionDefault">
      <h1 class="blog-title" v-text="category.translated.name" />
      <div class="blog-content" v-html="category.translated.description" />
    </article>

    <div v-else>
      <CmsGenericBlock v-for="cmsBlock in getBlocks" :key="cmsBlock.id" :content="cmsBlock" />
    </div>
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
    const isCustomCmsSectionDefault = computed(() => {
      const path = $route.path
      return ["/blog/", "/service"].some((item) => path.includes(item))
    })

    const category = computed(() => {
      const { category } = page.value

      return category
    })

    return {
      category,
      isCustomCmsSectionDefault,
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

<style lang="scss" scoped>
@import "@/assets/scss/variables";

::v-deep {
  h2 {
    margin: 7px 0 10px 0;
    line-height: 20px;
  }

  h4 {
    margin-top: -1px;
    margin-bottom: 0;
  }
}

.blog {
  padding: 25px 15px;
  color: #333;
}

::v-deep .blog-content h2 {
  font-size: 18px;
  margin-top: 25px;
}

.blog-title {
  margin-top: 0;
  font-size: 21px;
  padding-bottom: 15px;
  line-height: 1.42857143;
}

.blog-content {
  font-size: 14px;
  line-height: 20px;
}

.sw-default-section {
  width: 100%;
}

@include for-tablet {
  .blog {
    max-width: 50%;
    padding-right: 0;
  }
}
</style>

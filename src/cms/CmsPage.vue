<template>
  <article class="blog" v-if="isCustomCmsSectionDefault">
    <h1 class="blog-title" v-text="name" />
    <div class="blog-content" v-html="description" />
  </article>

  <div v-else>
    <CmsGenericSection :content="cmsSection" v-for="cmsSection in cmsSections" :key="cmsSection.id" />
  </div>
</template>

<script>
import CmsGenericSection from "sw-cms/CmsGenericSection"
import { computed } from "@vue/composition-api"
import { useCms } from "@shopware-pwa/composables"

export default {
  components: { CmsGenericSection },
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { root: { $route, $routing, $linkReplace } }) {
    const { page } = useCms()

    const isCustomCmsSectionDefault = computed(() => {
      const path = $route.path
      return ["/blog/", "/service/"].some((item) => path.includes(item))
    })

    return {
      isCustomCmsSectionDefault,
      name: computed(() => page.value?.category?.translated?.name),
      description: computed(() => {
        return $linkReplace(page.value?.category?.translated?.description)
      }),
    }
  },
  computed: {
    cmsSections() {
      return this.content?.sections || []
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

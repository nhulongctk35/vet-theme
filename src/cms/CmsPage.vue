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
import { useCms, useNavigation } from "@shopware-pwa/composables"
import { getCategoryUrl } from "@shopware-pwa/helpers"

export default {
  components: { CmsGenericSection },
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(_props, { root: { $linkReplace } }) {
    const { navigationElements } = useNavigation({ type: "service-navigation" })
    const { page, currentSearchPathKey } = useCms()

    const isCustomCmsSectionDefault = computed(() => {
      if (!navigationElements.value?.length) {
        return false
      }

      // Example return ["/blog/a-blog-post/", "/service/payment/"]
      const customSections = navigationElements.value
        .filter((element) => {
          return element?.level === 2 && ["blog", "service"].includes(element?.customFields?.custom_general_reference)
        })
        .map((element) => {
          return element.children?.map((child) => getCategoryUrl(child))
        })
        .flat()

      // Example return:
      // - listing page: "/service/"
      // - detail page: "/service/payment/"
      const path = "/" + currentSearchPathKey.value
      return customSections.some((item) => path.includes(item))
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

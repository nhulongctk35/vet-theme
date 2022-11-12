<template>
  <div v-if="product" id="product" itemscope itemtype="https://schema.org/Product">
    <div class="sw-product-buy-box">
      <SwProductGallery :product="product" class="sw-product-buy-box__gallery" />
      <div class="sw-product-buy-box__description">
        <SwProductDetails :product="product" />
      </div>
    </div>

    <SwProductTabs :product-id="product.id" :product="product" />
  </div>
  <CmsPage v-else :content="cmsPage" />
</template>
<script>
import { computed } from "@vue/composition-api"
import CmsPage from "sw-cms/CmsPage"

export default {
  name: "ProductPage",
  components: { CmsPage },
  props: {
    page: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props) {
    const product = computed(() => props.page.product)
    const cmsPage = computed(() => props.page.cmsPage)

    return {
      product,
      cmsPage,
    }
  },
}
</script>
<style lang="scss" scoped>
@import "@/assets/scss/variables";

#product {
  padding-top: 30px;
  min-height: calc(100vh - 100px);
  display: flex;
  flex-direction: column;
}

.sw-product-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.sw-product-buy-box {
  &__gallery {
    flex: 0 0 41%;
  }

  &__description {
    flex: 1 0 59%;
  }

  &__description {
    padding: 0 var(--spacer-sm);
  }

  @include for-tablet {
    &__gallery {
      padding: 0 7.5%;
    }
  }

  @include for-desktop {
    display: flex;

    &__description {
      margin-left: calc(var(--spacer-base) * 3);
    }
  }
}
</style>

<template>
  <div>
    <VLoader :loading="loading" v-if="loading" />
    <BrandsListing v-else-if="isBrandsListing" />
    <SwProductListing
      v-else-if="isProductsListing"
      :products="sortedProducts"
      :initialListing="content.data.listing"
      listingType="categoryListing"
    />
    <template v-else>
      <div v-for="category in categories" :key="category.id">
        <SwTopNavigation v-if="!isBrandsListing" :active-category="category" @change="fetchSubcategory" />
      </div>
    </template>
  </div>
</template>

<script>
import Vue from "vue"
import { getApplicationContext, useCms } from "@shopware-pwa/composables"
import { ref, computed } from "@vue/composition-api"
import { getCategories } from "@shopware-pwa/shopware-6-client"
import { getCategoryUrl } from "@shopware-pwa/helpers"

export default {
  name: "CmsElementProductListing",
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    const { page: cmsPage } = useCms()
    const { apiInstance: categoriesApiInstance } = getApplicationContext({
      contextName: "Categories",
    })
    const { apiInstance: apiInstance } = getApplicationContext({
      contextName: "ProductRelation",
    })

    const loading = ref(false)
    const activeCategory = ref(null)
    const categories = ref({})
    const products = ref(null)

    const sortedProducts = computed(() => {
      if (!products.value) return

      return [...products.value].sort((a, b) => {
        const parent1 = Object.keys(a)[0]
        const parent2 = Object.keys(b)[0]

        const name1 = a[parent1]?.translated?.name
        const name2 = b[parent2]?.translated?.name

        return name1.localeCompare(name2)
      })
    })

    const isBrandsListing = computed(() => {
      return (
        activeCategory.value?.level === 2 &&
        activeCategory.value?.customFields?.custom_general_reference == process.env.BRAND_ID
      ) // "1"
    })
    const isProductsListing = computed(() => {
      return activeCategory.value?.level > 2 && !!sortedProducts.value
    })

    return {
      sortedProducts,
      categories,
      cmsPage,
      activeCategory,
      categoriesApiInstance,
      isBrandsListing,
      isProductsListing,
      products,
      apiInstance,
      loading,
    }
  },

  async created() {
    const { elements } = await this.loadChildrenCategory([this.cmsPage?.category?.id], this.categoriesApiInstance)

    this.activeCategory = elements[0]

    if (!elements[0].children.length) {
      const { elements: parentCategory } = await this.loadChildrenCategory(
        [this.cmsPage?.category?.parentId],
        this.categoriesApiInstance
      )

      parentCategory[0].children.forEach((entry) => {
        if (entry.id === elements[0]?.id) {
          entry.clicked = true
        } else {
          entry.clicked = false
        }
      })

      Vue.set(this.categories, parentCategory[0].level, parentCategory[0])
    }

    Vue.set(this.categories, elements[0].level, elements[0])

    if (this.cmsPage.category.level >= 3) {
      try {
        this.loading = true
        const { data } = await this.apiInstance.invoke.post(
          `/store-api/category-relation/${this.cmsPage?.category?.id}`
        )

        this.products = data
      } catch (error) {
        console.error("@category-relation", error)
      } finally {
        this.loading = false
      }
    }
  },

  methods: {
    async fetchSubcategory(category) {
      try {
        const { elements } = await this.loadChildrenCategory([category.id], this.categoriesApiInstance)
        let categoryDetail = elements[0]

        if (categoryDetail?.children.length) {
          Vue.set(this.categories, categoryDetail.level, categoryDetail)
        } else {
          this.$router.push(this.$routing.getUrl(getCategoryUrl(category)))
        }
      } catch (error) {}
    },

    loadChildrenCategory(ids, categoriesApiInstance) {
      return getCategories(
        {
          ids,
          associations: {
            seoUrls: {},
            children: {
              sort: [
                {
                  field: "createdAt",
                  order: "asc",
                },
              ],
            },
          },
          includes: {
            category: [
              "seoUrls",
              "externalLink",
              "name",
              "id",
              "children",
              "translated",
              "type",
              "media",
              "parentId",
              "customFields",
              "level",
              "active",
            ],
            seo_url: ["pathInfo", "seoPathInfo"],
          },
        },
        categoriesApiInstance
      )
    },
  },
}
</script>
<style scoped>
.cms-product-listing {
  margin-top: 40px;
}
</style>

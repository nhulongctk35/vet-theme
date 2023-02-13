<template>
  <nav class="category-navigation" itemtype="http://schema.org/SiteNavigationElement">
    <ul class="category-list">
      <li class="category-list__item" v-for="accordion in navigation" :key="accordion.id">
        <nuxt-link
          :to="$routing.getUrl(getCategoryUrl(accordion))"
          class="category-navigation__link"
          itemprop="url"
          :title="$getTranslatedProperty(accordion, 'name')"
        >
          <img v-if="accordion.media" :src="accordion.media.url" :alt="accordion.name" width="65" height="65" />
          <span itemprop="name">{{ $getTranslatedProperty(accordion, "name") }}</span>
        </nuxt-link>
      </li>
    </ul>
    <div class="category-navigation__desc">{{ $t("main-desc") }}</div>
  </nav>
</template>

<script>
import { useSharedState, useNavigation } from "@shopware-pwa/composables"
import { computed } from "@vue/composition-api"
import { getCategoryUrl } from "@shopware-pwa/helpers"

export default {
  name: "CmsElementCategoryNavigation",
  setup() {
    const { loadNavigationElements, navigationElements } = useNavigation()

    const { preloadRef } = useSharedState()
    preloadRef(navigationElements, async () => {
      await loadNavigationElements({ depth: 1 })
    })

    const navigation = computed(() => {
      return navigationElements.value?.filter(
        (entry) => entry?.translated?.customFields?.custom_general_reference != "1"
      )
    })

    return {
      navigation,
      getCategoryUrl,
    }
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";
.category-list {
  list-style: none;
  padding-left: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 15px;

  @include for-desktop {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

.category-list__item {
  font-size: 15px;
  font-weight: 700;

  &:not(:first-child) {
    border-left: 1px solid var(--c-border);
  }

  &:nth-child(3) {
    border-left: 0;
  }

  &:nth-child(3),
  &:nth-child(4) {
    border-top: 1px solid var(--c-border);
  }

  @include for-desktop() {
    &:nth-child(3),
    &:nth-child(4) {
      border-top: none;
    }

    &:nth-child(3) {
      border-left: 1px solid var(--c-border);
    }
  }
}

.category-navigation {
  margin-bottom: 24px;
  padding-left: 15px;
  padding-right: 15px;

  &__link {
    width: 100%;
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #333;
    padding: 30px 10px;
  }

  &__desc {
    text-align: center;
    color: #388107;
    font-size: 17px;
    font-weight: 400;
  }
}
</style>

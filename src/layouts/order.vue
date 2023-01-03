<template>
  <div class="layout">
    <header class="main-header">
      <SwLogo class="main-header__logo" />
    </header>

    <div class="content-wrapper">
      <main class="container main-content">
        <nuxt />
      </main>
    </div>
  </div>
</template>

<script>
import { useDomains } from "@/logic"
import { useCurrency, useNavigation, useSessionContext, useSharedState, useUIState } from "@shopware-pwa/composables"
import { ref, defineComponent, provide, watch } from "@vue/composition-api"
import { getApplicationContext } from "@shopware-pwa/composables"

export default defineComponent({
  name: "OrderLayout",
  setup() {
    const { preloadRef } = useSharedState()
    const { currentDomainId } = useDomains()
    const { apiInstance } = getApplicationContext({ contextName: "sellerDetail" })
    const { availableCurrencies, loadAvailableCurrencies } = useCurrency()

    const { setCurrency: setSessionCurrency, currency: currentCurrency } = useSessionContext()

    const { loadNavigationElements, navigationElements } = useNavigation()
    const { loadNavigationElements: loadService, navigationElements: serviceElements } = useNavigation({
      type: "service-navigation",
    })

    preloadRef(navigationElements, () => loadNavigationElements({ depth: 1 }))
    preloadRef(serviceElements, () => loadService({ depth: 2 }))
    loadAvailableCurrencies()

    const { isOpen: checkoutCartOpen } = useUIState({
      stateName: "CART_SIDEBAR_STATE",
    })

    const isSidebarOpen = ref(false)
    const toggleSidebar = ($x, ...$rest) => {
      isSidebarOpen.value = !isSidebarOpen.value
    }

    const loading = ref(false)

    const loadSellerDetail = async (params) => {
      loading.value = true
      const { data } = await apiInstance.invoke.get(`/store-api/seller/${params.id}`)
      seller.value = data
      loading.value = false
    }

    const seller = ref({})
    const setSeller = (data) => {
      data.id && loadSellerDetail(data)
    }

    provide("isSidebarOpen", isSidebarOpen)
    provide("toggleSidebar", toggleSidebar)
    provide("seller", { setSeller, seller })

    watch(currentDomainId, () => {
      loadNavigationElements({ depth: 1 })
      loadService({ depth: 2 })
    })

    const setDefaultCurrency = () => {
      const defaultCurrency = availableCurrencies.value.find((entry) => entry.isSystemDefault)

      if (defaultCurrency && currentCurrency.value?.id !== defaultCurrency.id) {
        setSessionCurrency(defaultCurrency)
      }
    }

    watch(currentCurrency, () => {
      if (currentCurrency.value?.isSystemDefault) {
        return
      }
      setDefaultCurrency()
    })

    return {
      checkoutCartOpen,
      isSidebarOpen,
      seller,
      loading,
    }
  },
  middleware: ["pages"],
})
</script>
<style lang="scss" scoped>
.main-header {
  width: 100%;
  max-width: var(--boxed-mode-max-width);
  margin: 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  border-bottom: 1px solid var(--c-border);
  position: sticky;
  top: 0;
  z-index: var(--header-z-index);
  background-color: var(--c-white);
}
</style>

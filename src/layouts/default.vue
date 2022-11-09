<template>
  <div
    class="layout"
    :class="{ 'sidebar--left': isSidebarOpen, 'sidebar--right': checkoutCartOpen }"
  >
    <VSidebar />

    <div class="content-wrapper">
      <SwCookieBar />

      <SwHeader />

      <main class="container main-content">
        <nuxt />
      </main>

      <SwBottomNavigation />
    </div>

    <SwCart />

    <client-only>
      <SwLanguageModal />

      <VLoader :loading="loading">
        <SwSellerModal :seller="seller" />
      </VLoader>
    </client-only>
  </div>
</template>

<script>
import { useDomains } from "@/logic";
import {
  useCurrency,
  useNavigation,
  useSessionContext,
  useSharedState,
  useUIState,
} from "@shopware-pwa/composables";
import { ref, defineComponent, provide, watch } from "@vue/composition-api";
import { getApplicationContext } from "@shopware-pwa/composables";

export default defineComponent({
  name: "DefaultLayout",
  setup() {
    const { preloadRef } = useSharedState();
    const { currentDomainId } = useDomains();
    const { apiInstance } = getApplicationContext({ contextName: "sellerDetail" });
    const { availableCurrencies, loadAvailableCurrencies } = useCurrency();

    const {
      setCurrency: setSessionCurrency,
      currency: currentCurrency,
    } = useSessionContext();

    const { loadNavigationElements, navigationElements } = useNavigation();
    const {
      loadNavigationElements: loadService,
      navigationElements: serviceElements,
    } = useNavigation({
      type: "service-navigation",
    });

    preloadRef(navigationElements, () => loadNavigationElements({ depth: 1 }));
    preloadRef(serviceElements, () => loadService({ depth: 2 }));
    loadAvailableCurrencies();

    const { isOpen: checkoutCartOpen } = useUIState({
      stateName: "CART_SIDEBAR_STATE",
    });

    const isSidebarOpen = ref(false);
    const toggleSidebar = ($x, ...$rest) => {
      isSidebarOpen.value = !isSidebarOpen.value;
    };

    const loading = ref(false);

    const loadSellerDetail = async (params) => {
      loading.value = true;
      const { data } = await apiInstance.invoke.get(`/store-api/seller/${params.id}`);
      seller.value = data;
      loading.value = false;
    };

    const seller = ref({});
    const setSeller = (data) => {
      data.id && loadSellerDetail(data);
    };

    provide("isSidebarOpen", isSidebarOpen);
    provide("toggleSidebar", toggleSidebar);
    provide("seller", { setSeller, seller });

    watch(currentDomainId, () => {
      loadNavigationElements({ depth: 1 });
      loadService({ depth: 2 });
    });

    const setDefaultCurrency = () => {
      const defaultCurrency = availableCurrencies.value.find(
        (entry) => entry.isSystemDefault
      );

      if (defaultCurrency && currentCurrency.value?.id !== defaultCurrency.id) {
        setSessionCurrency(defaultCurrency);
      }
    };

    watch(currentCurrency, () => {
      if (currentCurrency.value?.isSystemDefault) {
        return;
      }
      setDefaultCurrency();
    });

    return {
      checkoutCartOpen,
      isSidebarOpen,
      seller,
      loading,
    };
  },
  middleware: ["pages"],
});
</script>

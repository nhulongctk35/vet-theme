<template>
  <div class="layout">
    <header class="main-header">
      <SwLogo class="main-header__logo" />
    </header>

    <main>
      <nuxt />
    </main>

    <SwTermsOfUseModal
      :is-open="isTermsOfUseModalOpen"
      @close="switchTermsOfUseModalState(false)"
    />
  </div>
</template>

<script>
import { useUIState, useSalutations } from "@shopware-pwa/composables";
import { computed, provide, watch } from "@vue/composition-api";
import SwTermsOfUseModal from "@/components/modals/SwTermsOfUseModal";
import SwLogo from "@/components/SwLogo.vue";
import { useSessionContext, useCurrency } from "@shopware-pwa/composables";

export default {
  components: {
    SwTermsOfUseModal,
    SwLogo,
  },

  setup() {
    const { getSalutations } = useSalutations();
    const { availableCurrencies, loadAvailableCurrencies } = useCurrency();
    const { setCurrency: setSessionCurrency } = useSessionContext();

    const getDefaultSalutationId = computed(
      () =>
        getSalutations.value?.find(
          (salutation) => salutation.salutationKey === "not_specified"
        )?.id
    );

    provide("getDefaultSalutationId", getDefaultSalutationId);

    const {
      isOpen: isTermsOfUseModalOpen,
      switchState: switchTermsOfUseModalState,
    } = useUIState({ stateName: "TERMS_OF_USE_MODAL_STATE" });

    watch(
      availableCurrencies,
      () => {
        if (!availableCurrencies.value.length) {
          return;
        }
        const defaultCurrency = availableCurrencies.value.find(
          (entry) => entry.isSystemDefault
        );
        setSessionCurrency(defaultCurrency);
      },
      { immediate: true }
    );

    loadAvailableCurrencies();

    return {
      isTermsOfUseModalOpen,
      switchTermsOfUseModalState,
    };
  },

  middleware: ["pages"],
};
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

.layout {
  box-sizing: border-box;
  height: 100%;
}
</style>

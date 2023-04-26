import { computed } from "@vue/composition-api"
import { useCurrency, useSharedState } from "@shopware-pwa/composables"
import { formatPrice } from "@/helpers/formatPrice"

export function useSecondPrice() {
  const { sharedRef } = useSharedState()
  const { availableCurrencies } = useCurrency()
  const currentDomain = sharedRef("sw-current-domain")
  const secondCurrency = availableCurrencies.value.find((entry) => entry.id === currentDomain.value?.currencyId)

  const show = computed(() => {
    return ["da-DK"].includes(currentDomain.value?.languageLocaleCode)
  })

  const secondPrice = (price) => formatPrice(secondCurrency?.factor * price, { symbol: secondCurrency?.symbol })

  return {
    show,
    secondCurrency,
    secondPrice,
  }
}

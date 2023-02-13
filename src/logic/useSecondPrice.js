import { computed } from "@vue/composition-api"
import { useCurrency } from "@shopware-pwa/composables"
import { getApplicationContext } from "@shopware-pwa/composables"
import { formatPrice } from "@/helpers/formatPrice"

export function useSecondPrice() {
  const { availableCurrencies } = useCurrency()
  const { route } = getApplicationContext({ contextName: "useSecondPrice" })

  const secondCurrency = availableCurrencies.value.find((entry) => entry.id === route?.meta.currencyId)

  const show = computed(() => {
    return ["da-DK"].includes(route?.meta?.languageLocaleCode)
  })

  const secondPrice = (price) => formatPrice(secondCurrency?.factor * price, { symbol: secondCurrency?.symbol })

  return {
    show,
    secondCurrency,
    secondPrice,
  }
}

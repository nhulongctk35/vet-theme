export const PAGE_CHECKOUT = "/checkout/"
export const PAGE_ACCOUNT = "/account/"
export const PAGE_LOGIN = "/login/"
export const PAGE_SEARCH = "/search/"
export const PAGE_ORDER_SUCCESS = "order-success/"
export const PAGE_ORDER_PAYMENT_FAILURE = "payment-failure/"
/**
 *
 * @param {vue-router Route} route
 * @returns
 */
export const isStaticPage = (route) => !route?.name?.startsWith("all")

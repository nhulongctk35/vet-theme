<template>
  <div class="error-page">
    <h1 class="error-page__heading">
      {{ code }}
    </h1>
    <p>{{ $t(message) }}</p>
    <div class="error-page__actions">
      <SwButton
        class="error-page__actions-button"
        @click="$router.push($routing.getUrl('/'))"
      >
        {{ $t("Return to homepage") }}
      </SwButton>
    </div>
  </div>
</template>
<script>
const customMessageDictionary = {
  404: "We can't find what you are looking for. Are you lost?",
  408: "The API is taking to long to respond",
  500: "Oops, something went terribly wrong :(",
  502: "Server couldn't complete your request. Please try again in few seconds.",
  503: "Server is really busy right now",
};

const getMessageForCode = (code) => customMessageDictionary[code];

export default {
  name: "ErrorPage",
  props: {
    error: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {};
  },
  computed: {
    code() {
      return this.error?.statusCode || 404;
    },
    message() {
      return getMessageForCode(this.code) || this.error?.message;
    },
  },
};
</script>
<style lang="scss" scoped>
.error-page {
  text-align: center;
  padding: 0 var(--spacer-sm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: calc(100vh - 100px);

  &__actions {
    margin: var(--spacer-sm) 0 0 0;
  }

  &__actions-button {
    margin: 0 auto;
  }
}
</style>

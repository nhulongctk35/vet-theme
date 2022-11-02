<template>
  <component :content="content" :is="getComponent" />
</template>

<script>
export default {
  name: "CmsElementForm",

  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      map: {
        newsletter: () => import("@/cms/elements/CmsElementNewsletterForm"),
        contact: () => import("./CmsElementContactForm"),
      },
    };
  },

  computed: {
    getComponent() {
      return this.map[this.content.config.type.value];
    },
  },
};
</script>

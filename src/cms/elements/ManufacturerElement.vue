<template>
  <div class="wrapper">
    <keep-alive>
      <div
        ref="mySwiper1"
        v-swiper:mySwiper="swiperOption"
        class="brands-slider"
      >
        <div class="swiper-wrapper">
          <div
            v-for="(chunk, index) in images"
            :key="index"
            class="brands-slider__slide swiper-slide"
          >
            <a
              v-for="(item, imgIndex) in chunk"
              :key="imgIndex"
              class="brands-slider-item"
              :href="'/Result-list-brand/?p=1&manufacturer=' + item.id"
            >
              <img
                v-if="item.media"
                :src="item.media.url"
                :alt="item.translated.name"
              />
              <template v-else>
                {{ item.translated.name }}
              </template>
            </a>
          </div>
        </div>
        <div
          class="
            brands-slider__pagination
            swiper-pagination swiper-pagination-bullets
          "
        />
      </div>
    </keep-alive>
  </div>
</template>

<script>
import "swiper/dist/css/swiper.css"

export default {
  name: "ManufacturerElement",
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
  },

  data() {
    return {
      images: [],
      swiperOption: {
        slidesPerView: 1,
        spaceBetween: 28,
        longSwipesRatio: 0.6,
        centeredSlides: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
      },
    }
  },
  computed: {
    selectedCategory() {
      return this.content.translated.config.selectedCategory
    },

    selectedCategoryPath() {
      return "/navigation/" + this.selectedCategory.value
    },
  },
  mounted() {
    const windowWidth = window.innerWidth
    const gridHeight = window.innerHeight - 190
    let gridItemWidth = null
    let gridItemHeight = null
    // Calculation of the size of the chunk for the grid.
    // gridItemWidth directly depends on the style of grid-template-columns and media queries
    if (windowWidth < 576) {
      gridItemWidth = 4
      gridItemHeight = Math.round(gridHeight / 80)
    } else if (windowWidth < 768) {
      gridItemWidth = 6
      gridItemHeight = Math.round(gridHeight / 81)
    } else if (windowWidth < 992) {
      gridItemWidth = 8
      gridItemHeight = Math.round(gridHeight / 94)
    } else {
      gridItemWidth = 8
      gridItemHeight = Math.round(gridHeight / 96)
    }

    let images = []
    let elements = this.content.data.BilobaBlockManufacturerList.elements

    for (let key in elements) {
      images.push(elements[key])
    }

    this.images = this.chunk(images, gridItemWidth * gridItemHeight)
  },
  methods: {
    chunk(arr, len) {
      const chunks = []
      let i = 0
      const n = arr.length
      while (i < n) {
        chunks.push(arr.slice(i, (i += len)))
      }
      return chunks
    },
  },
}
</script>

<style lang="scss" scoped>
@import "@/assets/scss/variables";

.wrapper {
  padding-left: 48px;
  padding-right: 48px;
}
.brands-slider {
  &__slide {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fit, 71px);
    justify-content: center;
    justify-items: center;

    @include for-tablet {
      grid-template-columns: repeat(8, minmax(70px, 1fr));
      gap: 18px;
    }
  }

  &__pagination {
    position: static !important;
    margin: 30px auto 10px auto !important;
  }
}

.swiper-pagination-bullet {
  margin: 0 4px;
}

.brands-slider-item {
  position: relative;
  width: 68.5px;
  height: 68.5px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #ccc;
}
</style>
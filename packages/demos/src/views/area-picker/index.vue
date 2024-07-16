<template>
  <div class="area-picker-demos demos-page">
    <card-item
      v-for="item in cardList"
      :id="item.id"
      :key="item.id"
      :cover="item.cover"
      :title="item.title"
      :gui="item.gui"
      @to-gui="handleToGui"
      @to-code="handleToCode"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CardItem from '@/components/card-item/index.vue'
import { useRouter } from 'vue-router'
import img1 from '@/assets/images/polygon-area-picker.png'
import img2 from '@/assets/images/circle-area-picker.png'
import img3 from '@/assets/images/rect-area-picker.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'polygon',
    cover: img1,
    title: '多边形框选',
    gui: false
  },
  {
    id: 'circle',
    cover: img2,
    title: '圆形框选',
    gui: false
  },
  {
    id: 'rect',
    cover: img3,
    title: '矩形框选',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/area-picker/code/${id}`)
}
const handleToGui = (id: string) => {
  router.push(`/area-picker/gui/${id}`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

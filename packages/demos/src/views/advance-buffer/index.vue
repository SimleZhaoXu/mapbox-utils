<template>
  <div class="advance-buffer-demos demos-page">
    <card-item
      v-for="item in cardList"
      :id="item.id"
      :key="item.id"
      :cover="item.cover"
      :title="item.title"
      :gui="item.gui"
      @to-code="handleToCode"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import CardItem from '@/components/card-item/index.vue'
import { useRouter } from 'vue-router'
import img1 from '@/assets/images/advance-buffer-point.png'
import img2 from '@/assets/images/advance-buffer-line.png'
import img3 from '@/assets/images/advance-buffer-polygon.png'
import img4 from '@/assets/images/advance-buffer-rect.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'demo1',
    cover: img1,
    title: '点',
    gui: false
  },
  {
    id: 'demo2',
    cover: img2,
    title: '线',
    gui: false
  },
  {
    id: 'demo3',
    cover: img3,
    title: '多边形',
    gui: false
  },
  {
    id: 'demo4',
    cover: img4,
    title: '矩形',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/advance-buffer/code/${id}`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

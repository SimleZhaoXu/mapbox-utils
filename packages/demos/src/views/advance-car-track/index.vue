<template>
  <div class="advance-line-demos demos-page">
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
import img1 from '@/assets/images/advance-car-track-demo1.png'
import img2 from '@/assets/images/advance-car-track-demo2.png'
import img3 from '@/assets/images/advance-car-track-demo3.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'demo1',
    cover: img1,
    title: '示例1',
    gui: false
  },
  {
    id: 'demo2',
    cover: img2,
    title: '示例2',
    gui: false
  },
  {
    id: 'demo3',
    cover: img3,
    title: '示例3',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/advance-car-track/code/${id}`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

<template>
  <div class="marker-point-demos demos-page">
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
import img1 from '@/assets/images/marker-point.png'
import img2 from '@/assets/images/custom-marker1.png'
import img3 from '@/assets/images/custom-marker2.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'base',
    cover: img1,
    title: '基础使用',
    gui: false
  },
  {
    id: 'custom1',
    cover: img2,
    title: '自定义Marker（一）',
    gui: false
  },
  {
    id: 'custom2',
    cover: img3,
    title: '自定义Marker（二）',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/marker-point/code/${id}`)
}
const handleToGui = () => {
  router.push(`/marker-point/gui`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

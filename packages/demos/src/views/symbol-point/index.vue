<template>
  <div class="symbol-point-demos demos-page">
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
import img1 from '@/assets/images/symbol-point.png'
import img2 from '@/assets/images/pulsing-dot.png'
import img3 from '@/assets/images/sdf-icon.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'base',
    cover: img1,
    title: '基础使用',
    gui: false
  },
  {
    id: 'pulsing-dot',
    cover: img2,
    title: '动态图标',
    gui: false
  },
  {
    id: 'sdf-icon',
    cover: img3,
    title: 'SDF图标',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/symbol-point/code/${id}`)
}
const handleToGui = () => {
  router.push(`/symbol-point/gui`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

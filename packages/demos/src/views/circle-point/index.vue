<template>
  <div class="circle-point-demos demos-page">
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
import img1 from '@/assets/images/circle-point.png'
import img2 from '@/assets/images/point-popup.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'base',
    cover: img1,
    title: '基础使用',
    gui: false
  },
  {
    id: 'popup',
    cover: img2,
    title: '点位与弹窗',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/circle-point/code/${id}`)
}
const handleToGui = () => {
  router.push(`/circle-point/gui`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

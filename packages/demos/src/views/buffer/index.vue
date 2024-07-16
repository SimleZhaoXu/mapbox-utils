<template>
  <div class="buffer-demos demos-page">
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
import img1 from '@/assets/images/buffer.png'
import img2 from '@/assets/images/buffer-circle-center.png'
import img3 from '@/assets/images/buffer-symbol-center.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'base',
    cover: img1,
    title: '基础使用',
    gui: false
  },
  {
    id: 'circle-center',
    cover: img2,
    title: '显示中心原圆点',
    gui: false
  },
  {
    id: 'symbol-center',
    cover: img3,
    title: '显示中心图标',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/buffer/code/${id}`)
}
const handleToGui = () => {
  router.push(`/buffer/gui`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

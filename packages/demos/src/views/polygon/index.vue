<template>
  <div class="polygon-demos demos-page">
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
import img1 from '@/assets/images/polygon.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'base',
    cover: img1,
    title: '基础使用',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/polygon/code/${id}`)
}
const handleToGui = () => {
  router.push(`/polygon/gui`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

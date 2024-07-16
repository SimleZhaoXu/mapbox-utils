<template>
  <div class="distance-measurer-demos demos-page">
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
import img1 from '@/assets/images/distance-measurer-demo1.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'demo1',
    cover: img1,
    title: '示例1',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/distance-measurer/code/${id}`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

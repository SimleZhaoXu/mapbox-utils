<template>
  <div class="circle-point-demos demos-page">
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
import img1 from '@/assets/images/symbol-cluster.png'
import img2 from '@/assets/images/circle-cluster.png'
const router = useRouter()
const cardList = ref([
  {
    id: 'symbol',
    cover: img1,
    title: '图标聚合点',
    gui: false
  },
  {
    id: 'circle',
    cover: img2,
    title: '圆点聚合点',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/cluster/code/${id}`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

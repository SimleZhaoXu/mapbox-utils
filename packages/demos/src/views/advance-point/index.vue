<template>
  <div class="advance-point-demos demos-page">
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
import img1 from '@/assets/images/advance-point-demo1.png'
import img2 from '@/assets/images/advance-point-demo2.png'
import img3 from '@/assets/images/advance-point-demo3.png'
import img4 from '@/assets/images/advance-point-demo4.png'
import img5 from '@/assets/images/advance-point-demo5.png'
import img6 from '@/assets/images/advance-point-demo6.png'
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
  },
  {
    id: 'demo4',
    cover: img4,
    title: '示例4',
    gui: false
  },
  {
    id: 'demo5',
    cover: img5,
    title: '示例5',
    gui: false
  },
  {
    id: 'demo6',
    cover: img6,
    title: '示例6',
    gui: false
  }
])

const handleToCode = (id: string) => {
  router.push(`/advance-point/code/${id}`)
}
</script>

<style lang="scss" scoped>
.card-item {
  float: left;
}
</style>

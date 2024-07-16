<template>
  <div class="card-item">
    <div class="title">{{ title }}</div>
    <img class="cover" :src="cover" />
    <div class="more">
      <div class="button" @click="handleEdit">查看代码</div>
      <div v-if="gui" class="button" @click="handleConfig">快速配置</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { withDefaults } from 'vue'
const props = withDefaults(
  defineProps<{
    title: string
    cover: string
    id: string
    gui?: boolean
  }>(),
  {
    gui: false
  }
)

const $emit = defineEmits(['toCode', 'toGui'])
const handleEdit = () => {
  $emit('toCode', props.id)
}
const handleConfig = () => {
  $emit('toGui', props.id)
}
</script>

<style lang="scss" scoped>
.card-item {
  width: 400px;
  height: 400px;
  background-color: #353333;
  margin: 0 20px 20px 0;
  box-sizing: border-box;
  border-radius: 15px;
  transition: box-shadow 0.25s;
  background-color: #18181b;
  position: relative;
  box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.05), 0px 8px 15px rgba(0, 0, 0, 0.1),
    0 0 0 1px rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.05);
  .cover {
    width: calc(100% - 30px);
    margin: 0 auto;
    height: calc(100% - 110px);
    display: block;
  }

  .title {
    height: 50px;
    line-height: 50px;
    color: #fff;
    padding-left: 15px;
  }

  .more {
    height: 60px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .button {
      height: 30px;
      line-height: 30px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 15px;
      text-align: center;
      padding: 0 10px;
      color: #fff;
      font-size: 14px;
      cursor: pointer;
      &:hover {
        background: rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>

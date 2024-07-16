<template>
  <div class="main-menu">
    <div
      v-for="item in menus"
      :key="item.path"
      :class="['menu-item', { active: route.meta.code === item.path }]"
      @click="handleMenuClick(item.path)"
    >
      {{ item.name }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import menuList from '@/config/menu-config'
const route = useRoute()
const router = useRouter()
const menus = ref(menuList)
const handleMenuClick = (path: string) => {
  router.push(`/${path}`)
}
</script>

<style lang="scss" scoped>
.main-menu {
  width: 200px;
  height: 100%;
  background: #25262c;
  overflow: auto;
  .menu-item {
    height: 44px;
    line-height: 44px;
    font-size: 14px;
    margin-bottom: 4px;
    color: #a3a1a1;
    cursor: pointer;
    padding-left: 50px;
    &:hover,
    &.active {
      background: linear-gradient(
        90deg,
        rgba(92, 141, 247, 0) 0%,
        rgba(92, 140, 247, 0.01) 29%,
        #878787 99%,
        #ffffff 99%,
        #ffffff 100%
      );
      color: #fff;
    }
  }
}
</style>

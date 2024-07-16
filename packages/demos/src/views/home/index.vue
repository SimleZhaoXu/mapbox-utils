<template>
  <div class="main-layout">
    <main-menu />
    <div class="main">
      <router-view v-slot="{ Component }">
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import MainMenu from './menu.vue'
</script>

<style lang="scss" scoped>
.main-layout {
  width: 100%;
  height: 100%;
  display: flex;
  .main {
    flex: 1;
    min-width: 0;
    height: 100%;
    background: #000;
  }
}
</style>

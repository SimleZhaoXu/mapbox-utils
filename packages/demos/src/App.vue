<template>
  <router-view v-slot="{ Component }">
    <transition name="fade-transform" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts"></script>

<style lang="scss">
body {
  width: 100vw;
  height: 100vh;
}

#app {
  width: 100%;
  height: 100%;
}
</style>

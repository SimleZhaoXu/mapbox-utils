<template>
  <div>
    <div class="custom-marker" :class="`marker-${data.type}`">
      <span> 测试{{ data.id }} </span>
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})
</script>

<style lang="scss" scoped>
.custom-marker {
  --color: #ff22bb;
  font-family: 'Poppins', sans-serif;
  padding: 0 20px;
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
  // background: #000000;
  cursor: pointer;
  position: relative;
  transition: 1s;
  overflow: hidden;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  span {
    position: relative;
    z-index: 1;
  }
  &:hover {
    background: var(--color);
    box-shadow: 0 0 10px var(--color), 0 0 30px var(--color),
      0 0 60px var(--color), 0 0 100px var(--color);
    &:before {
      width: 150%;
    }
    &::after {
      background: var(--color);
    }
  }
  &:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 400%;
    background: var(--color);
    animation: animate 2s linear infinite;
  }
  &:after {
    content: '';
    inset: 2px;
    position: absolute;
    background: #0e1538;
    transition: all 0.5s;
  }
  &.marker-1 {
    --color: #b0a4e3;
  }
  &.marker-2 {
    --color: #9ed900;
  }
  &.marker-3 {
    --color: #ff8c31;
  }
  &.marker-4 {
    --color: #ff4c00;
  }
}

@keyframes animate {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>

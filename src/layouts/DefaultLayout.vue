<script setup>
import bgImage from '@/assets/images/bg-login.png'
</script>

<template>
  <div>
    <img :src="bgImage" alt="bg-login" class="h-full w-full absolute" />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

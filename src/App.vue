<script setup lang="ts">
import { motion } from 'motion-v'
import { ref } from 'vue'
import { Button } from './components/ui/button'

const link = ref('')
const hasFetched = ref(false)
const fetchVideo = () => {
  hasFetched.value = true
}
</script>

<template>
  <div class="">
    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 1 }"
      class="min-h-screen w-screen flex flex-col justify-center bg-[linear-gradient(215deg,#451c1c,transparent_35%),radial-gradient(#451c1c,transparent_40%),radial-gradient(#451c1c,transparent_65%)] bg-size-[auto,105vw_200vh,60rem_30rem] bg-position-[0_0,-60vw_-40vh,50%_calc(100%+20rem)] bg-no-repeat pb-16"
    >
      <motion.div
        :animate="hasFetched ? { y: -200 } : { y: 0 }"
        :transition="{ duration: 0.75 }"
        class="w-full space-y-4 pb-16"
      >
        <motion.div
          :initial="{ y: 25, opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :transition="{ duration: 0.75, delay: 0.5 }"
          class="flex justify-center items-center"
        >
          <h1 class="text-7xl font-bold text-[#c24e4e]">Fetchly</h1>
        </motion.div>
        <motion.div
          :initial="{ y: 25, opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :transition="{ duration: 0.75, delay: 0.625 }"
          class="flex justify-center items-center w-full px-20"
        >
          <span class="text-gray-400 text-lg text-center">
            Effortless multimedia saving designed for speed, quality, and reliability.
          </span>
        </motion.div>
        <motion.div
          :initial="{ y: 25, opacity: 0 }"
          :animate="{ y: 0, opacity: 1 }"
          :transition="{ duration: 0.75, delay: 0.75 }"
          class="flex justify-center items-center w-full pt-8"
        >
          <div
            class="flex max-w-3xl w-9/10 lg:w-3xl sm:w-9/10 h-16 text-gray-400 border border-[#c24e4e] rounded-md [&:has(input:focus)]:border-[#e06b6b] transition-colors duration-250"
          >
            <input
              v-model="link"
              class="p-2 px-4 h-full w-full outline-0 border-r border-[#c24e4e] focus:border-[#e06b6b] placeholder:transition-colors placeholder:duration-250 focus:placeholder:text-gray-400 transition-colors duration-250"
              placeholder="Enter Your Link Here..."
              type="text"
            />
            <Button
              @click="fetchVideo"
              :disabled="link.length === 0"
              class="px-8 h-full rounded-none rounded-r-md font-medium text-gray-400 active:bg-[#c24e4e]/80 active:text-gray-400 hover:text-[#c24e4e] hover:brightness-150 hover:bg-[#c24e4e]/20 cursor-pointer transition-all duration-250"
            >
              Fetch
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
</template>

<style scoped></style>

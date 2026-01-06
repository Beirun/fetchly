<script setup lang="ts">
import { motion } from 'motion-v'
const loading = ref(false)

const url = ref('')

const download = async () => {
  if (!url.value || loading.value) return
  loading.value = true

  const r = await fetch('/api/info', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: url.value }),
  })

  if (!r.ok) {
    loading.value = false
    throw new Error(await r.text())
  }

  const res = await r.json()
  console.log('result:', res)
  // const b = await r.blob()
  // const a = document.createElement('a')
  // a.href = URL.createObjectURL(b)
  // a.download = 'video.mp4'
  // a.click()
  // URL.revokeObjectURL(a.href)
  loading.value = false
}
</script>

<template>
  <div class="w-screen bg-[#16181d] overflow-x-hidden">
    <motion.div
      :initial="{ opacity: 0 }"
      :animate="{ opacity: 1 }"
      :transition="{ duration: 1 }"
      class="min-h-screen w-screen flex flex-col justify-center bg-[linear-gradient(215deg,var(--gradient-overlay),transparent_35%),radial-gradient(var(--gradient-overlay),transparent_40%),radial-gradient(var(--gradient-overlay),transparent_65%)] bg-size-[auto,105vw_200vh,60rem_30rem] bg-position-[0_0,-60vw_-40vh,50%_calc(100%+20rem)] bg-no-repeat pb-16"
    >
      <div class="w-screen min-h-screen flex justify-center items-center">
        <div class="w-full space-y-4 pb-16">
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
                v-model="url"
                class="p-2 px-4 h-full w-full outline-0 border-r border-[#c24e4e] focus:border-[#e06b6b] placeholder:transition-colors placeholder:duration-250 focus:placeholder:text-gray-400 transition-colors duration-250"
                placeholder="Enter Your Link Here..."
                type="text"
              />
              <Button
                @click="download"
                :disabled="url.length === 0"
                class="bg-transparent px-8 h-full rounded-none rounded-r-md font-medium text-gray-400 active:bg-[#c24e4e]/80 active:text-gray-400 hover:text-[#c24e4e] hover:brightness-150 hover:bg-[#c24e4e]/20 cursor-pointer transition-all duration-250"
              >
                {{ loading ? 'Fetching…' : 'Fetch' }}
              </Button>
            </div>
          </motion.div>
          <div id="test"></div>
        </div>
      </div>
      <div id="test" class="h-screen w-screen"></div>
    </motion.div>
  </div>
</template>

<style scoped></style>

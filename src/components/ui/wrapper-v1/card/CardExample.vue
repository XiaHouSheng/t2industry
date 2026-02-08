<script setup>
import { ref } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, BlueprintCard } from './index.js'

const blueprints = ref([
  {
    id: 1,
    name: '四号谷地自动化生产线',
    description: '这是一个高效的自动化生产线，可以快速生产各种物资，适用于四号谷地地区。',
    area: '四号谷地',
    creator: { name: '张三' },
    views: 1234,
    downloads: 567
  },
  {
    id: 2,
    name: '武陵能源中心',
    description: '武陵地区的能源中心，提供稳定的电力供应，支持多种能源转换。',
    area: '武陵',
    creator: { name: '李四' },
    views: 2345,
    downloads: 890
  }
])

const handleView = (blueprint) => {
  console.log('查看蓝图:', blueprint)
}

const handleShare = (blueprint) => {
  console.log('分享蓝图:', blueprint)
}

const handleBilibili = (blueprint) => {
  console.log('跳转到B站:', blueprint)
}
</script>

<template>
  <div class="p-6 space-y-6">
    <h2 class="text-2xl font-bold text-white mb-4">Card 组件示例</h2>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <BlueprintCard
        v-for="blueprint in blueprints"
        :key="blueprint.id"
        :blueprint="blueprint"
        @view="handleView"
        @share="handleShare"
        @bilibili="handleBilibili"
      />
    </div>

    <div class="mt-8">
      <h3 class="text-xl font-semibold text-white mb-4">基础 Card 组件</h3>
      <Card>
        <CardHeader>
          <CardTitle>卡片标题</CardTitle>
          <CardDescription>这是卡片的描述信息</CardDescription>
        </CardHeader>
        <CardContent>
          <p class="text-gray-300">这是卡片的主要内容区域，可以放置任何内容。</p>
        </CardContent>
        <CardFooter>
          <button class="px-4 py-2 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors">
            取消
          </button>
          <button class="px-4 py-2 rounded bg-yellow-500 text-gray-900 hover:bg-yellow-400 transition-colors">
            确认
          </button>
        </CardFooter>
      </Card>
    </div>
  </div>
</template>

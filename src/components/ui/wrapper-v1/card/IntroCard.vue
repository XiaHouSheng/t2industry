<script setup>
</script>

<template>
  <div class="intro-card rounded-xl border border-gray-700 bg-gray-900/50 backdrop-blur-xl shadow-lg overflow-hidden">
    <div class="intro-header p-4 border-b border-gray-800 bg-gray-850">
      <h3 class="text-lg font-semibold text-white">关于本站</h3>
    </div>
    <div class="intro-content p-4 space-y-4">
      <div class="intro-item">
        <h4 class="text-base font-semibold text-yellow-400 mb-2">什么是"塔卫二蓝图"？</h4>
        <p class="text-sm text-gray-300 mb-2">
          一款面向《明日方舟：终末地》的多功能工具平台，核心能力包含：蓝图分享与管理、生产效率模拟（计划）。
        </p>
        <p class="text-sm text-gray-300">
          玩家可以手动通过本站提供的蓝图编辑器进行蓝图编辑并上传，也可以查看其他玩家的蓝图。
        </p>
        <p class="text-sm text-gray-300">站点旨在搭建一个蓝图汇总库以便于玩家进行查找。</p>
      </div>
      <div class="intro-item">
        <h4 class="text-base font-semibold text-yellow-400 mb-2">公告</h4>
        <p class="text-sm text-gray-300">
          目前没有开发管道相关的蓝图编辑功能，但是对于需要管道的机器可以进行配方配置与放置。
        </p>
      </div>
      <div class="intro-item">
        <h4 class="text-base font-semibold text-yellow-400 mb-2">联系我们</h4>
        <p class="text-sm text-gray-300">
          企鹅群：615187598<br />
          仓库主页：<a
            href="https://github.com/XiaHouSheng/t2industry"
            target="_blank"
            class="text-yellow-500 hover:text-yellow-400 transition-colors duration-300 underline"
          >
            https://github.com/XiaHouSheng/t2industry
          </a>
        </p>
      </div>
      <div class="intro-item">
        <h4 class="text-base font-semibold text-yellow-400 mb-2">开发团队</h4>
        <p class="text-sm text-gray-300">霞后生</p>
      </div>
      <div class="intro-item">
        <h4 class="text-base font-semibold text-yellow-400 mb-2">免责声明</h4>
        <p class="text-sm text-gray-300 leading-relaxed">
          本网站/项目为非官方、非商业性质的个人学习与交流项目，与
          《明日方舟：终末地》（英文名：Arknights: Endfield）及其著作权方
          上海鹰角网络科技有限公司 不存在任何隶属、合作、授权或代言关系。
          网站/项目中所涉及的 《明日方舟：终末地》（Arknights: Endfield）
          相关名称、角色、图像、音效、世界观及其他知识产权内容，其著作权及相关权利均归
          上海鹰角网络科技有限公司
          所有，仅用于学习研究、技术展示与爱好交流目的，不构成任何商业用途。
          本网站/项目的程序代码部分采用 MIT License（MIT 开源协议）
          进行开源，仅对代码本身的使用、复制、修改、合并、发布等行为进行授权；
          MIT
          协议不包含也不代表对任何第三方素材（包括但不限于游戏美术、设定、商标等）的授权。
          如相关内容的展示对权利方造成影响或存在不妥之处，请联系作者处理，本站/项目将第一时间进行修改或删除。
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.intro-card {
  min-height: 200px;
}

.intro-item {
  padding: 0.5rem 0;
  border-left: 2px solid rgba(255, 250, 0, 0.3);
  padding-left: 1rem;
}

.intro-item:hover {
  border-left-color: rgba(255, 250, 0, 0.6);
  background-color: rgba(255, 255, 255, 0.02);
  transition: all 0.3s ease;
}

.intro-item h4 {
  margin-bottom: 0.5rem;
}

.intro-item p {
  margin-bottom: 0.5rem;
}

.intro-item p:last-child {
  margin-bottom: 0;
}

.leading-relaxed {
  line-height: 1.75;
}
</style>

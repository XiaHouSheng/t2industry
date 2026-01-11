<script setup>
import { ref } from "vue";
import { Calendar, Search } from "@element-plus/icons-vue";
const testInput = ref("");
</script>

<template>
  <el-row :gutter="6">
    <el-col :span="18">
      <div
        class="sheng-discover-search-cont display-flex flex-direation-col"
      >
        <div
          class="search-header display-flex flex-direation-col justify-content-center test-border"
        >

          <el-input
            :prefix-icon="Search"
            v-model="testInput"
            placeholder="输入关键字检索蓝图"
          ></el-input>
        </div>

        <div class="search-list flex-grow-1 test-border"></div>
        
        <div class="search-list-root test-border"></div>

      </div>
    </el-col>
    <el-col :span="6">
      <div
        class="sheng-discover-rank display-flex flex-direation-col test-border"
      >
        <div
          class="rank-header display-flex flex-direation-col justify-content-center test-border"
        >
          <h2 style="margin: 0; text-align: center">最多人查看</h2>
        </div>
        <div class="rank-list test-border">
        </div>
      </div>
    </el-col>
  </el-row>
</template>

<style scoped>
    .rank-list {
        flex-grow: 1;
        min-height: auto;
        overflow-y: scroll
    }
    .sheng-discover-rank {
        height: 690px;
    }
.sheng-discover-search-cont {
  height: 690px;
  gap: 6px;
}
.search-header {
  height: 60px;
  padding: 0 12px 0 12px;
}
.search-list-root {
  height: 50px;
  width: 100%;
}
.search-list {
  width: 100%;
  min-height: auto;
  overflow-y: scroll;
}
.rank-header {
  height: 60px;
}
</style>

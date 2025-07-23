<template>
  <div style="height: 400px; overflow-x: hidden">
    <el-timeline>
      <el-timeline-item
        :timestamp="item.date"
        placement="top" v-for="(item,index) in containerLifeData"
        :key="index"
        :icon="'el-icon-timer'"
        :color="'#6CB4FF'"
        >
        <el-card>
          <!-- <h4 style="margin-bottom: 10px;"></h4> -->
          <p>{{item.content}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
    };
  },
  props: {
    containerLifeData:[Array]//历史车辆使用记录
  },

  methods: {
    // 重置信息
    resetData() {
    },
    // 设置数据
    setData(val) {

    }
  },
};
</script>
<style lang='scss' scoped>
</style>
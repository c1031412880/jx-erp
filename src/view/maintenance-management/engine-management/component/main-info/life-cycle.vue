<template>
  <div style="height: 400px; overflow-x: hidden">
    <el-timeline>
      <el-timeline-item
        :timestamp="item.d_date"
        placement="top" v-for="(item,index) in groupUpList"
        :key="index"
        :icon="'el-icon-timer'"
        :color="'#6CB4FF'"
        >
        <el-card>
          <!-- <h4 style="margin-bottom: 10px;"></h4> -->
          <p>{{item.c_content}}</p>
        </el-card>
      </el-timeline-item>
    </el-timeline>
  </div>
</template>

<script>
export default {
  data() {
    return {
      veh_code: "浙D86W93",
      reverse: false,
      groupUpList: [
        {
          content: "购买",
          timestamp: "2018-04-11",
        },
        {
          content: "安装在 [车牌号]",
          timestamp: "2018-04-12",
        },
        {
          content: "[维修项目]",
          timestamp: "2018-04-13",
        },
        {
          content: "从[车牌号]上拆下  安装在[车牌号2]",
          timestamp: "2018-04-14",
        },
        {
          content: "[维修项目]",
          timestamp: "2018-04-15",
        },
        {
          content: "从[车牌号]上拆下  安装在[车牌号2]",
          timestamp: "2018-04-16",
        },
      ],
    };
  },

  methods: {
    resetData() {

    },
    // 数据回显
    setData(val) {
      console.log(val)
      this.groupUpList = val.lifes
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
<template>
  <div style="height: 400px; overflow-x: hidden">
    <div v-if="groupUpList.length > 0">
      <el-timeline>
        <el-timeline-item
          :timestamp="item.date"
          placement="top" v-for="(item,index) in groupUpList"
          :key="index"
          :icon="'el-icon-timer'"
          :color="'#6CB4FF'"
          >
          <el-card>
            <p>{{item.content}}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </div>
    <div v-else>
      <el-empty description="暂无该员工成长记录"></el-empty>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      groupUpList: [],
    };
  },

  methods: {
    // 初始化数据
    resetData(){ 
      this.groupUpList = []
    },
    // 数据回显
    setData(val){
      this.groupUpList = (!!val.emp_lifes && val.emp_lifes.length > 0)? val.emp_lifes: []
    }
  },
};
</script>
<style lang='scss' scoped>
</style>
<template>
  <div style="height: 100%; overflow-x: hidden">
    <el-timeline>
      <el-timeline-item
        :timestamp="item.date"
        placement="top" v-for="(item,index) in groupUpList"
        :key="index"
        :icon="'el-icon-timer'"
        :color="'#6CB4FF'"
        >
        <el-card>
          <h4 style="margin-bottom: 10px;">{{item.title}}</h4>
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
      veh_code: "浙D86W93",
      reverse: false,
      groupUpList: [

      ],
    };
  },

  methods: {
      setData(val){
      // let order_id = val.id
      // console.log(order_id,'ooo')
       this.$client.getRepairLife({repair_id:val.repair_id})
      .then(res => {
        if (res.head.result == "200") {
          // this.orderStatus = res.context.index
          this.groupUpList =res.context
          console.log(res.context)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
      })
    },
    resetData(){
      this.groupUpList = ''
    },
  },
};
</script>
<style lang='scss' scoped>
</style>
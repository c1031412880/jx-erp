<template>
  <div v-loading="loading">
    <div class="show-flex-box-r">
      <i style="float:left;width: 6px;height: 18px; background: #409EFF;"></i> 
      <p style="margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:16px;font-weight:bold">{{vehInfo.lp_num}}生命周期</p>
    </div>
    <div style="padding:0 20px;">
      <el-timeline>
        <el-timeline-item
          :timestamp="item.date"
          placement="top" v-for="(item,index) in groupUpList"
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
    
  </div>
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      groupUpList: [],
      vehInfo:{},
      loading: false,
    };
  },
  mounted() {
    this.setData(this.info)
  },
  methods: {
    resetData() {

    },
    // 数据回显
    setData(val) {
      if(!!val) {
        this.vehInfo = val
        // console.log(val)
        // 获取车辆生命周期
        this.reqVehicelLife(val.id)
      }
    },
    // 获取车辆生命周期
    reqVehicelLife(id) {
       this.loading = true
        this.$client.GetVehicelLifeVehicleManager({vehicle_id:id}).then(req => {
          this.loading = false
          if (req.head.result === '200') {
            this.groupUpList = req.context
          }else{
            this.groupUpList = [];
            this.$message({
              showClose: true,
              message: req.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false
          this.groupUpList = [];
        })
    }
  },
};
</script>
<style lang='scss' scoped>
</style>
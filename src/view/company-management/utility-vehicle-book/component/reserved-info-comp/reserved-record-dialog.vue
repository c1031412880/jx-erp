<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="800px"
    
  >
    <div class="el-dialog-div">
      <tr-table
        :selectionShow="false"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="0"
        :backFixedNum="1"
      >
      </tr-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">关 闭</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "预约车辆记录",
    },
    busId:{
      type: Number,
      default:0
    }
  },
  mounted() {

  },
  data() {
    return {
      canRendererTableHeader: [
        {
          id: 1,
          label: "预约借车人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },{
          id: 2,
          label: "预约时间",
          prop: "req_time",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },{
          id: 3,
          label: "预计还车时间",
          prop: "back_time",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        }
      ],
      TableHeight: 380,
      loading: false,
      data:[],

    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        if(!!this.busId) {
          this.reqBusRequest()
        }
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取公车预约记录
    reqBusRequest() {
      this.loading = true
       this.$client.GetBusRequestBusManage({bus_id: this.busId})
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false;
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    }

  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 400px;
}
</style>


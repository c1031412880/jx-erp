<template>
  <div class="all-report">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
    ></sub-req>
    <div :style="{height:TableHeight + 'px',overflow: 'auto'}">
      <table-box
        :tableBoxType='tableBoxType'
        ref="tableBox"
        :loading="loading"
      ></table-box>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import tableBox from '../component/table-box';
import subReq from './sub-req';
export default {
  name: "all-report",
  components: {
    subReq,
    tableBox
  },
  data() {
    return {
      TableHeight: 500,
      tableBoxType: 'detail',
      loading:false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    onSubmit(params) {
      this.loading = true
      this.$client.GetALLBicycleManage({context:params})
        .then(res => {
          if (res.head.result == "200") {
            if (res.context.length == 0) {
              this.$message({
                showClose: true,
                message: "暂无数据",
                type: "warning",
              });
              this.loading = false
              return
            }
            this.$refs.tableBox.setData(res.context)
            this.loading = false
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
            this.loading = false
          }
        }).catch(err => {
          this.loading = false
           this.$message({
            showClose: true,
            message: err,
            type: "error",
          });
        })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.all-report {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="operation-analysis">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按线路汇总" name="first" lazy>
        <sub-req
          ref="lineHead"
          :activeName="activeName"
          @on-ok="onSubmit"
          @on-export="exportExcel">
        </sub-req>

        <tr-vxe-table
          :selectionShow="false"
          :data="lineData"
          :footerShow="true"
          :footerMethod="lineFooterMethod"
          :tableHeaderList="lineCustomSettingList"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1">
          <!-- :omitColumnIndex='[2,3]' -->
        </tr-vxe-table>
      </el-tab-pane>
      <el-tab-pane label="按车辆汇总" name="second" lazy>
        <sub-req
          ref="vehHead"
          :activeName="activeName"
          @on-ok="onSubmit"
          @on-export="exportExcel">
        </sub-req>

        <tr-vxe-table
          :selectionShow="false"
          :data="vehData"
          :footerShow="true"
          :footerMethod="vehFooterMethod"
          :tableHeaderList="vehCustomSettingList"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1">
          <!-- :omitColumnIndex='[2,3]' -->
        </tr-vxe-table>
      </el-tab-pane>
      <el-tab-pane label="按组织汇总" name="third" lazy>
        <sub-req
          ref="deptHead"
          :activeName="activeName"
          @on-ok="onSubmit"
          @on-export="exportExcel">
        </sub-req>

        <tr-vxe-table
          :selectionShow="false"
          :data="deptData"
          :footerShow="true"
          :footerMethod="deptFooterMethod"
          :tableHeaderList="deptCustomSettingList"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1">
        </tr-vxe-table>
      </el-tab-pane>
      <el-tab-pane label="按驾驶员汇总" name="fourth" lazy>
        <sub-req
          ref="driHead"
          :activeName="activeName"
          @on-ok="onSubmit"
          @on-export="exportExcel">
        </sub-req>

        <tr-vxe-table
          :selectionShow="false"
          :data="driData"
          :footerShow="true"
          :footerMethod="driFooterMethod"
          :tableHeaderList="driCustomSettingList"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1">
        </tr-vxe-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import myMixin from "./component/myMixin.js";
export default {
  name: "operation-analysis",
  mixins: [myMixin],
  components: {subReq},
  data() {
    //这里存放数据",
    return {
      form: {},
      activeName: "first",
      lineData: [],
      vehData: [],
      deptData: [],
      driData: [],
      lineFooterMethod: [],
      vehFooterMethod: [],
      deptFooterMethod: [],
      driFooterMethod: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 3, //前几行固定
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  //方法集合",
  methods: {
    handleClick(tab) {

    },
    // 查询
    onSubmit(val) {
      this.form = Object.assign({}, val);
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      this.$client.GetOperationSummaryDayConsumptionDetail(params).then(res => {
        if(res.head.result == '200') {
          this.loading = false;
          let pop = res.context.length ? res.context.pop() : {}
          pop.seq = '合计'
          // console.log(pop);
          if(this.activeName === 'first') {
            this.lineData = res.context.length ? res.context : [];
            this.lineFooterMethod = pop ? [pop] : []
          }else if(this.activeName === 'second') {
            this.vehData = res.context.length > 1 ? res.context : [];
            this.vehFooterMethod = pop ? [pop] : []
          }else if(this.activeName === 'third') {
            this.deptData = res.context.length > 1 ? res.context : [];
            this.deptFooterMethod = pop ? [pop] : []
          }else if(this.activeName === 'fourth') {
            this.driData = res.context.length > 1 ? res.context : [];
            this.driFooterMethod = pop ? [pop] : []
          }
        }else {
          this.loading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 导出
    exportExcel() {
      let length = this.activeName === 'first' ? this.lineData.length : 
      this.activeName === 'second' ? this.vehData.length : 
      this.activeName === 'third' ? this.deptData.length : this.driData.length;
      if(length <= 0) {
        this.$message({ message: "暂无导出数据", type: "warning" });
        return false
      }
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      this.$client.ExportOperationTotalDayConsumptionDetail(params)
      .then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ message: "导出成功", type: "success" });
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.$message({ message: "导出失败", type: "error" });
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = 0;
        // let ph = 0;
        switch (this.activeName) {
          case 'first':
            th = this.$refs.lineHead.$el.offsetHeight
            break;
          case 'second':
            th = this.$refs.vehHead.$el.offsetHeight
            break;
          case 'third':
            th = this.$refs.deptHead.$el.offsetHeight
            break;
          case 'fourth':
            th = this.$refs.driHead.$el.offsetHeight
            break;
        
          default:
            break;
        }
        this.TableHeight = maxh - th - 55;
      }, 60);
    },
  },
}
</script>

<style lang="scss" scoped>
.operation-analysis{
  width: 100%;
  height: 100%;
}
</style>

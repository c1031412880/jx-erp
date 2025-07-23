<template>
  <div class="money-bag-summary">
    <div class="money-bag-summary-content">
      <el-tabs v-model="activeName">
        <el-tab-pane label="按线路汇总" name="first" lazy>
          <sub-req
            ref="lineHead"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-export="exportExcel"
            @on-import="importExcel">
          </sub-req>

          <tr-vxe-table
            ref="lineTable"
            :selectionShow="false"
            :data="lineData"
            :tableHeaderList="CustomSettingList"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="3"
            :footerShow="true"
            :footerMethod="lineFooterMethod">
            <template slot-scope="scope" slot="operation" v-if="scope.data.Date !== '合计'">
              <el-button type="text" @click="getDetailData(scope.data)">查看明细</el-button>
            </template>
          </tr-vxe-table>

          <!-- <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="linePaginationH"
            :current-page="linePageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="linePageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="linePageInfo.pageCount">
          </el-pagination> -->
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
            :tableHeaderList="vehCustomSettingList"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="1"
            :footerShow="true"
            :footerMethod="vehFooterMethod">
            <template slot-scope="scope" slot="operation" v-if="scope.data.Date !== '合计'">
              <el-button type="text" @click="getDetailData(scope.data)">查看明细</el-button>
            </template>
          </tr-vxe-table>

          <!-- <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="vehPaginationH"
            :current-page="vehPageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="vehPageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="vehPageInfo.pageCount">
          </el-pagination> -->
        </el-tab-pane>
        <el-tab-pane label="按驾驶员汇总" name="third" lazy>
          <sub-req
            ref="driHead"
            :activeName="activeName"
            @on-ok="onSubmit"
            @on-export="exportExcel">
          </sub-req>

          <tr-vxe-table
            :selectionShow="false"
            :data="driData"
            :tableHeaderList="driCustomSettingList"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="1"
            :footerShow="true"
            :footerMethod="driFooterMethod">
            <template slot-scope="scope" slot="operation" v-if="scope.data.Date !== '合计'">
              <el-button type="text" @click="getDetailData(scope.data)">查看明细</el-button>
            </template>
          </tr-vxe-table>

          <!-- <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="driPaginationH"
            :current-page="driPageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50, 100]"
            :page-size="driPageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="driPageInfo.pageCount">
          </el-pagination> -->
        </el-tab-pane>
      </el-tabs>
    </div>

    <!-- <information-dialog
      :dialogBool.sync="informationDialogShow"
      :requestData="requestData">
    </information-dialog> -->

    <!-- 上传文件 导出文件弹窗组件 -->
    <!-- <file-dialog
      :dialogBool.sync="fileDialogVisible"
      :fileData="FileData"
      :typeMessage="'相同日期线路车辆记录'"
      @on-submit-excel="importICExcel"
    ></file-dialog> -->
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import myMixin from "./component/myMixin.js";
import fileDialog from "@/components/fileDialog/file-dialog";
import informationDialog from "./component/information-dialog"
export default {
  name: 'money-bag-summary',
  mixins: [myMixin],
  components: {
    subReq,
    fileDialog,
    informationDialog
  },
  data() {
    return {
      // linePageInfo: {
      //   pageIndex: 1,
      //   pageSize: 20,
      //   pageCount: 0,
      // },
      // vehPageInfo: {
      //   pageIndex: 1,
      //   pageSize: 20,
      //   pageCount: 0,
      // },
      // driPageInfo: {
      //   pageIndex: 1,
      //   pageSize: 20,
      //   pageCount: 0,
      // },
      form: {},
      activeName: "first",
      lineData: [],
      vehData: [],
      driData: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      lineFooterMethod: [],
      vehFooterMethod: [],
      driFooterMethod: [],
      CustomSettingList: null,
      // informationDialogShow: false,
      // requestData: {},
      // fileDialogVisible: false,
      // FileData: {
      //   url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/IC卡导入模板.xlsx`,
      // },
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.CustomSettingList = this.lineCustomSettingList
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 查询
    onSubmit(val) {
      this.form = Object.assign({}, val);
      this.loadData();
    },
    // 数据加载
    loadData() {
      // switch (this.activeName) {
      //   case 'first':
      //     params.page_index = this.linePageInfo.pageIndex
      //     params.page_size = this.linePageInfo.pageSize
      //     break;
      //   case 'second':
      //     params.page_index = this.vehPageInfo.pageIndex
      //     params.page_size = this.vehPageInfo.pageSize
      //     break;
      //   case 'third':
      //     params.page_index = this.driPageInfo.pageIndex
      //     params.page_size = this.driPageInfo.pageSize
      //     break;
      
      //   default:
      //     break;
      // }
      this.CustomSettingList = this.form.line_type == 2 ? this.lineCompanyCustomSettingList : this.lineCustomSettingList
      this.$refs.lineTable.tableKeyChange()
      this.loading = true;
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      this.$client.GetDayConTotalDayConsumptionDetail(params).then(res => {
        if(res.head.result == '200') {
          this.loading = false;
          let pop = res.context.length ? res.context.pop() : {}
          if(this.activeName === 'first') {
            this.lineData = res.context.length > 1 ? res.context : [];
            this.lineFooterMethod = [pop]
          }else if(this.activeName === 'second') {
            this.vehData = res.context.length > 1 ? res.context : [];
            this.vehFooterMethod = [pop]
          }else if(this.activeName === 'third') {
            this.driData = res.context.length > 1 ? res.context : [];
            this.driFooterMethod = [pop]
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
    exportExcel(form) {
      // switch (this.activeName) {
      //   case 'first':
      //     params.page_index = this.linePageInfo.pageIndex
      //     params.page_size = this.linePageInfo.pageSize
      //     break;
      //   case 'second':
      //     params.page_index = this.vehPageInfo.pageIndex
      //     params.page_size = this.vehPageInfo.pageSize
      //     break;
      //   case 'third':
      //     params.page_index = this.driPageInfo.pageIndex
      //     params.page_size = this.driPageInfo.pageSize
      //     break;
      
      //   default:
      //     break;
      // }
      let length = this.activeName === 'first' ? this.lineData.length : this.activeName === 'second' ? this.vehData.length : this.driData.length;
      if(length <= 0) {
        this.$message({ message: "暂无导出数据", type: "warning" });
        return false
      }
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      this.$client.ExportTotalDayConsumptionDetail(params)
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
    // 查看明细
    getDetailData(row) {
      this.$router.push({
        name:'ic-card-detail',
        params:{
          start_time: this.form.start_time,
          end_time: this.form.end_time,
          dept_ids: row.dept_id ? row.dept_id : '',
          vehicle_ids: row.vehicle_id ? row.vehicle_id : '',
          line_ids: row.line_id ? row.line_id : '',
          driver_ids: row.driver_id ? row.driver_id : '',
        }
      })
    },
    // 导入
    importExcel() {
      this.fileDialogVisible = true;
    },
    // 导入信息Excel
    importICExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      console.log(params)
      this.$client.ICImportDayPurse(params).then((res) => {
        if (res.head.result == "200") {
          this.form = {};
          // 重置信息
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.$refs.head.resetForm();
          this.loadData();
          this.fileDialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        } else {
          this.fileDialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h("p", null, res.head.describle));
          this.$msgbox({
            title: "提示",
            message: h("div", null, errorData),
            confirmButtonText: "确定",
          });
        }
      });
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      switch (this.activeName) {
        case 'first':
          this.linePageInfo.pageIndex = idx
          break;
        case 'second':
          this.vehPageInfo.pageIndex = idx
          break;
        case 'third':
          this.driPageInfo.pageIndex = idx
          break;
      
        default:
          break;
      }
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      switch (this.activeName) {
        case 'first':
          this.linePageInfo.pageIndex = 1
        this.linePageInfo.pageSize = sizes;
        this.linePageInfo.pageCount = 0;
          break;
        case 'second':
          this.vehPageInfo.pageIndex = 1
          this.vehPageInfo.pageSize = sizes;
          this.vehPageInfo.pageCount = 0;
          break;
        case 'third':
          this.driPageInfo.pageIndex = 1
          this.driPageInfo.pageSize = sizes;
          this.driPageInfo.pageCount = 0;
          break;
      
        default:
          break;
      }
      this.loadData();
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

            // ph = this.$refs.linePaginationH.$el.offsetHeight
            break;
          case 'second':
            th = this.$refs.vehHead.$el.offsetHeight
            // ph = this.$refs.linePaginationH.$el.offsetHeight
            break;
          case 'third':
            th = this.$refs.driHead.$el.offsetHeight
            // ph = this.$refs.linePaginationH.$el.offsetHeight
            break;
        
          default:
            break;
        }
        this.TableHeight = maxh - th - 55;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.money-bag-summary
  height: 100%
  width: 100%
  /deep/ .el-table__body-wrapper
    overflow-y: auto;
    .el-table__body
      position: absolute;

</style>
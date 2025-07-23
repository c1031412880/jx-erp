<template>
  <div class="charge-detailed">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-import="openfiledialog"
      @on-export="exportFile"
    ></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedList"
    >
      <template slot-scope="scope" slot="operation">
        <el-popconfirm
          @confirm="tableDel(scope.data)"
          title="确定删除此条记录吗？"
          v-if="$isPowerShow('del')">
          <el-button slot="reference" type="danger" size="mini">删除</el-button>
        </el-popconfirm>
      </template>
    </tr-table>
    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage ="typeMessage"
      @on-submit-excel ="importCarInfoExcel"
    ></file-dialog>
    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount"
    >
    </el-pagination>


    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fileDialog from '@/components/fileDialog/file-dialog.vue'

export default {
  name: "charge-detailed",
  components: {
    subReq,
    fileDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "车架号",
          prop: "frame_number",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "订单编号",
          prop: "order_code",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "分类",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "充电站名称",
          prop: "station_name",
          width: "130",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "充电桩名称",
          prop: "pile_name",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "充电开始时间",
          prop: "begin_time",
          width: "150",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "充电结束时间",
          prop: "end_time",
          width: "150",
          align: "center",
          signIndex: 9,
        },
        {
          id: 11,
          label: "充电电费(元)",
          prop: "price_fee",
          width: "150",
          align: "center",
          signIndex: 10,
        },
        {
          id: 12,
          label: "充电服务费(元)",
          prop: "service_fee",
          width: "160",
          align: "center",
          signIndex: 11,
        },
        {
          id: 13,
          label: "充电费用",
          prop: "charge_fee",
          width: "150",
          align: "center",
          signIndex: 12,
        },
        {
          id: 14,
          label: "充电电量",
          prop: "electric_quantity",
          width: "150",
          align: "center",
          signIndex: 13,
        },
        {
          id: 15,
          label: "平均服务费实际单价(元)",
          prop: "service_fee_avg",
          width: "220",
          align: "center",
          signIndex: 14,
        },
        {
          id: 16,
          label: "充电时长(分钟)",
          prop: "charge_time",
          width: "160",
          align: "center",
          signIndex: 15,
        },
        {
          id: 17,
          label: "充电前SOC",
          prop: "front_soc",
          width: "130",
          align: "center",
          signIndex: 16,
        },
        {
          id: 18,
          label: "电站编号",
          prop: "charge_station_code",
          width: "130",
          align: "center",
          signIndex: 17,
        },
        {
          id: 19,
          label: "充电枪名称",
          prop: "charge_spear_name",
          width: "130",
          align: "center",
          signIndex: 18,
        },
        {
          id: 20,
          label: "充电启动方式",
          prop: "charge_start_type",
          width: "130",
          align: "center",
          signIndex: 19,
        },
        {
          id: 21,
          label: "判定结束原因",
          prop: "end_reason",
          width: "130",
          align: "center",
          signIndex: 20,
        },
        {
          id: 22,
          label: "扣费企业编码",
          prop: "deduction_code",
          width: "130",
          align: "center",
          signIndex: 21,
        },
        {
          id: 23,
          label: "扣费企业名称",
          prop: "deduction_name",
          width: "130",
          align: "center",
          signIndex: 22,
        },
        {
          id: 24,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 23,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      selectedIds:[], //勾选的ID
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/车辆充电明细模板.xlsx`
      },
      typeMessage: '充电明细'
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize');
      this.loadData();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    openfiledialog(){
      this.filedialogVisible = true
    },
    // 导入车辆信息Excel
    importCarInfoExcel(exportInfo){
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      let params = formData
      this.$client.ImportVehicleChargeDetail(params)
        .then(res => {
          if(res.head.result == "200") {
            this.filedialogVisible = false;
            this.$message({ message: res.head.describle, type: "success" });
          }else{
            this.filedialogVisible = false;
            let errorData = [];
            const h = this.$createElement;
            errorData.push(h('p',null,res.head.describle));
            this.$msgbox({
              title: '提示',
              message: h('div',null, errorData),
              confirmButtonText: '确定',
            })
            // this.$message({ message: res.head.describle, type: "error" });
          }
        })
    },
    // 导出Excel 文件
    exportFile(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportVehicleChargeDetail(params).then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 删除操作
    tableDel(info) {
      let params = {
        context: []
      };
      if(!!info) {
        params.context.push(info.id)
      }
      this.$client.BatchDeleteVehicleChargeDetail(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loadData();
            this.$message({
              showClose: true,
              message: "删除成功",
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
        this.$message({
          showClose: true,
          message: err.body.message,
          type: "error",
        });
      })
    },
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      Object.assign(this.form, form)
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let content = JSON.parse(JSON.stringify(this.form));
      content.page_index = this.pageInfo.pageIndex;
      content.page_size = this.pageInfo.pageSize;
      this.$client.ListVehicleChargeDetail(content).then(req => {
        this.loading = false;
        if (req.head.result === "200") {
          this.data = req.context.list;
          this.pageInfo.pageCount = req.context.total;
        } else {
          this.data = [];
          this.pageInfo.pageCount = 0;
        }
      })
    },
    // 打开自定义表头
    openSettingPageEvent() {
      this.customSettingVialogVisible = true
    },
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
      this.customSettingShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
        let obj = {
          id: index +1,
          label: sing.label,
          prop: sing.prop,
          width: sing.width,
          align: sing.align,
          signIndex: index,
          sortable: sing.sortable,
        }
        return obj
      });
      this.$forceUpdate();
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
     // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },

    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.charge-detailed {
  width: 100%;
  height: 100%;
}
</style>

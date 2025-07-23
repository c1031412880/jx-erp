<template>
  <div class="revenue-analysis">
    <sub-req 
      ref="head" 
      :whichPage="whichPage" 
      @on-ok="onSubmit" 
      @on-dow="tableDow"
      @on-all-edit="editAll"
      @on-all-save="saveAll"
      @on-import="openfiledialog"
      >
    </sub-req>
    <tr-table
      ref="table"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot-scope="scope" slot="wage_expenses">
        <el-input-number v-model="scope.data.wage_expenses" style="width: 100%" :min="0" :controls="false" v-if="isEditAll && whichPage == 2"></el-input-number>
        <span v-else>{{scope.data.wage_expenses}}</span>
      </template>
      <template slot-scope="scope" slot="append_expenses">
        <el-input-number v-model="scope.data.append_expenses" style="width: 100%" :min="0" :controls="false" v-if="isEditAll && whichPage == 2"></el-input-number>
        <span v-else>{{scope.data.append_expenses}}</span>
      </template>
      <template slot-scope="scope" slot="property_fee">
        <el-input-number v-model="scope.data.property_fee" style="width: 100%" :min="0" :controls="false" v-if="isEditAll && whichPage == 2"></el-input-number>
        <span v-else>{{scope.data.property_fee}}</span>
      </template>
      <template slot-scope="scope" slot="advert_fee">
        <el-input-number v-model="scope.data.advert_fee" style="width: 100%" :min="0" :controls="false" v-if="isEditAll && whichPage == 2"></el-input-number>
        <span v-else>{{scope.data.advert_fee}}</span>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount">
    </el-pagination>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      typeMessage ="按车辆汇总"
      @on-submit-excel ="importCarInfoExcel"
    ></file-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import fileDialog from '@/components/fileDialog/file-dialog.vue'
export default {
  name: 'revenue-analysis',
  components: {subReq,fileDialog},
  props: {
    whichPage: {
      type: Number,
      default: 1
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
    })
  },
  data() {
    //这里存放数据",
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      canRendererTableHeader: null,
      frontFixedNum:1, //前几行固定
      backFixedNum:1, //后几行固定
      loading: false,
      TableHeight: 500,
      data: [],
      allData: [],
      lineCustomSettingList:[
        {
          id: 1,
          label: "线路",
          prop: "line_name",
          width: "160",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "GPS里程(KM)",
          prop: "gps_mile",
          width: "145",
          align: "center",
          signIndex: 1,
          sortable:true
        },
        {
          id: 3,
          label: "营运里程",
          prop: "revenue_mile",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "收入",
          prop: "accident_reason",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "普票",
              prop: "common_ticket",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "IC卡(移动支付)",
              prop: "ic_ticket",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "包车",
              prop: "chartered",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "收入总和",
              prop: "income",
              width: "150",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 5,
          label: "支出",
          prop: "c_accident_address",
          width: "100",
          align: "center",
          signIndex: 4,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "工资性支出",
              prop: "wage_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "附加费用",
              prop: "append_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "燃料金额(油电)",
              prop: "fuel_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "维修材料",
              prop: "repair_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "车辆折旧",
              prop: "vehicle_depreciation",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "车辆保险费用",
              prop: "vehicle_safe",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "事故损失费用",
              prop: "accident_loss",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "支出总和",
              prop: "expenditure",
              width: "150",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 6,
          label: "毛利",
          prop: "gross_profit",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false
        },
      ],
      vehCustomSettingList:[
        {
          id: 1,
          label: "自编号",
          prop: "v_num",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:true
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lp_num",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:true
        },
        {
          id: 3,
          label: "所属组织",
          prop: "group_name",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable:true
        },
        {
          id: 4,
          label: "线路",
          prop: "line_name",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "车辆型号",
          prop: "vehicle_kind",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable:true
        },
        {
          id: 6,
          label: "GPS里程(KM)",
          prop: "gps_mile",
          width: "145",
          align: "center",
          signIndex: 5,
          sortable:true
        },
        {
          id: 7,
          label: "营运里程",
          prop: "revenue_mile",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable:false
        },
        {
          id: 8,
          label: "收入",
          prop: "accident_reason",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "普票",
              prop: "common_ticket",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "IC卡(移动支付)",
              prop: "ic_ticket",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "包车",
              prop: "chartered",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "收入总和",
              prop: "income",
              width: "150",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 9,
          label: "支出",
          prop: "c_accident_address",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "工资性支出",
              prop: "wage_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "附加费用",
              prop: "append_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "物业费",
              prop: "property_fee",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "广告费",
              prop: "advert_fee",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "机油费",
              prop: "engine_oil_fee",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "燃料金额(油电)",
              prop: "fuel_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "维修材料",
              prop: "repair_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "车辆折旧",
              prop: "vehicle_depreciation",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "车辆保险费用",
              prop: "vehicle_safe",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "事故损失费用",
              prop: "accident_loss",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "支出总和",
              prop: "expenditure",
              width: "150",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 10,
          label: "毛利",
          prop: "gross_profit",
          width: "120",
          align: "center",
          signIndex: 9,
          sortable:false
        },
      ],
      deptCustomSettingList:[
        {
          id: 1,
          label: "所属组织",
          prop: "group_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable:true
        },
        {
          id: 2,
          label: "GPS里程(KM)",
          prop: "gps_mile",
          width: "145",
          align: "center",
          signIndex: 1,
          sortable:true
        },
        {
          id: 3,
          label: "营运里程",
          prop: "revenue_mile",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "收入",
          prop: "accident_reason",
          width: "150",
          align: "center",
          signIndex: 3,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "普票",
              prop: "common_ticket",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "IC卡(移动支付)",
              prop: "ic_ticket",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "包车",
              prop: "chartered",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "收入总和",
              prop: "income",
              width: "150",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 5,
          label: "支出",
          prop: "c_accident_address",
          width: "100",
          align: "center",
          signIndex: 4,
          sortable:false,
          nestedTablesHeader: [
            {
              label: "工资性支出",
              prop: "wage_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "附加费用",
              prop: "append_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "燃料金额(油电)",
              prop: "fuel_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "维修材料",
              prop: "repair_expenses",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "车辆折旧",
              prop: "vehicle_depreciation",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "车辆保险费用",
              prop: "vehicle_safe",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "事故损失费用",
              prop: "accident_loss",
              width: "150",
              align: "center",
              sortable:false,
            },
            {
              label: "支出总和",
              prop: "expenditure",
              width: "150",
              align: "center",
              sortable:false,
            },
          ]
        },
        {
          id: 6,
          label: "毛利",
          prop: "gross_profit",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable:false
        },
      ],
      isEditAll: false,
      filedialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/车辆汇总模板.xlsx`,
      },
    }
  },
  //方法集合",
  methods: {
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.data = this.allData.length ? this.allData[this.pageInfo.pageIndex - 1] : []
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 导出
    tableDow() {
      let str = this.whichPage == 2 ? 'ExportVehicleRevenueAnalysis' 
      : this.whichPage == 1 ? 'ExportLineRevenueAnalysis' 
      : 'ExportDeptRevenueAnalysis' ;
      this.$client[str](this.form).then(req => {
        if (req.head.result === '200') {
          window.open(req.context)
        }
      })
    },
    loadData() {
      this.loading = true
      let str = this.whichPage == 2 ? 'GetRecentByVehicleRevenueAnalysis' 
      : this.whichPage == 1 ? 'GetRecentByLineRevenueAnalysis' 
      : 'GetRecentByDeptRevenueAnalysis' ;
      this.$client[str](this.form).then(req => {
        this.loading = false
        console.log(req)
        if (req.head.result === '200') {
          this.allData = this.$chunk(req.context, this.pageInfo.pageSize)
          this.pageInfo.pageCount = req.context.length
          this.data = this.allData.length ? this.allData[this.pageInfo.pageIndex - 1] : []
        } else {
          this.allData = []
          this.data = []
        }
      })
    }, 
    editAll() {
      if (this.data.length > 0) {
        this.isEditAll = true
        this.$refs.head.isEdit = false
      }
    },
    saveAll() {
      let list = this.data.map(item => {
        return {
          vehicle_id: item.vehicle_id_erp,
          vehicle_name: item.lp_num,
          month: this.form.month,
          wage_expenses: item.wage_expenses,
          append_expenses: item.append_expenses,
          property_fee: item.property_fee,
          advert_fee: item.advert_fee,
        }
      })

      this.$client.UpdateStateRevenueAnalysis({context: list}).then(res => {
        if (res.head.result == "200") {
          this.isEditAll = false
          this.$refs.head.isEdit = true
          this.loadData()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    openfiledialog(){
      this.filedialogVisible = true
    },
    // 导入车辆信息Excel
    importCarInfoExcel(exportInfo){
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      let params = formData
      this.$client.ImportRevenueAnalysis(params)
        .then(res => {
          if(res.head.result == "200") {
            this.filedialogVisible = false;
            this.$message({ message: res.head.describle, type: "success" });
            this.loadData()
          }else{
            this.filedialogVisible = false;
            let errorData = [];
            const h = this.$createElement;
            // errorData.push(h('p',null,res.head.describle));
            errorData = res.context.slice(0,50)
            errorData = errorData.join(' <br/> ');
            this.$alert(errorData,'提示 ', {
              dangerouslyUseHTMLString: true
            });
          }
        })
      },
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader 
      = this.whichPage == 1 ? this.lineCustomSettingList 
      : this.whichPage == 2 ? this.vehCustomSettingList  
      : this.deptCustomSettingList ;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 10;
        console.log(this.TableHeight)
      }, 60)
    }
  },
}
</script>

<style lang="scss" scoped>
.revenue-analysis{
  width: 100%;
  height: 100%;
}
</style>

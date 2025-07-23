<template>
  <div class="statistics-form">
    <div v-if="success">
      <sub-req
        ref="head"
        :loading="headerLoading"
        :querysData="querysData"
        @on-export="onExport"
        @on-ok="onSubmit"
      ></sub-req>
      <tr-table
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        :spanMethodType="['column']"
        :rowspanObj="rowspanObj"
        :mergekeys="mergekeys"
      >
        <template slot-scope="scope" slot="operation" >
            <el-button type="text" size="mini" @click="checkDetail(scope.data)">查看</el-button>
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
        :total="pageInfo.pageCount"
      >
      </el-pagination>
    </div>

    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
import customSetting from "./custom-setting";
import httpRequest from "@/api/http-api"
import modelObj from "@/view/main-Interface-entrance/news-core/modelObj";
export default {
  name: "statistics-form",
  components: {
    subReq,
    customSetting
  },
  props:["model"],
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
      headerLoading: false,
      TableHeight: 500,
      customSettingVialogVisible: false,
      canRendererTableHeader: null,
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [],
      searchData: [],
      querysData: [],
      success: false,
      mergekeys: [],
      rowspanObj:{},
      // 统计
      apiMap: {
        5000: 'GetByPageRestManage',
        5010: 'GetListOaWorkOvertime',
        5020: 'GetListTripRecord',
        5030: 'GetListWorkDeal',
        5040: 'GetListOaFormNews',
        5050: 'GetByPageAdvertInfo',
        5060: 'GetByPageSealCanCel',
        5070: 'GetByPageLineAdjust',
        5080: 'GetByPageVehicleRepairContract',
        5090: 'GetByPageOaVehiclePartsReceive',
        5100: 'GetListVehicleSafeCheck',
        5110: 'GetByPageInterVehicleChange',
        5120: 'GetByPageNewRecruitPerson',
        5130: 'GetByPageNewPersonAllocation',
        5140: 'GetByPageNewPersonTryCheck',
        5150: 'GetByPageWorkLaborContract',
        5160: 'GetByPagePostAppointment',
        5170: 'GetByPageLaborDepart',
        5180: 'GetListEmployRetirement',
        5190: 'GetByPageBankOpen',
        5200: 'GetByPageBankCancle',
        5210: 'GetByPageRewardRegistration',
        6500: 'GetByPageDetailSmallPurchase',
      },
      // 导出
      apiExport: {
        5000: 'ExportRestStatistics',//请假单
        5010: 'ExportOaWorkOvertimeStatists',//加班申请
        5020: 'ExportTripRecordStatists',//出差单
        5030: 'ExportWorkDealStatists',//工作联系单
        5060: 'ExportSealCanCelStatists',//盖章审批单
        5080: 'ExportVehicleRepairContract',//车辆外修审批单
        5090: 'ExportOaVehiclePartsReceive',//大额汽车配件领用审批单
        6500: 'ExportDetailSmallPurchase',//小额采购审批
      }
    };
  },
  created() {
    if (this.model) {
      this.getHeaderTable()
    }
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.customSettingList = []
      this.canRendererTableHeader = []
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {
        let i = 0
        let tabel_header = newestTableHeaderList  
        tabel_header.forEach(item => {
          let obj = {
            id: item.id,
            label: item.label,
            prop: item.prop,
            width: Number(item.width),
            align: item.align,
            signIndex: item.signIndex,
            isSelected: item.isSelected,
            sortable: item.sortable == "true" ? true : false
          }
          this.customSettingList.push(obj)
          if (item.isSelected) {
            i++
            let header_obj = Object.assign({},obj)
            header_obj.signIndex = i - 1
            this.canRendererTableHeader.push(header_obj)
          } 
        })
        this.$forceUpdate()
      })
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    getHeaderTable() {
      this.customSettingList = []
      this.canRendererTableHeader = []
      this.headerLoading = true
      this.success = false
      Promise.all([this.reqTitleTable(),this.GetFormDataSource()]).then(res => {
        let x1 = res[0]
        let x2 = res[1]
        this.titlesId = x1.id
        this.querysData = x2.querys
        this.frontFixedNum = x2.frontFixedNum
        this.backFixedNum = x2.backFixedNum
        let i = 0
        if (x1.titles && x1.titles.length > 0) {
          let tabel_header = x1.titles
          tabel_header.forEach((item,index) => {
            let obj = {
              id: item.id,
              label: item.label,
              prop: item.prop,
              width: Number(item.width),
              align: item.align,
              signIndex: item.signIndex,
              isSelected: item.isSelected,
              sortable: item.sortable == "true" ? true : false
            }
            this.customSettingList.push(obj)
            if (item.isSelected) {
              i++
              let header_obj = Object.assign({},obj)
              header_obj.signIndex = i - 1
              this.canRendererTableHeader.push(header_obj)
            } 
          });
        } else {
          let tabel_header = x2.table_data
          tabel_header.forEach((item,index) => {
            let obj = {
              id: index + 1,
              label: item.label,
              prop: item.field,
              width: 130,
              align: "center",
              signIndex: index,
              sortable: item.order,
            }
            this.customSettingList.push(obj)
            if (item.display) {
              i++
              let header_obj = Object.assign({},obj)
              header_obj.signIndex = i - 1
              this.canRendererTableHeader.push(header_obj)
            } 
          });
          let operation = {
            id: 99,
            label: "操作",
            prop: "operation",
            width: 120,
            align: "center",
            signIndex: 98,
          }
          this.canRendererTableHeader.push(operation)
          this.customSettingList.push(operation)
        }
        console.log('canRendererTableHeader',this.canRendererTableHeader);
        console.log('customSettingList',this.customSettingList);
        this.headerLoading = false
        this.success = true
        this.setHead();
      }).catch(err => {
        this.$message({
          showClose: true,
          message: "暂无审批单统计报表",
          type: "warning",
        });
        this.headerLoading = false
        this.loading = false
        this.success = false
      })
    },
    // 获取表头
    reqTitleTable() {
      this.menu_code = Number(this.$route.meta.code.toString() + this.model.toString())
      return new Promise((resolve,reject) => {
        httpRequest.GetTitleTableOrder({menu_code:this.menu_code}).then(res => {
          if (res.head.result === '200') {
            resolve(res.context)
          } else {
            reject(null)
          }
        })
      })
    },
    // 获取自定义表单数据
    GetFormDataSource() {
      return new Promise((resolve,reject) => {
        httpRequest.GetFormDataSource({code:this.model}).then(res => {
          if (res.code == "200") {
            resolve(res.data.dataSetRepos)
          }else{
            this.$message({
              showClose: true,
              message: res.msg,
              type: "error",
            });
            reject(null)
          }
        })
      })
    },
    
    // 查询
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      this.data = [];
      let params = {}
      params = Object.assign({}, this.form);
      params.state = 2;
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      console.log('=======',this.apiMap[this.model]);
      this.$client[this.apiMap[this.model]]({context:params})
        .then(res => {
          if (res.head.result == "200") {
            if (res.context.list) {
              this.data = res.context.list
              this.pageInfo.pageCount = res.context.total;
            }else {
              this.data = res.context
              this.pageInfo.pageCount = res.context.length;
            }
            this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          console.log(err);
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 合并行
    handleTableSpan(mergeKeys, tableData) {
      const spanObj = {}
      if (mergeKeys instanceof Array && tableData instanceof Array && mergeKeys.length && tableData.length) {
          let dataMap = {};
          this.data.forEach((item, index) => {
            if (dataMap.hasOwnProperty(item.id)) {
              dataMap[item.id].push(item)
            } else {
              dataMap[item.id] = [item]
            }
          });
          mergeKeys.forEach(key => {
              spanObj[key] = []
              let position = 0
              tableData.forEach((item, index) => {
                  if (index === 0) {
                      spanObj[key].push(1)
                      position = 0
                  } else {
                    // 如果要合并的key 值是引用数据类型，我们要先把 数组或者 对象转成json 格式然后对比
                    if (tableData[index][key] instanceof Array || tableData[index][key] instanceof Object) {
                        if (JSON.stringify(tableData[index][key]) === JSON.stringify(tableData[index - 1][key]) && item.id === tableData[index - 1].id) {
                            spanObj[key][position] +=1
                            spanObj[key].push(0)
                        } else {
                            spanObj[key].push(1)
                            position = index
                        }
                    } else {
                        if (tableData[index][key] === tableData[index - 1][key] && item.id === tableData[index - 1].id) {
                            spanObj[key][position] +=1
                            spanObj[key].push(0)
                        } else {
                            spanObj[key].push(1)
                            position = index
                        }
                    }
                  }
              })
          })
          return spanObj
      }
    },
    // 导出
    onExport() {
      if(!this.apiExport[this.model]){
        this.$message({ type: "error", message: "该审批单暂不支持导出" });
        return
      }
      let params = {}
      params = Object.assign({}, this.form);
      params.state = 2;
      this.$client[this.apiExport[this.model]]({context:params}).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }       
      });
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
    // 查看明细
    checkDetail(row) {
      this.$router.push({
        path: `/news-details/${row.id}/${'待办事项:' + modelObj[this.model]}/${this.model}`
      })
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 5;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.statistics-form {
  width: 100%;
  height: 100%;
}
</style>

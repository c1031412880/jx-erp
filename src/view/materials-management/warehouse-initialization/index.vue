<template>
  <div class="basic-material-information">
    <!-- <div style="margin-bottom: 25px;">
    </div> -->
    <sub-req ref="head"
        @on-add="addVeh"
        @on-ok="onSubmit"
        @on-del="tableDel"
        @on-import="openfiledialog"
        @on-export="exportFile"
    ></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedCurList">
      <template slot-scope="scope" slot="usable">
        <el-switch
          v-model="scope.data.usable"
          active-color="#13ce66"
          inactive-color="#ff4949"
          active-value="1"
          inactive-value="2"
          @change="stateChange(scope.data)"
          >
        </el-switch>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="editVehInfo(scope.data)" >编辑</el-button>
         <el-popconfirm
            @confirm="deleteData(scope.data)"
            title="确定删除此条信息吗？">
            <el-button slot="reference" type="primary" size="mini" style="margin-left: 10px;">删除</el-button>
         </el-popconfirm>
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

    <add-veh-dialog ref="addVehDialog" :dialogBool.sync="addVehDialogShow" :wuziOptions1="wuziOptions1" :title="vehDialogTitle" @on-set-form="setFormData"></add-veh-dialog>
    <information-dialog ref="informationDialog" :dialogBool.sync="informationDialogShow"></information-dialog>
    <look-data-dialog ref="lookDataDialog" :dialogBool.sync="lookDataDialogShow"></look-data-dialog>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :typeMessage ="typeMessage"
      @on-submit-excel ="importCarInfoExcel"
    ></file-dialog>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader='canRendererTableHeader'
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
  </div>
</template>

<script type="text/ecmascript-6">
import jurisdiction from "@/view/401";
import subReq from './component/sub-req'
import informationDialog from './component/dialog/information-dialog'
import fileDialog from '@/components/fileDialog/file-dialog.vue'
import AddVehDialog from './component/dialog/add-veh-dialog.vue'
import lookDataDialog from './component/look-data-dialog'
// import vehicleTransferDialog from './component/vehicle-transfer-dialog'
export default {
  name: "warehouse-initialization",
  data() {
    return {
      showprice:'3',
      toolData: {
        check_num: 0,
        car_num: 0,
        maintenance_num: 0,
        repair_num: 0,
        scrap_num: 0
      },
      lookDataDialogShow: false,
      vehicleTransferDialogShow: false,
      vehDialogTitle: '',
      typeMessage: '车辆',
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0
      },
      filedialogVisible: false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/wwwroot/excel/model/仓库初始化模板.xlsx`,
      },
      form: {
        state:'',
      },
      data: [],
      wuziOptions1:[],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addVehDialogShow: false,
      curVehInfoList: [], //当前勾选中车辆信息
      customSettingVialogVisible: false,
      customSettingList:[
        {
          id: 1,
          label: "仓库名称",
          prop: "house_name",
          width: "140",
          align: "center",
          signIndex:0,
          sortable:true
        },
        {
          id: 2,
          label: "物料编码",
          prop: "code",
          width: "140",
          align: "center",
          signIndex:1,
          sortable:true
        },
        {
          id: 3,
          label: "物料名称",
          prop: "name",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "规格型号",
          prop: "specification",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:true
        },
        {
          id: 5,
          label: "计量单位",
          prop: "measure_unit_name",
          width: "120",
          align: "center",
          signIndex:4,
          sortable:true
        },
        {
          id: 6,
          label: "品牌",
          prop: "brand",
          width: "160",
          align: "center",
          signIndex:5,
          sortable:false
        },
        // {
        //   id: 7,
        //   label: "适用车型",
        //   prop: "vehicle_kind_names",
        //   width: "120",
        //   align: "center",
        //   signIndex:6,
        //   sortable:false
        // },
        {
          id: 7,
          label: "数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex:6,
          sortable:true
        },
        {
          id: 8,
          label: "销售单价",
          prop: "price",
          width: "150",
          align: "center",
          signIndex:7,
          sortable:true
        },
        {
          id: 9,
          label: "销售金额",
          prop: "total_price",
          width: "120",
          align: "center",
          signIndex:8,
          sortable:true
        },
        {
          id: 10,
          label: "成本单价",
          prop: "cost_price",
          width: "120",
          align: "center",
          signIndex:9,
          sortable:true
        },
      {
          id: 11,
          label: "成本总价",
          prop: "cost_total_price",
          width: "120",
          align: "center",
          signIndex:10,
          sortable:true
        },

        //   {
        //   id: 13,
        //   label: "总价",
        //   prop: "total_price",
        //   width: "120",
        //   align: "center",
        //   signIndex:12,
        //   sortable:true
        // },
        {
          id: 12,
          label: "供应商",
          prop: "provider_name",
          width: "100",
          align: "center",
          signIndex:11,
          sortable:false
        },
        {
          id: 13,
          label: "仓位",
          prop: "position",
          width: "100",
          align: "center",
          signIndex:12,
          sortable:false
        },
        {
          id: 14,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex:13,
          sortable:false
        }
    ],
      frontFixedNum:0, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
    }
  },
  mounted() {
    this.showprice = JSON.parse(localStorage.getItem('showprice'));
    // this.getwuzi()
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.setHead('initialize')
      this.loadOverview()
    })
  },
  methods: {
    //  getwuzi(){
    //   this.$client.getMaterialPage({usable:1}).then(req => {
    //       if (req.head.result === '200') {
    //      this.wuziOptions1 = req.context.list
    //      req.context.list.forEach(element => {
    //        this.wuziOptions1.forEach(val => {
    //          if(val.specification==null){
    //           this.$set(val,"groupgo", val.name+'('+val.code+')')
    //          }else{
    //            this.$set(val,"groupgo", val.name+val.specification+'('+val.code+')')
    //          }
    //        });

    //      });
    //     }
    //     else{
    //       this.$message({type: 'error', message: '获取失败'})
    //     }
    //   })
    // },
    stateChange(data){
      console.log(data)
      //  var i = this.data.findIndex(item=>{return item.id == data.id})
      //  console.log(i)
      if(data.usable =='1'){
        this.$client.SetProviderUsablet({usable:'1',id:data.id}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({type: 'success', message: '操作成功'})
        }
        else{
          this.$message({type: 'error', message: '操作失败'})
        }
      })
      }else{
        this.$client.SetProviderUsablet({usable:'2',id:data.id}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({type: 'success', message: '操作成功'})
        }
        else{
          this.$message({type: 'error', message: '操作失败'})
        }
      })
      }
    },
     loadtable: function (val) {
      // childValue就是子组件传过来的值
      this.data = val
    },

    // 导入车辆信息Excel
    importCarInfoExcel(exportInfo){
      let formData = new FormData();
      formData.append("file", exportInfo.file);
      formData.append("type", exportInfo.radio);
      let params = formData
      this.$client.importHouseInit(params)
        .then(res => {
          if(res.head.result == "200") {
            this.filedialogVisible = false;
            this.$message({ message: res.head.describle, type: "success" });
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
            // this.$msgbox({
            //   dangerouslyUseHTMLString: true,
            //   title: '提示',
            //   message: h('div',null, errorData),
            //   confirmButtonText: '确定',
            // })
            // this.$message({ message: res.head.describle, type: "error" });
          }
        })
    },
    // 导出Excel 文件
    exportFile(form){
      // console.log(form)
      let params = Object.assign({},form);
      let ids = []
      this.curVehInfoList.forEach(item => {
        ids.push(item.id)
      })
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.exportHouseInit(params).then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },

    // 添加车辆信息
    addVeh(){
      this.addVehDialogShow = true
      this.vehDialogTitle = '添加'
      this.$refs['addVehDialog'].resetData()
    },
    // 删除
    deleteData(item) {
       this.$client.deleteRecordHouseInit({context:[item.id]}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({type: 'success', message: '操作成功'})
        }
        else{
          this.$message({type: 'error', message: '操作失败'})
        }
      })
    },
    // // 调动初始化
    // showTransfer(item) {
    //   this.vehicleTransferDialogShow = true
    //   this.$refs.vehicleTransferDialog.form.v_num = item.v_num
    //   this.$refs.vehicleTransferDialog.form.lp_num = item.lp_num
    //   this.$refs.vehicleTransferDialog.form.i_old_department = item.group
    //   this.$refs.vehicleTransferDialog.form.i_vehicle_id = item.id
    // },
    // 调动提交
    vehicleTransferOk(form) {
      this.vehicleTransferDialogShow = false
      this.$client.ChageCarDeptVehicleManager({context: form}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({type: 'success', message: '操作成功'})
        }
        else{
          this.$message({type: 'error', message: '操作失败'})
        }
      })
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
      this.$forceUpdate()
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 表格上点击编辑时
    editVehInfo(val){
      this.addVehDialogShow = true
      this.vehDialogTitle = '编辑'
      this.$refs['addVehDialog'].setData(val)
    },

    openfiledialog(){
      this.filedialogVisible = true
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      console.log(this.form,111111111111111)
      this.loadData()
    },
    onSubmit1(form) {
      this.form = form
      console.log(this.form)
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true
      this.form.page_size =this.pageInfo.pageSize
      this.form.page_index =this.pageInfo.pageIndex
      let context =this.form
      this.$client.getByPageHouseInit(
       context
      ).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
          this.data.forEach(element => {
          if(element.usable){
            element.usable=element.usable.toString()
            }
          if(element.price){
            element.price=element.price.toFixed(2)
            element.total_price=element.total_price.toFixed(2)
              if(element.cost_price){
                element.cost_price=element.cost_price.toFixed(2)
                if(element.cost_total_price){
                  element.cost_total_price=element.cost_total_price.toFixed(2)
                }
              }
          }
          });
          this.pageInfo.pageCount = req.context.total
        }else{
          this.data = [];
          this.pageInfo.pageCount = 0;
          this.$message({
            showClose: true,
            message: req.head.describle,
            type: "error",
          });
        }
      }).catch(err => {
        this.loading = false
        this.data = [];
        this.pageInfo.pageCount = 0;
        console.log(err)
      })
    },
    // 统计数据查询
    loadOverview() {
      this.$client.GetCountVehicleManager({}).then(req => {
        if (req.head.result === '200') {
          this.toolData = req.context
        }
      })
    },
    // 数据删除
    tableDel() {
      console.log(this.curVehInfoList)
      let ids = []
      this.curVehInfoList.forEach(item => {
        ids.push(item.id)
      })
      if (!ids.length) {
        this.$message({type: 'error', message: '请选择要删除的信息'})
        return false
      }
      this.$client.deleteRecordHouseInit({context: ids}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({type: 'success', message: '操作成功'})
        }
        else{
          this.$message({type: 'error', message: '操作失败'})
        }
      })
    },
    // 提交数据 调用接口
    setFormData(val){
      this.addVehDialogShow = false
      // let info = this.$outFormData(val)
      this.$client.setRecordHouseInit({context: val}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({type: 'success', message: '操作成功'})
        }
        else{
          this.$message({type: 'error', message: req.head.describle})
        }
      })
    },
    // 勾选中当前的车辆信息
    selectedCurList(val) {
      console.log(val)
      this.curVehInfoList = val;
    },
    // 计算表格高度
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - (th) -35
        console.log(this.TableHeight)
      }, 60)
    }
  },
  components: {
    subReq,informationDialog,fileDialog,
    AddVehDialog,
    lookDataDialog,jurisdiction
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.basic-material-information
  width 100%
  height 100%
</style>

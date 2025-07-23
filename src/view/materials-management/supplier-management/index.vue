<template>
  <div class="basic-material-information">
    <div style="margin-bottom: 25px;">
    </div>
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
      <template slot-scope="scope" slot="is_default">
        <el-switch
          v-model="scope.data.is_default"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="0"
          @change="defaultChange(scope.data)"
          >
        </el-switch>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="editVehInfo(scope.data)" >编辑</el-button>
         <el-popconfirm
            @confirm="deleteData(scope.data)"
            title="确定删除此条供应商信息吗？">
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

    <add-veh-dialog ref="addVehDialog" :dialogBool.sync="addVehDialogShow" :title="vehDialogTitle" @on-set-form="setFormData"></add-veh-dialog>
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

import subReq from './component/sub-req'
import informationDialog from './component/dialog/information-dialog'
import fileDialog from '@/components/fileDialog/file-dialog.vue'
import AddVehDialog from './component/dialog/add-veh-dialog.vue'
import lookDataDialog from './component/look-data-dialog'
// import vehicleTransferDialog from './component/vehicle-transfer-dialog'
export default {
  name: "supplier-management",
  data() {
    return {
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
        url: `${window.newHttpConfig.URL_EASYMOCK}/wwwroot/excel/model/车辆信息.xlsx`,
      },
      form: {
        state:'',
      },
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addVehDialogShow: false,
      curVehInfoList: [], //当前勾选中车辆信息
      customSettingVialogVisible: false,
      customSettingList:[
        {
          id: 1,
          label: "供应商名称",
          prop: "name",
          width: "200",
          align: "center",
          signIndex:0,
          sortable:true
        },
        {
          id: 2,
          label: "供应商编号",
          prop: "code",
          width: "140",
          align: "center",
          signIndex:1,
          sortable:true
        },
         {
          id: 3,
          label: "物料种类",
          prop: "material_count",
          width: "120",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "供应商类别",
          prop: "type_name",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:false
        },
        {
          id: 5,
          label: "助记码",
          prop: "mnemonic_code",
          width: "120",
          align: "center",
          signIndex:4,
          sortable:false
        },
        {
          id: 6,
          label: "区域分类",
          prop: "area_name",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:true
        },
        {
          id: 7,
          label: "客户分类",
          prop: "custom_type_name",
          width: "120",
          align: "center",
          signIndex:6,
          sortable:true
        },
        {
          id: 8,
          label: "地址",
          prop: "address",
          width: "160",
          align: "center",
          signIndex:7,
          sortable:true
        },
        {
          id: 9,
          label: "联系人",
          prop: "con_person",
          width: "120",
          align: "center",
          signIndex:8,
          sortable:false
        },
        {
          id: 10,
          label: "电话",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex:9,
          sortable:false
        },
        {
          id: 11,
          label: "信用等级",
          prop: "credit_level_name",
          width: "150",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "税号",
          prop: "ein",
          width: "120",
          align: "center",
          signIndex:11,
          sortable:false
        },
        {
          id: 13,
          label: "备注",
          prop: "remark",
          width: "100",
          align: "center",
          signIndex:12,
          sortable:true
        },
        {
          id: 14,
          label: "启用状态",
          prop: "usable",
          width: "130",
          align: "center",
          signIndex:13,
          sortable:true
        },
        {
          id: 15,
          label: "是否默认",
          prop: "is_default",
          width: "130",
          align: "center",
          signIndex:14,
        },
        {
          id: 16,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 15,
          sortable:false
        }
    ],
      frontFixedNum:1, //前几行固定
      backFixedNum:3, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.setHead('initialize')
      this.loadOverview()
    })
  },
  methods: {
    defaultChange(data) {
      let params = {
        is_default: data.is_default,
        usable: data.usable,
        id: data.id,
        type: data.type,
      }
      this.$client.SetProviderUsablet(params).then(req => {
        if (req.head.result === '200') {
          this.$message({type: 'success', message: '操作成功'})
        }
        else{
          this.$message({type: 'error', message: '操作失败'})
        }
        this.loadData()
      })
    },
    stateChange(data){
      console.log(data)
      //  var i = this.data.findIndex(item=>{return item.id == data.id})
      //  console.log(i)
      if(data.usable =='1'){
        let params = {
          is_default: data.is_default,
          usable: '1',
          id: data.id,
          type: data.type,
        }
        this.$client.SetProviderUsablet(params).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({type: 'success', message: '操作成功'})
        }
        else{
          this.$message({type: 'error', message: '操作失败'})
        }
      })
      }else{
        let params = {
          is_default: data.is_default,
          usable: '2',
          id: data.id,
          type: data.type,
        }
        this.$client.SetProviderUsablet(params).then(req => {
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
      this.$client.ImportCardInfoVehicleManager(params)
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
      let ids = []
      this.curVehInfoList.forEach(item => {
        ids.push(item.id)
      })
      if (ids.length) {
        params.ids = ids.toString()
      }
      this.$client.ExportProviderExport(params).then(res => {
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
    // 查看初始化
    deleteData(item) {
       this.$client.DeleteProviderRecord({context:[item.id]}).then(req => {
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
      this.$client.GetProviderPage(
       context
      ).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
          this.data.forEach(element => {
            if(element.usable){
            element.usable=element.usable.toString()
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
        this.$message({type: 'error', message: '请选择要删除的供应商'})
        return false
      }
      this.$client.DeleteProviderRecord({context: ids}).then(req => {
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
      this.$client.GetProviderSetRecord({context: val}).then(req => {
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
        this.TableHeight = maxh - (th)  - 60
        console.log(this.TableHeight)
      }, 60)
    }
  },
  components: {
    subReq,informationDialog,fileDialog,
    AddVehDialog,
    lookDataDialog,
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.basic-material-information
  width 100%
  height 100%
</style>

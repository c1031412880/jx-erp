<template>
  <tr-dialog
    :visible="dialogBool"
    :title="title"
    @before-close="dialogClose"
    :appendToBody="true"
    ref="trDialog"
    width="1050px"
    top="10px"
  >
    <div class="el-dialog-div-content">
      <sub-req
        ref="head"
        :isShowSortButton="false"
        @on-add="openAddPage"
        @on-ok="onSubmit"
        @open-setting-page="openSettingPageEvent"
      ></sub-req>
      <tr-table
        :selectionShow="true"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedUserList"
        :omitColumnIndex='[3,5,6,8,10]'
      >
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
          <el-button type="text" size="mini" style="margin-left: 10px;" @click="copyInfo(scope.data)">复制</el-button>
          <el-button type="text" size="mini" style="margin-left: 10px;" @click="editRowInfo(scope.data)">编辑</el-button>

          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？">
            <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
          </el-popconfirm>
        </template>
      </tr-table>
      <el-pagination
        style="margin: 5px 0;display:flex; justify-content: flex-end;"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50,]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      >
      </el-pagination>
    </div>
    <set-info-dialog
      ref="setOrganizationInfo"
      :dialogBool.sync="isShowSetInfoDialog"
      :curSelecedType="curSelecedType"
      @save-add-edit="saveAddEdit"
    ></set-info-dialog>
    <!-- 表格自定义组件 -->
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @update-table-header="updateTableHeader"
      :isParentUse="false"
      :append-to-body="true"
    ></custom-setting>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req.vue";
import setInfoDialog from "./set-info-dialog.vue";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
import tableDraggableSort from "@/components/tableDraggableSort";
export default {
  name: 'materials-manage-box',
  components: { subReq, setInfoDialog, fileDialog, tableDraggableSort},
  data() {
    return {
      title: '物资管理',
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      form:{}, //查询表单数据
      visible: false,
      data:[], //列表
      customSettingShowList: null,
      customSettingVialogVisible: false,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      titlesId: '',
      menu_code: '10010200',
      canRendererTableHeader: null,
      customSettingList: [
        {
          id: 1,
          label: "物资名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "物资编号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "商品规格",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "助记码",
          prop: "mnemonic_code",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "计量单位",
          prop: "measure_unit",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "所属分组",
          prop: "main_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "最新入库价（元）",
          prop: "price",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "税率（%）",
          prop: "tax_rate",
          width: "170",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "来源供应商",
          prop: "provider_name",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "商品条码",
          prop: "barcode",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "关键尺寸",
          prop: "key_size",
          width: "120",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "是否临时物资",
          prop: "temp_meterial_name",
          width: "120",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "备注",
          prop: "remark",
          width: "120",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "即时库存",
          prop: "timer_inventory",
          width: "120",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "启用状态",
          prop: "usable",
          width: "120",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
      ],
      loading: false,
      TableHeight:500,
      curSelecedType: 'add', //添加
      isShowSetInfoDialog: false,
      //10010200
    }
  },
  props: {
    dialogBool: Boolean,
    remoteWuzi: [String]
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        this.reqTitleTable()
        console.log('remoteWuzi', this.remoteWuzi)
        let info = {}
        this.$nextTick(() => {
          if (this.remoteWuzi) {
            info.code = this.remoteWuzi
            info.name = this.remoteWuzi
            info.mnemonic_code = this.remoteWuzi
            this.$refs.head.form.code = this.remoteWuzi
          }
          this.onSubmit(info)
        })

      }
    },
  },
  mounted() {
    this.$refs.trDialog.fullscreen = true
  },
  methods: {
    // 更新表头
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {

        this.reqTitleTable()
      }).catch(err => {

      })
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      })
    },
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 取消
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true);
    },
    // 获取列表
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrgProjectList(isCurDepartment) {
      this.loading = true;
      // let params = {
      //   main_id: isCurDepartment? this.curSelectedDepartment.id : this.curSelectedDepartment.parent_id
      // }
      let params = {}
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      this.$client.getMaterialPage(params)
        .then(res => {
          // console.log(JSON.stringify(res))
          if (res.head.result == "200") {
            this.data = res.context.list;
            this.data.forEach(element => {
              if(element.usable){
                element.usable=element.usable.toString()
              }
            });
            // 总分类下需要分页
            this.pageInfo.pageCount = res.context.total
            setTimeout(() => {
              this.loading = false;
            }, 800);
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {

      })
    },
    // 头部事件抛出
    openAddPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          if(this.curSelectedDepartment && this.curSelectedDepartment.type === 1) {
            this.$refs.setOrganizationInfo.ruleForm.main_id = this.curSelectedDepartment.id;
          }
          if(this.curSelectedDepartment && this.curSelectedDepartment.type === 2) {
            this.$refs.setOrganizationInfo.ruleForm.main_id = this.curSelectedDepartment.id;
          }
          this.isShowSetInfoDialog = true;
          break;
        case "edit":
          this.isShowSetInfoDialog = true;
          break;
        case "import":
          this.filedialogVisible = true;
          break;
        case "export":
          this.exportExcel();
          break;
        case "delete": //删除
          this.deleteSelectedUserInfo()
      }
    },
    // 编辑
    editRowInfo(info) {
      this.curSelecedType = 'eidt';
      if(!!info) {
        let newForm = {...info};
        setTimeout(() => {
          for (const key in this.$refs.setOrganizationInfo.ruleForm) {
            if (Object.hasOwnProperty.call(newForm, key)) {
              if (key === 'provider_id') {
                console.log('provider_id', newForm[key])
                if (newForm[key] === 0) {
                  this.$refs.setOrganizationInfo.ruleForm[key] = ''
                } else {
                  this.$refs.setOrganizationInfo.ruleForm[key] = newForm[key]
                }
              } else {
                this.$refs.setOrganizationInfo.ruleForm[key] = newForm[key]
              }
            }
          }
          if(newForm.temp_meterial){
            this.$refs.setOrganizationInfo.ruleForm.temp_meterial = newForm.temp_meterial.toString();
          }
          this.$refs.setOrganizationInfo.ruleForm.main_id = newForm.main_id
          if(newForm.vehicle_kind_ids){
            this.$refs.setOrganizationInfo.ruleForm.vehicle_kind_ids = newForm.vehicle_kind_ids.split(',').map(Number)
          }
          console.log('this.$refs.setOrganizationInfo.ruleForm',this.$refs.setOrganizationInfo.ruleForm)
        },100)
      }
      this.isShowSetInfoDialog = true;
    },
    // 复制
    copyInfo(info) {
      this.curSelecedType = 'add';
      if(!!info) {
        let newForm = {...info};
        newForm.id = 0
        setTimeout(() => {
          for (const key in this.$refs.setOrganizationInfo.ruleForm) {
            if (Object.hasOwnProperty.call(newForm, key)) {
              this.$refs.setOrganizationInfo.ruleForm[key] = newForm[key]
            }
          }
          if(newForm.temp_meterial){
            this.$refs.setOrganizationInfo.ruleForm.temp_meterial = newForm.temp_meterial.toString();
          }
          this.$refs.setOrganizationInfo.ruleForm.main_id = newForm.main_id
          if(newForm.vehicle_kind_ids){
            this.$refs.setOrganizationInfo.ruleForm.vehicle_kind_ids = newForm.vehicle_kind_ids.split(',').map(Number)
          }
        },100)
      }
      this.isShowSetInfoDialog = true;
    },
    // 添加
    saveAddEdit(form, type, price_change_update = 2) {
      let successrMessage = '';
      if (this.curSelecedType == "add") {
        successrMessage = "添加成功";
        delete form.id
      } else {
        form.price_change_update = price_change_update
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
        .setRecordMaterial(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.reqOrgProjectList(true);
            if (type === 1) {
              this.$refs.setOrganizationInfo.closeData()
            } else {
              this.isShowSetInfoDialog = false;
            }
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          } else if (res.head.result == "203") {
            this.$confirm(res.head.describle, '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              this.saveAddEdit(form, type, 1)
            }).catch(() => {
              this.$message({
                type: 'info',
                message: '已取消更新'
              });
            });
          }else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.reqOrgProjectList(true);
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true);
    },
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.importMaterial(params)
        .then(res => {
          if(res.head.result == "200") {
            this.form = {};
            this.pageInfo.pageIndex = 1;
            this.pageInfo.pageCount = 0;
            this.reqOrgProjectList(true);
            this.filedialogVisible = false;
            this.$message({ message: res.head.describle, type: "success" });
          } else if(res.head.result == "205") {
            this.filedialogVisible = false;
            let list = res.context
            if(!!list && list.length > 0) {
              let errorData = [];
              let h = this.$createElement;
              list.forEach(element => {
                errorData.push(h('p',null,element));
              });
              this.$msgbox({
                title: `录入提示(共${list.length}条)`,
                message: h('div',{ style: `height: 300px;${list.length > 12?'overflow-y: scroll':''}`}, errorData),
                confirmButtonText: '确定',
              })
            }
          } else{
            this.filedialogVisible = false;
            this.$message({ message: res.head.describle, type: "error" });
          }
        })
    },
    // 导出Excel
    exportExcel(){
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedProjectIds ]
      if(ids.length) {
        params.ids = ids.toString()
      }
      params.main_id = this.curSelectedDepartment.id;
      this.$client.exportMaterial(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })

    },
    // 选中表格勾选框
    selectedUserList(projectList) {
      this.selectedProjectIds = [];
      projectList.forEach((item,index) => {
        this.selectedProjectIds.push(item.id)
      });
    },
    // 确定批量移除勾选
    deleteSelectedUserInfo() {
      if(this.selectedProjectIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null)
    },
    // 移除
    deleteRowInfo(info) {
      let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.selectedProjectIds
      }
      this.$client.deleteRecordMaterial(params)
        .then(res => {
          if (res.head.result == "200") {
            // if(!this.curSelectedDepartment.type) {
            //   this.pageInfo.pageIndex = 1;
            //   this.pageInfo.pageSize = 20;
            //   this.pageInfo.pageCount = 0;
            // }
            // 重新加载列表详情
            this.reqOrgProjectList(true);
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
    stateChange(data){
      console.log(data)
      //  var i = this.data.findIndex(item=>{return item.id == data.id})
      //  console.log(i)
      if(data.usable =='1'){
        this.$client.setUsableMaterial({usable:'1',id:data.id}).then(req => {
          if (req.head.result === '200') {
            this.$message({type: 'success', message: '操作成功'})
          }
          else{
            this.$message({type: 'error', message: '操作失败'})
          }
        })
      }else{
        this.$client.setUsableMaterial({usable:'2',id:data.id}).then(req => {
          if (req.head.result === '200') {
            this.$message({type: 'success', message: '操作成功'})
          }
          else{
            this.$message({type: 'error', message: '操作失败'})
          }
        })
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

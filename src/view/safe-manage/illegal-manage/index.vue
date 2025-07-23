<template>
  <div class="accident-manage">
    <div class="accident-manage-content">
      <sub-req
        ref="head"
        @on-add="addInfo"
        @on-ok="onSubmit"
        @on-export="exportFile"
        @on-delete="onDelete"
        @on-import="openImportFilePop"
      ></sub-req>

      <tr-table
        ref="table"
        :selectionShow="true"
        :data="engineData"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        @on-select-change-row="selectedList"
      >
        <template slot-scope="scope" slot="driver_name">
          <el-link type="primary" @click="jumpDriverSafetyfileManage(scope.data.driver_name)">
            {{ scope.data.driver_name }}
          </el-link>
        </template>
        <template slot-scope="scope" slot="image">
          <el-button
            type="text"
            size="mini"
            @click="checkPicture(scope.data, 'detail')"
            :disabled="!scope.data.evidences.length"
            v-if="!!scope.data.evidences && scope.data.evidences.length > 0"
          >
            图片({{ scope.data.evidences.length }})
          </el-button>
          <el-button type="text" size="mini" disabled v-else>图片(0)</el-button>
        </template>

        <template slot-scope="scope" slot="operation">
          <el-button
            type="primary"
            size="mini"
            @click="editInfo(scope.data, 'edit')"
            v-if="$isPowerShow('edit')"
          >
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="editInfo(scope.data, 'detail')">
            查看
          </el-button>
          <el-popconfirm
            @confirm="deleteViolationInfo(scope.data)"
            title="是否确删除此条记录？"
            v-if="$isPowerShow('del')"
          >
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px">
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </tr-table>

      <el-pagination
        style="margin: 5px 0; display: flex; justify-content: flex-end"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50, 100]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      ></el-pagination>
    </div>

    <div class="dialog-box">
      <!-- 添加信息 -->
      <add-dialog
        ref="addDialog"
        :dialogBool.sync="addDialogShow"
        :curChangeType="curChangeType"
        @sure-save-info="sureSaveInfo"
      ></add-dialog>
      <!-- 上传文件 导出文件弹窗组件 -->
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'违法记录'"
        @on-submit-excel="importInfoExcel"
      ></file-dialog>
      <!-- 表格自定义组件 -->
      <custom-setting
        :dialogBool.sync="customSettingVialogVisible"
        :customSettingList="customSettingList"
        :canRendererTableHeader="canRendererTableHeader"
        :customSettingShowList="customSettingShowList"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      ></custom-setting>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from './component/sub-req'
import AddDialog from './component/dialog/add-dialog'
import fileDialog from '@/components/fileDialog/file-dialog'

export default {
  name: "violation-manage",
  components: {
    subReq,
    AddDialog,
    fileDialog,
  },
  data() {
    return {
      curChangeType: 'add', //add添加  edit编辑  detail详情
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      queryform: {}, //查询表单
      engineData: [], //列表
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      addDialogShow: false, //添加信息
      isShowDrawerDialog: false, //是否显示高级筛选
      customSettingVialogVisible: false,
      customSettingList:[
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex:0,
          sortable:true
        },
        {
          id: 2,
          label: "车牌号",
          prop: "lincense_plate_number",
          width: "120",
          align: "center",
          signIndex:1,
          sortable:true
        },
        {
          id: 3,
          label: "所属部门",
          prop: "department_name",
          width: "160",
          align: "center",
          signIndex:2,
          sortable:false
        },
        {
          id: 4,
          label: "线路",
          prop: "line",
          width: "120",
          align: "center",
          signIndex:3,
          sortable:true
        },
        {
          id: 5,
          label: "违法日期",
          prop: "d_violation_date",
          width: "145",
          align: "center",
          signIndex:4,
          sortable:true
        },
        {
          id: 6,
          label: "驾驶员",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex:5,
          sortable:false
        },
        {
          id: 7,
          label: "违法地点",
          prop: "c_place",
          width: "150",
          align: "center",
          signIndex:6,
          sortable:false
        },
        {
          id: 8,
          label: "违法项目",
          prop: "violation_name",
          width: "100",
          align: "center",
          signIndex:7,
          sortable:false
        },
        {
          id: 9,
          label: "扣分",
          prop: "score",
          width: "150",
          align: "center",
          signIndex:8,
          sortable:true
        },
        {
          id: 10,
          label: "罚款",
          prop: "money",
          width: "100",
          align: "center",
          signIndex:9,
          sortable:true
        },
        {
          id: 11,
          label: "交警处理结果",
          prop: "state",
          width: "135",
          align: "center",
          signIndex:10,
          sortable:false
        },
        {
          id: 12,
          label: "备注",
          prop: "c_remark",
          width: "140",
          align: "center",
          signIndex:11,
          sortable:false
        },
        {
          id: 13,
          label: "违法证据",
          prop: "image",
          width: "135",
          align: "center",
          signIndex:12,
          sortable:false
        },
        {
          id: 20,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex:19,
          sortable:false
        }
      ],
      frontFixedNum:2, //前几行固定
      backFixedNum:1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/违章记录模板.xlsx`,
      },
      curSelectedId: '', // 当前选中的ID
      selectedIds:[], //勾选的ID
      filedialogVisible:false,//导入弹窗
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead('initialize')
      this.loadData();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
    // 跳转到驾驶员档案安全管理
    jumpDriverSafetyfileManage(driver_name){
      this.$router.push({
        name:'driver-safetyfile-manage',
        params:{
          driverName: driver_name
        }
      })
    },
    // 更新表格头部
    updateTableHeader(newestTableHeaderList) {

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
    // 打开自定义表格头部弹窗
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    // 导出Excel
    exportFile(){
      let params = Object.assign({},this.queryform);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids
      }
      this.$client.exportViolationManage(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: res.head.describle})
        }
      })
    },
     // 打开导入弹窗
    openImportFilePop() {
      this.filedialogVisible = true;
    },
     // 导入信息Excel
    importInfoExcel(val){
      // alert(JSON.stringify(val))
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      // console.log(params)
      this.$client.importViolationManage(params)
      .then(res => {
        if(res.head.result == "200") {
          this.queryform = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.loadData();
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

    // 添加信息
    addInfo(){
      this.addDialogShow = true
      this.curChangeType = 'add'
      this.$refs['addDialog'].resetData()
      this.$refs['addDialog'].activeName = 'first'
    },
    // 表格上点击编辑、查看 获取详情
    editInfo(val,type){
      this.addDialogShow = true;
      this.curChangeType = type;
      this.$refs['addDialog'].setData(val)
      this.$refs['addDialog'].activeName = 'first'
    },
    // 查看图片
    checkPicture(val,type) {
      this.addDialogShow = true;
      this.curChangeType = type;
      this.$refs['addDialog'].setData(val);
      this.$refs['addDialog'].activeName = 'second'
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
    // 查询
    onSubmit(form) {
      this.queryform = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {};
      params = Object.assign({},this.queryform);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getListViolationManage(params)
      .then(res => {
        if (res.head.result === "200") {
          this.engineData = res.context.list;
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };
        this.loading = false;
      })
    },
    // 编辑、保存信息
    sureSaveInfo(context){
      let params = {
        context: context
      };
      // console.log(params)
      // return
      if(this.curChangeType == 'add') {
        this.$client.addViolationManageInfo(params)
        .then(res => {
          if(res.head.result == '200') {
            this.queryform = {};
            this.pageInfo.pageCount = 0;
            this.pageInfo.pageIndex = 1;
            this.loadData();
            this.addDialogShow = false;
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
          }else{
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle
            })
          }
        })
      }else{
        this.$client.EditViolationManage(params)
        .then(res => {
          if(res.head.result == '200') {
            this.loadData();
            this.addDialogShow = false;
            this.$message({
              showClose: true,
              type: 'success',
              message: '保存成功'
            })
          }else{
            this.$message({
              showClose: true,
              type: "error",
              message: res.head.describle
            })
          }
        })
      }


    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.i_id)
        });
      }
    },
    // 删除
    deleteViolationInfo(row) {
      this.selectedIds = [];
      this.selectedIds.push(row.i_id)
      if(this.selectedIds.length == 1) {
        this.onDelete();
      }

    },
    // 批量删除
    onDelete() {
      if(this.selectedIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选至少一条要移除的',
          type: "warning",
        });
        return
      }

      let parmas = {
        context: this.selectedIds,
      };
      this.$client.batchDeleteViolationManage(parmas)
      .then(res => {
        if(res.head.result == '200') {
          this.selectedIds = [];
          this.loadData();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }

      })

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
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
        console.log(this.TableHeight)
      }, 60)
    }
  },
  watch:{
    scrapDialogShow() {
      if(!this.scrapDialogShow) {
        this.selectedIds = [];
        // 清除勾选
        this.$refs.table.handleSelectionChange([]);
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-manage
  width 100%
  height 100%
</style>

<template>
  <div class="inspection-content">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit">
    </sub-req>
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
    >
      <template slot-scope="scope" slot="state">
        <el-switch
          v-model="scope.data.state"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="1"
          :inactive-value="2"
          @change="stateChange(scope.data)"
          >
        </el-switch>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" style="margin-left: 10px;" v-if="$isPowerShow('edit')"  @click="editRowInfo(scope.data)">编辑</el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？"
           v-if="$isPowerShow('del') && scope.data.state == 2">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;color:red">删除</el-button>
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
    <div class="organization-project-dialog">
      <set-info-dialog
        ref="addDialog"
        :dialogBool.sync="isShowSetInfoDialog"
        :curSelecedType="curSelecedType"
        @save-add-edit="saveAddEdit"
      ></set-info-dialog>
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage="'检查内容管理'"
        @on-submit-excel="onSubmitExcel"
      ></file-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import setInfoDialog from "./component/set-info-dialog"
import fileDialog from "@/components/fileDialog/file-dialog.vue";
export default {
  name: "inspection-content",
  components: {
    subReq,
    setInfoDialog,
    fileDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      curSelecedType: 'add', //添加
      isShowSetInfoDialog: false,
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "检查项目名称",
          prop: "check_name",
          width: "150",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "项目内容",
          prop: "check_content",
          width: "130",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "技术要求",
          prop: "technical_require",
          width: "130",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "风险等级",
          prop: "risk_level_name",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "状态",
          prop: "state",
          width: "120",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 5,
        }
      ],
      loading: false,
      TableHeight:500,
      filedialogVisible:false,
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/TempFiles/检查内容管理模板.xlsx`,
      },
      form:{}, //查询表单数据

      selectedProjectIds:[], //勾选中要删除的IDs
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    })
  },
  methods: {
  
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageDayCheck({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list || []
            this.pageInfo.pageCount = res.context.total
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false;
        })
    },

    // 头部事件抛出
    openAddPage(type) {
      switch (type) {
        case "add":
          this.curSelecedType = 'add';
          this.isShowSetInfoDialog = true;
          break;
        case "import":
          this.filedialogVisible = true;
          break;
        case "delete": //删除
          this.deleteSelectedUserInfo()
          break
      }
    },
    // 编辑
    editRowInfo(info) {
      this.curSelecedType = 'eidt';
      this.isShowSetInfoDialog = true;
      this.$nextTick(() => {
        this.$refs.addDialog.setData(info)
      })
    },
    // 添加
    saveAddEdit(form) {
      let successrMessage = '';
      if (this.curSelecedType == "add") {
        successrMessage = "添加成功";
        delete form.id
      } else{
        successrMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client
      .AddOrUpdateDayCheck(params)
      .then((res) => {
        if (res.head.result == "200") {
          this.loadData();
          this.isShowSetInfoDialog = false;
          this.$message({
            showClose: true,
            message: successrMessage,
            type: "success",
          });
        } else {
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
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 导入
    onSubmitExcel(val) {
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.ImportDayCheck(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.loadData();
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
      this.$client.BatchDeleteDayCheck(params)
      .then(res => {
        if (res.head.result == "200") {
          // 重新加载列表详情
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
    stateChange(row){
      this.$client.AddOrUpdateDayCheck({context:row}).then(req => {
        if (req.head.result === '200') {
          this.loadData()
          this.$message({type: 'success', message: '操作成功'})
        }else{
          this.$message({type: 'error', message: '操作失败'})
        }
      })
    },
    //计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.inspection-content{
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="development-party-members-management">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="发展列表" name="first">
        <sub-req
          ref="head"
          @on-add="openAddPage"
          @on-ok="onSubmit"
          @open-setting-page-event="openSettingPageEvent"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="data"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
        >
          <template slot-scope="scope" slot="way">
            <span v-if="!!scope.data.way">{{scope.data.way === 1? '正常培养':'重点培养'}}</span>
          </template>
          <template slot-scope="scope" slot="sex">
            <span v-if="!!scope.data.sex">{{scope.data.sex === 1? '男':'女'}}</span>
          </template>
          <template slot-scope="scope" slot="operation">
              <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
              <el-button type="primary" size="mini" @click="editRowInfo(scope.data, 'schedule')" v-if="$isPowerShow('schedule')">进度</el-button>
              <el-button type="primary" size="mini" @click="editDocumentaryTable(scope.data)" v-if="$isPowerShow('dcumentary_table')">纪实表</el-button>
              <el-popconfirm
                @confirm="deleteRowInfo(scope.data)"
                title="确定删除此条记录吗？"
                v-if="$isPowerShow('del')">
                <el-button slot="reference" type="danger" size="mini">删除</el-button>
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
      </el-tab-pane>
      <el-tab-pane label="流程图" name="second">
        <div class="show-flex-box-r" :style="`height:${secondHeight}px`">
          <flow-chart :isShowNeedSubmitInfo="false"></flow-chart>
        </div>
      </el-tab-pane>
    </el-tabs>
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>

    <documentary-table
      ref="documentaryTable"
      :dialogBool.sync="documentaryTableShow"
    >
    </documentary-table>

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
import informationDialog from "./component/information-dialog";
import imageBox from './component/image-box'
import flowChart from "./component/flow-chart";
import documentaryTable from "./component/documentary-table";
export default {
  name: "development-party-members-management",
  components: {
    subReq,
    informationDialog,
    imageBox,
    flowChart,
    documentaryTable
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
      activeName: "first",
      loading: false,
      TableHeight: 500,
      secondHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "add",
      informationDialogTitle: "添加",
      customSettingList: [
        {
          id: 1,
          label: "发展阶段",
          prop: "ex_state",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属党组织",
          prop: "ex_oragan_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "性别",
          prop: "sex",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "出生日期",
          prop: "birthday",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "25步工作流程",
          prop: "ex_last_step",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "发展培养方式",
          prop: "way",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "300",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      documentaryTableShow: false
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
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

    handleClick(tab, event) {
      // console.log(tab, event);
      if(tab.name == "second") {
        // this.refreshSecondTableList()
      }else{
        // this.refreshTableList()
        // this.loadData();
      }
    },

    onSubmit(form) {
      this.form = form
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.ListPartyDevelop(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            // this.data = [
            //   {id: 1}
            // ]
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            // this.data = [
            //   {id: 1,phone:"110"}
            // ]
            this.loading = false;
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
    // 编辑、添加
    saveAddEdit(form) {
      let successrMessage = "";
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .AddPartyDevelopPartyDevelop(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
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
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "新增入党申请";
      this.informationDialogShow = true;
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
    // 编辑
    editRowInfo(form,type) {
      // console.log(form);
      this.curSelecedType = "edit";
      let newForm = {...form}
      for (const key in this.$refs.informationDialog.form) {
        if (Object.hasOwnProperty.call(newForm, key)) {
          this.$refs.informationDialog.form[key] = newForm[key];
          if(key == 'ex_pics') {
            this.$refs.informationDialog.form.ex_pics = !!newForm.ex_pics? newForm.ex_pics:[]
          }
        }
      }
      this.$refs.informationDialog.exStepsList = newForm.ex_steps; //流程进度
      // 设置流程步骤提交内容回显
      this.$refs.informationDialog.setFlowChartForm(form);
      // this.$refs.informationDialog.echoFlowChartForm();
      this.informationDialogTitle = "修改入党申请";
      if(type == 'schedule') {
        this.$refs.informationDialog.isCollapse = false;
      }
      setTimeout(() =>{
        this.$refs.informationDialog.$refs.flowChart.configData();
      },100)
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: [info.id]
      };
      this.$client.BatchDeletePartyDevelop(params)
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
    // 打开纪实表
    editDocumentaryTable(info) {
      setTimeout(() => {
        this.$refs.documentaryTable.setData(info);
      },100)

      this.documentaryTableShow = true;
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
        this.TableHeight = maxh - th - 90;
        this.secondHeight = maxh- 60;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.development-party-members-management {
  width: 100%;
  height: 100%;
}

.development-party-members-management /deep/ .el-tabs__item {
  width: 160px;
  // display flex
  // flex-direction row
  // justify-content center
  text-align: center;
}

.development-party-members-management /deep/ .el-tabs__nav-wrap::after {
  // content: "";
  // position: absolute;
  // left: 0;
  // bottom: 0;
  // width: 100%;
  height: 0px;
  // background-color: #E4E7ED;
  // z-index: 1;
}

.left-box {
  height: 100%;
    overflow: auto;
  // flex: 0 0 15vw;
  margin: 0 5px 0 0;
  width: 280px;
  height: 100%;
}

.center-box {
  height: 100%;
    overflow: auto;
  flex: 1;
  height: 100%;
}

</style>

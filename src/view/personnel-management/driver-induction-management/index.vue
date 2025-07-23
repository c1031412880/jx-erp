<template>
  <div class="accident-summary-statistics">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="全部" name="1">
        <sub-req
          ref="firstHead"
          :activeName="'1'"
          @on-add="opemAddPage"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="firstData"
          :tableHeaderList="customSettingList"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
        >
          <template slot-scope="scope" slot="operation">
              <el-button type="text" size="mini" @click="editRowInfo(scope.data,'edit')" :disabled="!scope.data.ex_can_edit" v-if="$isPowerShow('edit')">编辑</el-button>
              <!-- <el-button type="text" size="mini" @click="editRowInfo(scope.data,'detail')">查看</el-button> -->
              <el-popconfirm
                @confirm="deleteRowInfo(scope.data)"
                v-if="$isPowerShow('del')"
                title="确定删除此条记录吗？">
                <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;" :disabled="!scope.data.ex_can_delete" >删除</el-button>
              </el-popconfirm>
              <el-button type="text" size="mini" @click="dealWithInfo(scope.data)" style="margin-left: 5px;">{{!!scope.data.ex_can_dispose?'处理':'查看'}}</el-button>
              <el-button type="text" size="mini" @click="cancellation(scope.data)" style="margin-left: 5px;" v-if="$isPowerShow('to_void') && !!scope.data.ex_can_cancel">撤销</el-button>
          </template>
        </tr-table>
        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="this[pageInfoMap[activeName]].pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="this[pageInfoMap[activeName]].pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="this[pageInfoMap[activeName]].pageCount"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="待我处理" name="2">
        <sub-req
          ref="secondHead"
          :activeName="'2'"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="secondData"
          :tableHeaderList="customSettingList"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
        >
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" @click="editRowInfo(scope.data,'edit')" :disabled="!scope.data.ex_can_edit" v-if="$isPowerShow('edit')">编辑</el-button>
            <!-- <el-button type="text" size="mini" @click="editRowInfo(scope.data,'detail')">查看</el-button> -->
            <el-popconfirm
              @confirm="deleteRowInfo(scope.data)"
              v-if="$isPowerShow('del')"
              title="确定删除此条记录吗？">
              <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;" :disabled="!scope.data.ex_can_delete" >删除</el-button>
            </el-popconfirm>
            <el-button type="text" size="mini" @click="dealWithInfo(scope.data)" style="margin-left: 5px;">{{!!scope.data.ex_can_dispose?'处理':'查看'}}</el-button>
            <el-button type="text" size="mini" @click="cancellation(scope.data)" style="margin-left: 5px;" v-if="$isPowerShow('to_void') && !!scope.data.ex_can_cancel">撤销</el-button>
        </template>
        </tr-table>
        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="this[pageInfoMap[activeName]].pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="this[pageInfoMap[activeName]].pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="this[pageInfoMap[activeName]].pageCount"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="我已处理" name="3">
        <sub-req
          ref="thirdHead"
          :activeName="'3'"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="thirdData"
          :tableHeaderList="customSettingList"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
        >
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" @click="editRowInfo(scope.data,'edit')" :disabled="!scope.data.ex_can_edit" v-if="$isPowerShow('edit')">编辑</el-button>
            <!-- <el-button type="text" size="mini" @click="editRowInfo(scope.data,'detail')">查看</el-button> -->
            <el-popconfirm
              @confirm="deleteRowInfo(scope.data)"
              v-if="$isPowerShow('del')"
              title="确定删除此条记录吗？">
              <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;" :disabled="!scope.data.ex_can_delete" >删除</el-button>
            </el-popconfirm>
            <el-button type="text" size="mini" @click="dealWithInfo(scope.data)" style="margin-left: 5px;">{{!!scope.data.ex_can_dispose?'处理':'查看'}}</el-button>
            <el-button type="text" size="mini" @click="cancellation(scope.data)" style="margin-left: 5px;" v-if="$isPowerShow('to_void') && !!scope.data.ex_can_cancel">撤销</el-button>
        </template>
        </tr-table>
        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="this[pageInfoMap[activeName]].pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="this[pageInfoMap[activeName]].pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="this[pageInfoMap[activeName]].pageCount"
        >
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="我发起的" name="4">
        <sub-req
          ref="fourthHead"
          :activeName="'4'"
          @on-ok="onSubmit"
        ></sub-req>
        <tr-table
          :selectionShow="false"
          :data="fourthData"
          :tableHeaderList="customSettingList"
          :isShowBottomOptions="false"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="1"
        >
          <template slot-scope="scope" slot="operation">
            <el-button type="text" size="mini" @click="editRowInfo(scope.data,'edit')" :disabled="!scope.data.ex_can_edit" v-if="$isPowerShow('edit')">编辑</el-button>
            <!-- <el-button type="text" size="mini" @click="editRowInfo(scope.data,'detail')">查看</el-button> -->
            <el-popconfirm
              @confirm="deleteRowInfo(scope.data)"
              v-if="$isPowerShow('del')"
              title="确定删除此条记录吗？">
              <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;" :disabled="!scope.data.ex_can_delete" >删除</el-button>
            </el-popconfirm>
            <el-button type="text" size="mini" @click="dealWithInfo(scope.data)" style="margin-left: 5px;">{{!!scope.data.ex_can_dispose?'处理':'查看'}}</el-button>
            <el-button type="text" size="mini" @click="cancellation(scope.data)" style="margin-left: 5px;" v-if="$isPowerShow('to_void') && !!scope.data.ex_can_cancel">撤销</el-button>
        </template>
        </tr-table>
        <el-pagination
          style="margin: 5px 0;display:flex; justify-content: flex-end;"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          ref="paginationH"
          :current-page="this[pageInfoMap[activeName]].pageIndex"
          :page-sizes="[10, 20, 30, 40, 50, 100]"
          :page-size="this[pageInfoMap[activeName]].pageSize"
          layout="total,sizes, prev, pager, next, jumper"
          :total="this[pageInfoMap[activeName]].pageCount"
        >
        </el-pagination>
      </el-tab-pane>
    </el-tabs>
    <div class="dialog-box">
      <information-dialog
        ref="informationDialog"
        :dialogBool.sync="informationDialogShow"
        :curSelecedType="curSelecedType"
        :title="informationDialogTitle"
        @save-add-edit="saveAddEdit"
      >
      </information-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "driver-induction-management",
  components: {
    subReq,
    informationDialog
  },
  data() {
    return {
      pageInfoMap:{
        '1': 'firstPageInfo',
        '2': 'secondPageInfo',
        '3': 'thirdPageInfo',
        '4': 'fourthPageInfo',
      },
      firstPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      secondPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      thirdPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      fourthPageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      activeName: "1",
      form: {},
      dataMap:{
        '1': 'firstData',
        '2': 'secondData',
        '3': 'thirdData',
        '4': 'fourthData',
      },
      firstData: [],
      secondData: [],
      thirdData: [],
      fourthData: [],
      loading: false,
      TableHeight: 500,
      customSettingList: [
        {
          id: 1,
          label: "驾驶员姓名",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "工号",
          prop: "c_worker_id",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "ex_department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "性别",
          prop: "c_gender",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "进单位日期",
          prop: "d_join_company",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "联系方式",
          prop: "c_phone",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "出生日期",
          prop: "d_birthday",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "身份证号",
          prop: "c_idcord",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "档案编号",
          prop: "c_da_code",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "发起人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "发起时间",
          prop: "d_created_date",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "完成时间",
          prop: "d_finish_date",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: true,
        },
        {
          id: 13,
          label: "流程状态",
          prop: "ex_state",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "入职状态",
          prop: "ex_entry_state",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex: 14,
          sortable: false,
        }
      ],
      frontFixedNum: 1, //前几行固定
      informationDialogShow: false,
      curSelecedType: 'add',
      informationDialogTitle: '驾驶员入职申请单',
    };
  },
  mounted() {
    // this.loadData();
    this.$refs.firstHead.onSubmit();
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      // 监听审批详情审批后的消息
      eventOn.$on('update-upcoming-matter', () => {
        this.loadData()
      })

    });
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event);
      this[this.pageInfoMap[this.activeName]].pageIndex = 1;
      switch (tab.name) {
        case '1':
          this.$refs.firstHead.onSubmit();
          break;
        case '2':
          this.$refs.secondHead.onSubmit();
          break;
        case '3':
          this.$refs.thirdHead.onSubmit();
          break;
        case '4':
          this.$refs.fourthHead.onSubmit();
          break;
      }
    },
    onSubmit(form) {
      this.form = form
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;

      let params = Object.assign({}, this.form);
      params.state = Number(this.activeName);
      params.page_index = this[this.pageInfoMap[this.activeName]].pageIndex;
      params.page_size = this[this.pageInfoMap[this.activeName]].pageSize;
      this.$client.ListDriverEntry(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this[this.dataMap[this.activeName]] = res.context.list || [];
            this[this.pageInfoMap[this.activeName]].pageCount = res.context.total;

          } else {
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
    // 分页切换事件
    handleCurrentChange(idx) {
     this[this.pageInfoMap[this.activeName]].pageIndex = idx;
      this.loadData();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
     this[this.pageInfoMap[this.activeName]].pageIndex = 1;
     this[this.pageInfoMap[this.activeName]].pageSize = sizes;
     this[this.pageInfoMap[this.activeName]].pageCount = 0;
     this.loadData();
    },
    // 打开入职申请弹窗
    opemAddPage() {
      this.curSelecedType = 'add'
      this.informationDialogShow = true
    },
    // 编辑
    editRowInfo(form,type) {
      this.curSelecedType = type;
      this.$refs.informationDialog.setData(form);

      if(type == 'edit') {
        this.informationDialogTitle = "修改驾驶员入职申请单";
      }else{
        this.informationDialogTitle = "驾驶员入职申请单详情";
      }

      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.i_id
      }
      this.$client.BatchDeleteDriverEntry(params)
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

    // 打开处理、查看页面
    dealWithInfo(info) {
      this.$router.push({
        path: `/news-details/${info.i_id}/驾驶员入职审批详情/100`,
        params: {id: info.i_id, model: 100}
      })
    },

    // 编辑、添加
    saveAddEdit(form,approveStepList) {
      if(approveStepList.length > 0) {
        let params = {
          context: approveStepList
        }
        this.$client.StartFlowRecord(params).then(res => {
          if(res.head.result == '200') {
            form.i_flow_id = res.context.id
            form.c_flow_code = res.context.code
            form.is_start_flow = true
            if(!!form.c_flow_code && !!form.c_flow_code) {
              this.canSubmitInfo(form);
            }
          }else{
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
      }else{
        delete form.i_flow_id
        delete form.c_flow_code
        this.canSubmitInfo(form);
      }
    },
    // 提交保存
    canSubmitInfo(form) {
      let parmas = {
        context: form
      };
      this.$client.AddOrEditDriverEntry(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
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
    // 申请流程撤销（作废）
    cancellation(info) {
      // let params = {
      //   context: [info.i_id]
      // }
      // this.$client.BatchDisabledDriverEntry(params)
      // .then(res => {
      //   if(res.head.result == '200') {
      //     this.loadData();
      //     this.$message({
      //       showClose: true,
      //       message: res.head.describle,
      //       type: "success",
      //     });
      //   }else{
      //     this.$message({
      //       showClose: true,
      //       message: res.head.describle,
      //       type: "success",
      //     });
      //   }
      // })

      this.$confirm('此操作将撤回这条审批记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$client.CancelFlowRecord({ context: info.i_flow_id }).then((req) => {
          if (req.head.result === "200") {
            this.loadData();
            eventOn.$emit('update-upcoming-matter')
            this.$message({
              message: req.head.describle,
              type: "success",
            });
          } else {
            this.$message.error(req.head.describle);
          }
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消撤回'
        });
      });
    },

    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = 0;
        switch (this.activeName) {
          case '1':
            th = this.$refs.firstHead.$el.offsetHeight;
            break;
          case '2':
            th = this.$refs.secondHead.$el.offsetHeight;
            break;
        
          case '3':
            th = this.$refs.thirdHead.$el.offsetHeight;
            break;
        
          case '4':
            th = this.$refs.fourthHead.$el.offsetHeight;
            break;
        }
        this.TableHeight = maxh - th - 50 - 40;
      }, 60);
    },
  },
  watch:{
    activeName() {
      this.setHead();
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.accident-summary-statistics {
  width: 100%;
  height: 100%;
}

.accident-summary-statistics /deep/ .el-tabs__item {
  width: 160px;
  text-align: center;
}

.accident-summary-statistics /deep/ .el-tabs__nav-wrap::after {
  height: 0px;
}
</style>

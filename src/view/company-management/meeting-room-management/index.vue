<template>
  <div class="meeting-room-management">
    <sub-req
      ref="head"
      @on-add="openAddJobPage"
      @on-ok="onSubmit"
      @delete-Job="deleteInfo"
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
      @on-select-change-row="selectedUpkeepPlanList"
    >
      <template slot-scope="scope" slot="need_check">
        <span>{{!!scope.data.need_check?'否':'是'}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-button type="primary" size="mini" @click="checkuseHistory(scope.data)">历史记录</el-button>
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

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>
    <use-history-dialog
      ref="useHistoryDialog"
      :dialogBool.sync="useHistoryDialogShow"
      :listReserveHistoryData="listReserveHistoryData"
    ></use-history-dialog>

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
import useHistoryDialog from "./component/use-history-dialog";
export default {
  name: "meeting-room-management",
  components: {
    subReq,
    informationDialog,
    useHistoryDialog,
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
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      useHistoryDialogShow: false,
      customSettingList: [
        {
          id: 1,
          label: "会议室名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "会议室位置",
          prop: "position",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "容纳人数",
          prop: "capacity",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "会议室负责人",
          prop: "ex_duty_person",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "负责人联系电话",
          prop: "duty_phone",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "是否需要审批",
          prop: "need_check",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "审批人",
          prop: "ex_check_person",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
         {
          id: 8,
          label: "会议室设备",
          prop: "ex_equipment_name",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "操作",
          prop: "operation",
          width: "260",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      selectIds:[],
      listReserveHistoryData:[], //当前选中会议室使用历史记录
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData();
      this.setHead('initialize')
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

    onSubmit(form) {
      this.form = form
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
      this.$client.listMeetingRoom(params)
        .then(res => {
          // console.log(JSON.stringify(res));
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
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
        .addMeetingRoom(parmas)
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
    // 批量删除
    deleteInfo() {
      if(this.selectIds.length == 0) {
        this.$message({
          showClose: true,
          message: '请勾选要删除的会议室',
          type: "warning",
        });
        return
      }
      this.deleteRowInfo(null);
    },
    // 刷新
    restTableList() {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddJobPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加会议室";
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
    selectedUpkeepPlanList(list) {
      this.selectIds = [];
      list.forEach((item,index) => {
        this.selectIds.push(item.id)
      });
    },

    // 编辑
    editRowInfo(form) {
      // console.log(form);
      this.curSelecedType = "edit";
      let newForm = {...form};
      if(!form.use) {
        newForm.ex_person_ids = [];
      }
      setTimeout(() => {
        for (const key in this.$refs.informationDialog.form) {
          if (Object.hasOwnProperty.call(newForm, key)) {
            this.$refs.informationDialog.form[key] = newForm[key]
          }
        }
      },100)
      this.informationDialogTitle = "编辑会议室";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: []
      };
      if(!!info) {
        params.context[0] = info.id
      }else{
        params.context = this.selectIds
      }
      this.$client.batchDeleteMeetingRoom(params)
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
    checkuseHistory(info) {
      this.useHistoryDialogShow = true;
      if(info.id) {
        this.reqListReserveHistory(info.id)
      }
    },
    reqListReserveHistory(meeting_id) {
      let params = {
        meeting_id: meeting_id
      }

      this.$client.listReserveHistoryMeetingRoom(params)
      .then(res => {
        if (res.head.result == "200") {
          this.listReserveHistoryData = res.context.list;
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
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
        this.TableHeight = maxh - th - 30;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.meeting-room-management {
  width: 100%;
  height: 100%;
}
</style>

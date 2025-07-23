<template>
  <div class="meeting-room-management">
    <sub-req
      ref="head"
      @on-add="openAddJobPage"
      @on-ok="onSubmit"
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
      <template slot-scope="scope" slot="state">
        <span>{{!!scope.data.state?'使用中':'未使用'}}</span>
      </template>
      <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data,1)" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data,2)">详情</el-button>
          <!-- <el-button type="primary" size="mini" @click="checkuseHistory(scope.data)">历史记录</el-button> -->
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="删除此车辆所有相关借车记录也一并删除"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini"  :disabled="!!scope.data.state" style="margin-left: 10px;">删除</el-button>
          </el-popconfirm>
      </template>
    </tr-table>

    <!-- <el-pagination
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
    </el-pagination> -->
    
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :title="informationDialogTitle"
      :curSelecedType="curSelecedType"
      @save-add-edit="saveAddEdit"
      :disabled="disabled"
    >
    </information-dialog>




    <!-- <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog> -->
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
  name: "utility-vehicle-management",
  components: {
    subReq,
    informationDialog,
    useHistoryDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 300,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      useHistoryDialogShow: false,
      customSettingList: [
        {
          id: 1,
          label: "车辆状态",
          prop: "use_state_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车辆别名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "公车车型",
          prop: "kind",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "车牌号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "车辆容量",
          prop: "max_count",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "停放位置",
          prop: "last_position",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
         {
          id: 7,
          label: "管理员",
          prop: "duty_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },

        {
          id: 8,
          label: "管理员电话",
          prop: "duty_phone",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
         {
          id: 9,
          label: "里程/km",
          prop: "last_mile",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "加油类型",
          prop: "oil_kind_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
         {
          id: 11,
          label: "车架号",
          prop: "chassis_number",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "发动机号",
          prop: "engine_number",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
         {
          id: 13,
          label: "购置日期",
          prop: "buy_date",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: true,
        },

        {
          id: 14,
          label: "上次年检时间",
          prop: "last_check",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
         {
          id: 15,
          label: "上次保养时间",
          prop: "last_maintain",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "操作",
          prop: "operation",
          width: "260",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      filedialogVisible: false,
      selectIds:[],
      listReserveHistoryData:[], //当前选中公车使用历史记录
      disabled: false
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.loadData();
      this.setHead('initialize')
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      // 审批后更新表格
      eventOn.$on('update-upcoming-utility-vehicle', () => {
        this.loadData()
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
      this.$client.getByPageBusManage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
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
      console.log(JSON.parse(JSON.stringify(form)));
      this.$client
        .setRecordBusManage(parmas)
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
    // // 批量删除
    // deleteInfo() {
    //   if(this.selectIds.length == 0) {
    //     this.$message({
    //       showClose: true,
    //       message: '请勾选要删除的公车信息',
    //       type: "warning",
    //     });
    //     return
    //   }
    //   this.deleteRowInfo(null);
    // },
    // 刷新
    restTableList() {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddJobPage() {
      this.curSelecedType = "add";
      this.informationDialogTitle = "添加公车";
      this.informationDialogShow = true;
      this.disabled = false
    },
    editRowInfo(row,type) {
      if (type == 1) {
        this.curSelecedType = "edit";
        this.informationDialogTitle = "编辑公车";
        this.disabled = false
      } else {
        this.curSelecedType = "show";
        this.informationDialogTitle = "查看公车";
        this.disabled = true
      }
      this.informationDialogShow = true;
      setTimeout(() => {
        this.$refs.informationDialog.setData(row)
      }, 150);
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

    // // 编辑
    // editRowInfo(form) {
    //   // console.log(form);
    //   this.curSelecedType = "edit";
    //   let newForm = {...form};
    //   if(!form.use) {
    //     newForm.ex_person_ids = [];
    //   }
    //   setTimeout(() => {
    //     for (const key in this.$refs.informationDialog.form) {
    //       if (Object.hasOwnProperty.call(newForm, key)) {
    //         this.$refs.informationDialog.form[key] = newForm[key]
    //       }
    //     }
    //   },100)
    //   this.informationDialogTitle = "编辑公车";
    //   this.informationDialogShow = true;
    // },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: []
      };
      if(!!info) {
        params.context.push(info.id)
      }else{
        params.context = this.selectIds
      }
      this.$client.deleteRecordBusManage(params)
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
    reqListReserveHistory(bus_id) {
      let params = {
        bus_id: bus_id,
        type:1
      }

      this.$client.getUseRecordBusManage(params)
      .then(res => {
        if (res.head.result == "200") {
          this.listReserveHistoryData = [...res.context.finished,...res.context.reserved];
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
        this.TableHeight = maxh - th;
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

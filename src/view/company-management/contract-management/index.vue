<template>
  <div class="renting-house-management">
    <sub-req
      ref="head"
      @on-add="openAddPage"
      @on-ok="onSubmit"
      @add-reminder-settings="openReminderSettings"
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
    >
      <template slot-scope="scope" slot="state">
        <span v-if="!!scope.data.state">{{scope.data.state === 1? '未出租':'已出租'}}</span>
      </template>
      <template slot-scope="scope" slot="rise_rate">
        <span v-if="!!scope.data.rise_rate || scope.data.rise_rate == 0">{{scope.data.rise_rate}}%</span>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'detail')" v-if="$isPowerShow('search')">详情</el-button>
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'edit')" v-if="$isPowerShow('edit') &&　scope.data.state === 1">编辑</el-button>

          <el-button type="primary" size="mini" @click="openContractPaymentDialog(scope.data)" v-if="$isPowerShow('pay') &&　scope.data.state === 1">缴费</el-button>

          <el-popconfirm
            @confirm="suerCancleContract(scope.data)"
            title="确定解除此合同吗？"
            v-if="scope.data.state === 1 && $isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px">解除合同</el-button>
          </el-popconfirm>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="scope.data.state === 2 && $isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px">删除</el-button>
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

    <div class="dialog-content-box">
      <el-dialog
        :visible.sync="centerDialogVisible"
        width="300px"
        center>
        <span style="display: block; text-align: center; font-size:20px;font-weight:700">请选择合同类型</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="openInformationDialog(1)">广告合同</el-button>
          <el-button type="primary" @click="openInformationDialog(2)">租房合同</el-button>
        </span>
      </el-dialog>
    </div>

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit="saveAddEdit"
    ></information-dialog>
    <reminder-settings-dialog
      ref="reminderSettingsDialog"
      :dialogBool.sync="isShowReminderSettings"
      @save-add-edit-reminder="saveAddEditReminder"
    ></reminder-settings-dialog>
    <contract-payment-dialog
      ref="contractPaymentDialog"
      :dialogBool.sync="isShowContractPaymentDialog"
      @save-payment="savePayment"
    ></contract-payment-dialog>

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
import reminderSettingsDialog from "./component/reminder-settings-dialog";
import contractPaymentDialog from "./component/contract-payment-dialog";
export default {
  name: "contract-management",
  components: {
    subReq,
    informationDialog,
    reminderSettingsDialog,
    contractPaymentDialog
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
      customSettingList: [
        {
          id: 1,
          label: "合同编号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "合同名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "开始日期",
          prop: "start_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "结束日期",
          prop: "end_date",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },

        {
          id: 5,
          label: "客户名称",
          prop: "customer_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "联系人",
          prop: "customer_person",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "联系人电话",
          prop: "customer_phone",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "合同金额",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "收款方式",
          prop: "way_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "合同状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "合同类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "合同车辆",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "合同房屋",
          prop: "house_name",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "合同金额年递增率",
          prop: "rise_rate",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "创建人",
          prop: "created_name",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "创建时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "操作",
          prop: "operation",
          width: "315",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      centerDialogVisible: false,
      isShowReminderSettings: false,
      isShowContractPaymentDialog: false
    };
  },
  mounted() {
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
      this.$client.getByPageContract(params)
        .then(res => {
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
        .setRecordContract(parmas)
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
      this.informationDialogTitle = "新增房源";
      this.centerDialogVisible = true;
      // this.informationDialogShow = true;
    },
    // 打开添加合同信息页面
    openInformationDialog(type) {
      this.curSelecedType = 'add';
      this.informationDialogTitle =  `新增${type === 1? '广告':'租房'}合同`;
      this.$refs.informationDialog.form.type= type;
      this.informationDialogShow = true;
      setTimeout(() => {
        this.centerDialogVisible = false;
      },100)
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
      this.curSelecedType = type;
      let newForm = {...form}
      for (const key in this.$refs.informationDialog.form) {
        if (Object.hasOwnProperty.call(newForm, key)) {
          this.$refs.informationDialog.form[key] = newForm[key];
          if(newForm.type == 1 && !!newForm.vehicles && newForm.vehicles.length) {
             this.$refs.informationDialog.form.vehicle_ids = newForm.vehicles.map(item => {
               return item.vehicle_id
             })
          }
        }
      }
      if(type == 'edit') {
        this.informationDialogTitle = "修改合同";
      }else if(type == 'detail') {
        this.informationDialogTitle = "合同详情";
        this.$refs.informationDialog.contractPaymentData = !!form.fee_records? form.fee_records : []
      }

      this.informationDialogShow = true;
    },
    // 解除合同
    suerCancleContract(info) {
      let params = {
        context: [info.id]
      };
      this.$client.relieveRecordContract(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: "解除合同成功",
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
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: [info.id]
      };
      this.$client.deleteRecordContract(params)
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
    // 打开提醒设置
    openReminderSettings() {
      this.isShowReminderSettings = true
    },
    // 添加提醒设置
    saveAddEditReminder(form,isedit) {
      let parmas = {
        context: form
      }
      if(isedit) {
        this.$client
        .UpdateRuleMessageRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.isShowReminderSettings = false;
            this.$message({
              showClose: true,
              message: isedit? '修改成功':'添加成功',
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
      }else{
        this.$client
        .AddRuleMessageRule(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.isShowReminderSettings = false;
            this.$message({
              showClose: true,
              message: isedit? '修改成功':'添加成功',
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
      }

    },
    // 打开合同缴费弹窗
    openContractPaymentDialog(info) {
      this.isShowContractPaymentDialog = true
      this.$refs.contractPaymentDialog.form.main_id = info.id
      this.$refs.contractPaymentDialog.form.fee = info.fee
    },
    // 保存缴费
    savePayment(form) {
      let parmas = {
        context: form
      }
      this.$client.AddFeeContract(parmas).then((res) => {
        if (res.head.result == "200") {
          this.loadData();
          this.isShowContractPaymentDialog = false;
          this.$message({
            showClose: true,
            message:'添加缴费成功',
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
.renting-house-management {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div class="bicycle-ic-management">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    >
      <template slot-scope="scope" slot="operation">
        <div style="text-align: left;">
          <el-button type="primary" size="mini" @click="rowInfo(scope.data)">查看</el-button>
          <el-button
            type="primary"
            size="mini"
            @click="handleCardAction(scope.data)"
          >
            {{ getButtonText(scope.data.CardStatus) }}
          </el-button>
        </div>
      </template>
      <template slot-scope="scope" slot="CARD_TYPE">
        <span>{{ getCardTypeName(scope.data.CARD_TYPE) }}</span>
      </template>
      <template slot-scope="scope" slot="CardStatus">
        <span :class="{'green-text': scope.data.CardStatus === '正常', 'red-text': scope.data.CardStatus !== '正常'}">
          {{ scope.data.CardStatus }}
        </span>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0; display: flex; justify-content: flex-end;"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[10, 20, 30, 40, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      ref="paginationH"
    >
    </el-pagination>
    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
    ></information-dialog>
    <refund-dialog
      ref="refundDialog"
      :dialogBool.sync="refundDialogShow"
      :curSelecedType="curSelecedType"
      :title="refundDialogTitle"
    ></refund-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import refundDialog from "./component/refund-dialog.vue"
export default {
  name: "bicycle-ic-management",
  components:{
    subReq,
    informationDialog,
    refundDialog
  },
  data() {
    return {
      form: {},
      data: [],
      loading:false,
      TableHeight:500,
      informationDialogShow:false,
      refundDialogShow:false,
      curSelecedType: 'add',
      refundDialogTitle: "退卡操作",
      informationDialogTitle: '编辑',
      icSettingList: [
        {
          id: 1,
          label: "卡状态",
          prop: "CardStatus",
          width: "90",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "序列号",
          prop: "SerialNumber",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "卡号",
          prop: "CardNumber",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "售卡时间",
          prop: "CardSaleTime",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "顾客姓名",
          prop: "CustomerName",
          width: "90",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "联系电话",
          prop: "ContactNumber",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "工作单位",
          prop: "WorkUnit",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "身份证号",
          prop: "IdCardNumber",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "通讯地址",
          prop: "MailingAddress",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "卡类型",
          prop: "CARD_TYPE",
          width: "80",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "保证金",
          prop: "Deposit",
          width: "80",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "总充值额",
          prop: "TotalTopUpAmount",
          width: "80",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "总交易额",
          prop: "TotalTransactionAmount",
          width: "80",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "卡内余额",
          prop: "CardBalance",
          width: "80",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "退卡时间",
          prop: "Time",
          width: "160",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
        {
          id: 16,
          label: "退还金额",
          prop: "return_card_money",
          width: "80",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "操作员",
          prop: "Operator",
          width: "90",
          align: "center",
          signIndex: 16,
          sortable: false,
        },
        {
          id: 18,
          label: "退款类型",
          prop: "RefundType",
          width: "100",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "注销类型",
          prop: "CancellationType",
          width: "80",
          align: "center",
          signIndex: 18,
          sortable: false,
        },
        {
          id: 20,
          label: "操作",
          prop: "operation",
          width: "210",
          align: "center",
          signIndex: 19,
          sortable: false,
        },
      ],
      cardTypeMap: {
        1: '市民卡',
        2: '团体卡',
        3: '本地卡',
        4: '临时卡',
        5: '公交卡',
      },
      frontFixedNum: 0, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [],
      icSettingShowList: false,
      page: 1, // 当前页码
      pageSize: 20, // 每页显示条数
      total: 0, // 总条数
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead("initialize");
      window.eventOn.$on("view-resize" + this.$route.fullPath, () => {
        this.setHead();
      });
    });
    this.loadData();
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.icSettingShowList = null;
      this.icSettingShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing, index) => {
        let obj = {
          id: index + 1,
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
    // 查询
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.page = 1; // 重置页码
      this.total = 0; // 重置总条数
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form, {
        page_index: this.page,
        page_size: this.pageSize,
      });
      this.$client.GetBicycleIcByPageBicycleManage({ context: params })
        .then((res) => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.total = res.context.total; // 接口返回总条数
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if (type == 'initialize') {
        this.canRendererTableHeader = this.icSettingList;
        this.icSettingShowList = this.icSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph; // 动态计算表格高度
      }, 60);
    },
    // 初始化并显示信息对话框
    rowInfo(form) {
      this.curSelecedType = 'detail';
      let newForm = JSON.parse(JSON.stringify(form));
      const mapping = {
        serial_number: 'SerialNumber',
        card_number: 'CardNumber',
        sale_time: 'CardSaleTime',
        return_time:'Time',
        customer_name: 'CustomerName',
        phone: 'ContactNumber',
        work_unit: 'WorkUnit',
        id_card: 'IdCardNumber',
        address: 'MailingAddress',
        card_type: 'CARD_TYPE',
        balance_status: 'STATE',
        card_status: 'CardStatus',
        recharge_total: 'TotalTopUpAmount',
        transaction_total: 'TotalTransactionAmount',
        card_balance: 'CardBalance',
      };
      for (const key in mapping) {
        if (Object.hasOwnProperty.call(newForm, mapping[key])) {
          this.$refs.informationDialog.form[key] = newForm[mapping[key]];
        }
      }
      this.informationDialogTitle = "违章详细信息";
      this.informationDialogShow = true;
    },
    handleCardAction(data) {
      // 根据卡状态执行不同的操作
      if (data.CardStatus === '正常' || data.CardStatus === '挂失') {
        // 打开退卡对话框
        this.curSelecedType = 'refund';
        let newForm = JSON.parse(JSON.stringify(data));
        const mapping = {
          card_number: 'CardNumber',
          transaction_id: 'TransactionId',
          card_type: 'CARD_TYPE',
          sale_time: 'CardSaleTime',
          return_time:'Time',
          customer_name: 'CustomerName',
          id_card: 'IdCardNumber',
          work_unit: 'WorkUnit',
          phone: 'ContactNumber',
          address: 'MailingAddress',
          card_balance: 'CardBalance',
          is_refund: 'IsRefund',
          deposit: 'Deposit',
          cancellation_type: 'CancellationType',
          return_card_money: 'return_card_money',
          commission: 'commission',
          return_money: 'return_money',
          return_type: 'RETURN_CAUSE',
          serial_number: 'SerialNumber'
        };
        for (const key in mapping) {
          if (Object.hasOwnProperty.call(newForm, mapping[key])) {
            this.$refs.refundDialog.form[key] = newForm[mapping[key]];
          }
          if(key == 'cancellation_type') {
            this.$refs.refundDialog.form[key] = newForm[mapping[key]] === '其他' ? 2 : newForm[mapping[key]] === '无卡注销' ? 1 : '';
          }
        }
        this.refundDialogTitle = "退卡操作";
        this.refundDialogShow = true;
      } else {
        // 打开退卡详情对话框
        this.curSelecedType = 'detail';
        let newForm = JSON.parse(JSON.stringify(data));
        const mapping = {
          card_number: 'CardNumber',
          transaction_id: 'TransactionId',
          card_type: 'CARD_TYPE',
          sale_time: 'CardSaleTime',
          return_time:'Time',
          customer_name: 'CustomerName',
          id_card: 'IdCardNumber',
          work_unit: 'WorkUnit',
          phone: 'ContactNumber',
          address: 'MailingAddress',
          card_balance: 'CardBalance',
          is_refund: 'IsRefund',
          deposit: 'Deposit',
          cancellation_type: 'CancellationType',
          return_card_money: 'return_card_money',
          commission: 'commission',
          return_money: 'return_money',
          return_type: 'RETURN_CAUSE',
          serial_number: 'SerialNumber'
        };
        for (const key in mapping) {
          if (Object.hasOwnProperty.call(newForm, mapping[key])) {
            this.$refs.refundDialog.form[key] = newForm[mapping[key]];
          }
          if(key == 'cancellation_type') {
            this.$refs.refundDialog.form[key] = newForm[mapping[key]] === '其他' ? 2 : newForm[mapping[key]] === '无卡注销' ? 1 : '';
          }
        }
        this.refundDialogTitle = "退卡详情";
        this.refundDialogShow = true;
      }
    },
    getButtonText(state) {
      // 根据卡状态返回按钮文本
      if (state === '正常' || state === '挂失') {
        return '退卡';
      } else {
        return '退卡详情';
      }
    },
    handleSizeChange(newPageSize) {
      this.pageSize = newPageSize;
      this.page = 1; // 切换每页条数时重置页码
      this.loadData();
    },
    handleCurrentChange(newPage) {
      this.page = newPage;
      this.loadData();
    },
    getCardTypeName(cardType) {
      const cardTypeMap = {
        1: '市民卡',
        2: '团体卡',
        3: '本地卡',
        4: '临时卡',
        5: '公交卡',
      };
      return cardTypeMap[cardType];
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.bicycle-ic-management
  height 100%
  display flex
  flex-direction column

tr-table
  flex 1

.green-text
  color green
  font-weight bold
.red-text
  color red
  font-weight bold

.el-pagination
  margin-top 10px
  text-align right
</style>


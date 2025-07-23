<template>
  <div class="card-detailed-list">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="onExport"
    ></sub-req>
    <tr-table
      ref="table"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :isShowSummary="true">
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editRowInfo(scope.data)">查看</el-button>
      </template>
    </tr-table>
    <!-- <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting> -->
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fileDialog from "@/components/fileDialog/file-dialog.vue";
export default {
  name: "card-detailed-list",
  components: {
    subReq,
    fileDialog,
  },
  data() {
    return {
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "日期",
          prop: "date",
          width: "130",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "售卡",
          prop: "sell_card_total",
          width: "130",
          align: "center",
          signIndex: 1,
          nestedTablesHeader:[
            {
              id: 101,
              label: "A卡(张)",
              prop: "sell_card_a",
              width: "180",
              align: "center",
              signIndex: 100,
            },
            {
              id: 102,
              label: "B卡(张)",
              prop: "sell_card_b",
              width: "180",
              align: "center",
              signIndex: 101,
            },
            {
              id: 103,
              label: "C卡(张)",
              prop: "sell_card_c",
              width: "180",
              align: "center",
              signIndex: 102,
            },
            {
              id: 104,
              label: "金额小计(元)",
              prop: "sell_card_fee",
              width: "180",
              align: "center",
              signIndex: 103,
            },
          ]
        },
        {
          id: 3,
          label: "充值",
          prop: "sell_card_fee",
          width: "130",
          align: "center",
          signIndex: 2,
          nestedTablesHeader:[
            {
              id: 105,
              label: "数量(张)",
              prop: "recharge_count",
              width: "180",
              align: "center",
              signIndex: 104,
            },
            {
              id: 106,
              label: "金额(元)",
              prop: "recharge_fee",
              width: "180",
              align: "center",
              signIndex: 105,
            },
          ]
        },
        {
          id: 4,
          label: "注册开通",
          prop: "sell_card_fee",
          width: "130",
          align: "center",
          signIndex: 3,
          nestedTablesHeader:[
            {
              id: 107,
              label: "公交卡(张)",
              prop: "register_bus_count",
              width: "180",
              align: "center",
              signIndex: 106,
            },
            {
              id: 108,
              label: "公交卡(张)",
              prop: "register_city_count",
              width: "180",
              align: "center",
              signIndex: 107,
            },
            {
              id: 109,
              label: "金额小计(张)",
              prop: "register_fee",
              width: "180",
              align: "center",
              signIndex: 108,
            },
          ]
        },
        {
          id: 5,
          label: "应缴售卡金额(元)",
          prop: "payable_sell_fee",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "应缴充值(元)",
          prop: "payable_recharge_fee",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "换卡金额(元)",
          prop: "exchange_fee",
          width: "130",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "应缴合计(元)",
          prop: "payable_total",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "退卡、注销",
          prop: "refund_card_total",
          width: "130",
          align: "center",
          signIndex: 8,
          nestedTablesHeader:[
            {
              id: 110,
              label: "A卡(张)",
              prop: "refund_card_a",
              width: "180",
              align: "center",
              signIndex: 109,
            },
            {
              id: 111,
              label: "B卡(张)",
              prop: "refund_card_b",
              width: "180",
              align: "center",
              signIndex: 110,
            },
            {
              id: 112,
              label: "C卡(张)",
              prop: "refund_card_c",
              width: "180",
              align: "center",
              signIndex: 111,
            },
            {
              id: 113,
              label: "市民卡(张)",
              prop: "logoff_city_count",
              width: "180",
              align: "center",
              signIndex: 112,
            },
            {
              id: 114,
              label: "公交卡(张)",
              prop: "logoff_bus_count",
              width: "180",
              align: "center",
              signIndex: 113,
            },
            {
              id: 115,
              label: "退押金(元)",
              prop: "logoff_fee",
              width: "180",
              align: "center",
              signIndex: 114,
            },
            {
              id: 116,
              label: "退余额(元)",
              prop: "refund_fee",
              width: "180",
              align: "center",
              signIndex: 115,
            },
          ]
        },
        {
          id: 9,
          label: "应缴实际数(元)",
          prop: "payable_total_fee",
          width: "130",
          align: "center",
          signIndex: 8,
        },
        // {
        //   id: 10,
        //   label: "实缴金额(元)",
        //   prop: "payable_fee",
        //   width: "130",
        //   align: "center",
        //   signIndex: 9,
        // },
        // {
        //   id: 11,
        //   label: "备注",
        //   prop: "remark",
        //   width: "145",
        //   align: "center",
        //   signIndex: 10,
        // },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "130",
          align: "center",
          signIndex: 11,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
    };
  },
  mounted() {
    this.$nextTick(() => {
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
    onExport() {
      let params = Object.assign({},this.form);
      this.$client.ExportDetailBicycleManage({context:params})
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },

    // 查询
    onSubmit(form) {
      this.form = form
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      this.$client.GetDetailBicycleManage({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context
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
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
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
    // 跳转到 每日报表详情
    editRowInfo(row) {
      // this.$router.push({path:'/card-issuance-management/daily-report-filling',query:{date: row.date}})
      this.$router.push({
        name:'daily-report-filling',
        params:{
          date: row.date
        }
      })
    },
  },
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.card-detailed-list {
  width: 100%;
  height: 100%;
}
</style>

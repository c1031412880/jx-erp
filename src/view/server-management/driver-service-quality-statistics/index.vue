<template>
  <div class="driver-service-quality-statistics">
    <sub-req
      ref="head"
      @on-export="onExport"
      @on-ok="onSubmit"
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
      <template slot-scope="scope" slot="is_cancle">
        <div>{{scope.data.is_cancle ? '是' : '否'}}</div>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="checkRowInfo(scope.data)">查看</el-button>
        <el-popconfirm v-if="!scope.data.is_cancle && $isPowerShow('cancel')" @confirm="cancelRowInfoQuality(scope.data)" title="是否确认取消本季度考核？">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">取消考核</el-button>
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
      :accidentLiabilityType="accidentLiabilityType"
      :workOrderType="workOrderType"
    ></information-dialog>

  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "driver-service-quality-statistics",
  components: {
    subReq,
    informationDialog,
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
      customSettingList: [
        {
          id: 1,
          label: "驾驶员",
          prop: "driver_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "是否取消本季度星级考核",
          prop: "is_cancle",
          width: "160",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "在职状态",
          prop: "emp_state",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "所属组织",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "入职天数",
          prop: "entry_days",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "本月出勤天数",
          prop: "attendence_days",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "考评得分",
          prop: "check_socre",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "有责投诉数量",
          prop: "duty_count",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "交通违法数量",
          prop: "unlaw_count",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "有责事故经损",
          prop: "accident_fee",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      workOrderType: '',
      accidentLiabilityType: []
    };
  },
  mounted() {
    this.reqWorkOrderDataDictionary();
    this.reqAccidentLiabilityDataDictionary();
    this.$nextTick(() => {
      this.setHead('initialize')
       window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
          this.setHead()
        })
    });
  },
  methods: {
    // 获取工单类型数据字典
    reqWorkOrderDataDictionary() {
      this.workOrderType = '';
      let context = ['passenger-service-work-order-type']
      this.$client.getDictionaryDataBase({context: context}).then(req => {
        if (req.head.result === '200') {
          if (req.context.length) {
            let options = req.context[0].dic_detls;
            if(!!options && options.length) {
              try{
                options.forEach(element => {
                  if(element.c_name == '投诉') {
                    this.workOrderType = element.c_code
                    throw new Error("EndIterative");
                  }
                });

              }catch(e){}
            }
            
          }
        }
      })
    },
    // 获取事故责任数据字典
    reqAccidentLiabilityDataDictionary() {
      this.accidentLiabilityType = []
      let context = ['accident-zr']
      this.$client.getDictionaryDataBase({context: context}).then(req => {
        if (req.head.result === '200') {
          if (req.context.length) {
            let options = req.context[0].dic_detls;
            if(!!options && options.length) {
              try{
                options.forEach(element => {
                  if(element.c_name !== '无责') {
                    this.accidentLiabilityType.push(element.c_code)
                    // throw new Error("EndIterative");
                  }
                });

              }catch(e){}
            }
          }
        }
      })
    },
    // 导出
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportDriverQualityCheck(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
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
      this.$client.ListDriverQualityCheck(params)
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
    // 是否取消本季度星级考核
    cancelRowInfoQuality(row) {
      let params = {context:{}}
      params.context.driver_id = row.driver_id
      params.context.cancle_month = this.form.month
      this.$client.CancelDriverQualityCheck(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loadData()
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
    // 查看明细
    checkRowInfo(row) {
      this.$refs.informationDialog.form.month = this.form.month
      this.$refs.informationDialog.form.driver_id = row.driver_id
      this.$refs.informationDialog.form.driver_name = row.driver_name
      this.informationDialogShow = true
    },
  
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
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
.driver-service-quality-statistics {
  width: 100%;
  height: 100%;
}
</style>

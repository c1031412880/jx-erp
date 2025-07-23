<template>
  <div class="charter-statistics">
    <div class="department-detail show-flex-box-c" v-loading="loading">
      <sub-req ref="head" @on-ok="onSubmit" @on-export="onExport"></sub-req>
      <tr-table
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
        :isShowSummary="true"
        :sumTotal="sumTotal"
        :sumColumnIndex="[5, 8]"
      >
        <template slot-scope="scope" slot="chariot_type">
          <span>{{ getChariotType(scope.data.chariot_type) }}</span>
        </template>
        <template slot-scope="scope" slot="cost_settlement">
          <span>{{ haveRule ? scope.data.cost_settlement : setDeptFee(scope.data) }}</span>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button
            type="text"
            size="mini"
            style="margin-left: 10px"
            @click="editRowInfo(scope.data, 'detail')"
          >
            查看
          </el-button>
        </template>
      </tr-table>
      <el-pagination
        style="margin: 5px 0; display: flex; justify-content: flex-end"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        ref="paginationH"
        :current-page="pageInfo.pageIndex"
        :page-sizes="[10, 20, 30, 40, 50]"
        :page-size="pageInfo.pageSize"
        layout="total,sizes, prev, pager, next, jumper"
        :total="pageInfo.pageCount"
      ></el-pagination>
    </div>
    <div class="organization-project-dialog">
      <add-classify-dialog
        ref="addClassifyDialog"
        :dialogBool.sync="isShowAddClassifyDialog"
        :haveRule="haveRule"
      ></add-classify-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/utils/auth';
import subReq from "./component/sub-req";
import addClassifyDialog from "./component/add-classify-dialog"

export default {
  name: "charter-statistics",
  components: {
    subReq,
    addClassifyDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 30,
        pageCount: 0,
      },
      visible: false,
      placeholder: "请输入关键词",
      isShowRulesDialog: false,
      isShowAddClassifyDialog: false,
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 2, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "用车时间",
          prop: "use_start_time",
          width: "120",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "组织分公司",
          prop: "dept_name",
          width: "120",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "用车单位",
          prop: "use_uint",
          width: "120",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "包车类型",
          prop: "chariot_type",
          width: "130",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "用车数",
          prop: "use_count",
          width: "130",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "联系人",
          prop: "contact_person",
          width: "130",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "联系电话",
          prop: "contact_phone",
          width: "130",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "费用结算",
          prop: "cost_settlement",
          width: "130",
          align: "center",
          signIndex: 7,
        },
        {
          id: 9,
          label: "工单说明",
          prop: "work_order_description",
          width: "130",
          align: "center",
          signIndex: 8,
        },
        {
          id: 10,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 9,
        },
      ],
      loading: false,
      TableHeight:500,

      form:{}, //查询表单数据
      sumTotal: {
        5: '',
        8: ''
      }
    };
  },
  computed: {
    haveRule: function() {
      return this.$isPowerShow('all') ? true : false
    }
  },
  mounted() {
    this.setHead()
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 获取列表
    loadData() {
      this.loading = true;
      let params = Object.assign({},this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetByPageTotalChariotManage({context:params})
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list || []
          // 总分类下需要分页
          this.pageInfo.pageCount = res.context.total
          let total_fee = 0
          this.data.forEach(item => {
            total_fee += this.setDeptFee(item)
          })
          this.sumTotal = {
            5 : res.context.total_deployment_units || 0,
            8 : this.haveRule ? res.context.total_cost_settlement : total_fee,
          }
          this.loading = false;
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

    // 查看 编辑
    editRowInfo(info,type) {
      let params = {
        ids: [info.id]
      }
      this.$client.GetByPageChariotManage({context:params})
      .then(res => {
        if (res.head.result == "200") {
          let data = res.context.list[0]
          if(!this.haveRule) {
            data.sure_fee = '***'
          }else {
            data.sure_fee = data.cost_settlement
          }
          this.isShowAddClassifyDialog = true
          this.$nextTick(() => {
            this.$refs.addClassifyDialog.setData(data)
          })
        }
      })
    },
    setDeptFee(row) {
      console.log(row, 'row');

      let userInfo = JSON.parse(getUser());
      let fee = 0
      switch (userInfo.dept_name) {
        case '一分公司':
          fee = row.one_fee || 0
          break;
        case '二分公司':
          fee = row.two_fee || 0
          break;
        case '三分公司':
          fee = row.three_fee || 0
          break;
        case '四分公司':
          fee = row.four_fee || 0
          break;
        case '五分公司':
          fee = row.five_fee || 0
          break;

        default:
          break;
      }
      return fee
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
    onExport() {
      let params = Object.assign({}, this.form);
      this.$client.ExportChariotTotal({context:params}).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }

      });
    },
    getChariotType(type) {
      switch (type) {
        case 1:
          return '普通包车'
        case 2:
          return '大型用车'
        default:
          return ''
      }
    },
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh -th - 35;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.charter-statistics{
  width: 100%;
  height: 100%;
}
</style>

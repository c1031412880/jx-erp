<template>
  <el-dialog
    :visible="dialogBool"
    fullscreen
    :before-close="dialogClose"
    center
  >
    <!-- <el-page-header slot="title" @back="dialogClose" :content="showTitle" class="show-flex-box-r show-flex-center"></el-page-header> -->
    <tr-page-header ref="trPageHeader" slot="title" :content="showTitle" @back="dialogClose"></tr-page-header>
    <div class="driver-salary-detail">
      <div class="search-content">
        <el-form :inline="true" size="mini" ref="head">
          <el-form-item label="线路:">
            <get-line-select-tree
              ref="lineTree"
              :placeholder="'选择线路'"
              :isShowCheckbox="true"
              v-model="form.line_ids"
              :isExportMultiple="true"
            >
            </get-line-select-tree>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="loadData"
              >查询</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-button @click="resetForm()" icon="el-icon-refresh-left"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div class="table-content">
        <tr-table
          ref="table"
          :selectionShow="false"
          :data="salaryData"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="TableHeight"
          :loading="loading"
          :frontFixedNum="frontFixedNum"
          :backFixedNum="backFixedNum"
          :isShowSummary="true"
          :sumTotal="sumTotal"
          :sumColumnIndex="[4,5,6,7,8,9,10,11,12,13,14]"
        >
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
      </div>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getLineSelectTree from "@/components/base/formModel/tree/get-line-select-tree";
export default {
  components: {
    getLineSelectTree
  },
  props: {
    dialogBool: Boolean,
    curDriverId:{
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      showTitle: "工资详情",
      TableHeight: 500,
      loading: false,
      pageInfo: {
        pageIndex: 1,
        pageSize: 10,
        pageCount: 0,
      },
      frontFixedNum: 1,
      backFixedNum: 0,
      form:{
        line_ids: [],
        date: '',
        tree_id:''
      },
      salaryData: [],
      canRendererTableHeader: null,
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "ex_driver_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "线路",
          prop: "ex_line_name",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "班次类型",
          prop: "ex_class_type",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "日基础薪资（元）",
          prop: "ex_day_base",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "综合奖（元）",
          prop: "ex_synthesize",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "餐费补贴（元）",
          prop: "ex_meals",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "加班费（元）",
          prop: "ex_overtime",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "质量考核奖（元）",
          prop: "ex_quality_check",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "安全里程奖（元）",
          prop: "ex_safe_mile",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "精品线路考核奖（元）",
          prop: "ex_line_check",
          width: "190",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "合计（元）",
          prop: "ex_total",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "请假（班次数）",
          prop: "ex_leave",
          width: "160",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "临时请假（班次数）",
          prop: "ex_ls_leave",
          width: "190",
          align: "center",
          signIndex: 12,
          sortable:true
        },
        {
          id: 14,
          label: "实发金额（元）",
          prop: "ex_actual",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "薪资日期",
          prop: "ex_wage_date",
          width: "120",
          align: "center",
          signIndex: 14,
          sortable: false,
        }
      ],
      sumTotal:{ //约定某一列汇总合计自定义数据
        4: '',
        5: '',
        6: '',
        7: '',
        8: '',
        9: '',
        10: '',
        11: '',
        12: '',
        13: '',
        14:''
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.form.line_ids = [];
        this.$refs.lineTree.onClear();
        Object.assign(this.$data, this.$options.data());
      } else {
        if(!!this.curDriverId) {
          this.loadData();
        }
        this.$nextTick(() => {
          this.setHead();
          window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
            this.setHead()
          })
        });
      }
    },
  },
  mounted() {
    if(!!this.curDriverId) {
      this.loadData();
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    resetForm() {
      this.form.line_ids = [];
      this.$refs.lineTree.onClear();
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {
        driver_id : [this.curDriverId]
      };
      params = Object.assign(params,this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.QuerySalaryDetailSalaryList(params)
        .then(res => {
          if (res.head.result == "200") {
            console.log(res)
            this.loading = false;
            this.salaryData = res.context.list;
            this.pageInfo.pageCount = res.context.total
            this.sumTotal = {
              4 : res.context.summary.ex_day_base,
              5 : res.context.summary.ex_synthesize,
              6 : res.context.summary.ex_meals,
              7 : res.context.summary.ex_overtime,
              8 : res.context.summary.ex_quality_check,
              9 : res.context.summary.ex_safe_mile,
              10 :  res.context.summary.ex_line_check,
              11 : res.context.summary.ex_total,
              12 : res.context.summary.ex_leave,
              13: res.context.summary.ex_ls_leave,
              14 : res.context.summary.ex_actual,
            }
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
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
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        let trPageHeader = this.$refs.trPageHeader.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 100 - trPageHeader;
        // console.log(this.TableHeight);
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

<template>
  <div class="line-summary">
    <sub-req ref="head" @on-ok="onSubmit" @on-dow="tableDow"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="false"
      :data="data"
      :tableHeaderList="customSettingList"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
    </tr-table>
<!--    <el-pagination-->
<!--      style="margin: 5px 0;display:flex; justify-content: flex-end;"-->
<!--      @current-change="handleCurrentChange"-->
<!--      @size-change="handleSizeChange"-->
<!--      ref="paginationH"-->
<!--      :current-page="pageInfo.pageIndex"-->
<!--      :page-sizes="[10, 20, 30, 40, 50, 100]"-->
<!--      :page-size="pageInfo.pageSize"-->
<!--      layout="total,sizes, prev, pager, next, jumper"-->
<!--      :total="pageInfo.pageCount">-->
<!--    </el-pagination>-->
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
export default {
  name: "line-summary",
  components: {subReq},
  mounted() {
    this.$client.GetTitleOperationalAnalysis({summary_type: 1}).then(req => {
      console.log(req)
      if (req.head.result === '200') {
        this.customSettingList = req.context
      }
    })
    this.$nextTick(() => {
      this.setHead()
      // this.loadData();
    })
  },
  data() {
    //这里存放数据",
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      form: {},
      customSettingList:[],
      frontFixedNum:1, //前几行固定
      backFixedNum:1, //后几行固定
      loading: false,
      TableHeight: 500,
      data: []
    }
  },
  //方法集合",
  methods: {
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    tableDow() {
      this.$client.ExportOperationalAnalysis(this.form).then(req => {
        if (req.head.result === '200') {
          window.open(req.context)
        }
      })
    },
    loadData() {
      this.loading = true
      this.form.page_index = this.pageInfo.pageIndex
      this.form.page_size = this.pageInfo.pageSize
      this.$client.GetListOperationalAnalysis(this.form).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context
        } else {
          this.data = []
        }
      })
    },
    // 计算表格高度
    setHead() {
      this.canRendererTableHeader = this.customSettingList;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh - th ;
        console.log(this.TableHeight)
      }, 60)
    }
  },
}
</script>

<style lang="scss" scoped>
.line-summary{
  width: 100%;
  height: 100%;
}
</style>

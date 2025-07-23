<template>
  <div class="inventory-manage">
    <sub-req ref="head" @on-ok="subOk" @on-add="fixedFormBodyShow = true" @on-export="exportTable"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum">
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="showTable(scope.data)" >查看</el-button>
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
    <fixed-form-body
      ref="fixedFormBody"
      :formId="formId"
      :formName="formName"
      :isAgain="false"
      :isCommit="false"
      :dialogBool.sync="fixedFormBodyShow">
    </fixed-form-body>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fixedFormBody from "../../main-Interface-entrance/launch-affair/component/all-box/fixed-form-body/index.vue";

export default {
  name: "large-approval-form",
  components: {subReq, fixedFormBody},
  data() {
    //这里存放数据",
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      formId: 5090,
      formName: '大额审批单',
      fixedFormBodyShow: false,
      data: [],
      canRendererTableHeader: [
        {
          id: 1,
          label: "领用日期",
          prop: "date",
          width: "140",
          align: "center",
          signIndex:0
        },
        {
          id: 2,
          label: "自编号",
          prop: "vehicle_code",
          width: "140",
          align: "center",
          signIndex:1
        },
        {
          id: 3,
          label: "车牌号",
          prop: "vehicle_name",
          width: "140",
          align: "center",
          signIndex:2
        },
        {
          id: 4,
          label: "配件名称",
          prop: "part_name",
          width: "140",
          align: "center",
          signIndex:3
        },
        {
          id: 5,
          label: "单价",
          prop: "price",
          width: "140",
          align: "center",
          signIndex:4
        },
        {
          id: 6,
          label: "数量",
          prop: "count",
          width: "140",
          align: "center",
          signIndex:5
        },
        {
          id: 7,
          label: "提交时间",
          prop: "create_time",
          width: "140",
          align: "center",
          signIndex:6
        },
        {
          id: 8,
          label: "申请人",
          prop: "enter_num",
          width: "180",
          align: "center",
          signIndex:7
        },
        {
          id: 9,
          label: "所在部门",
          prop: "dept_name",
          width: "180",
          align: "center",
          signIndex:8
        },
        {
          id: 10,
          label: "审批状态",
          prop: "state_msg",
          width: "140",
          align: "center",
          signIndex:9
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "150",
          align: "center",
          signIndex:10
        },
      ],
      TableHeight: 400,
      loading: false,
      frontFixedNum: 1,
      backFixedNum: 2,
      form: {},
    }
  },
  mounted() {
    this.$nextTick(() => {
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.setHead()
      this.getMaterial()
    })
  },
  //方法集合",
  methods: {
     //获取物资
     getMaterial(warehouse_id = 0) {
      let form = {
        usable: 1
      }
      this.$client.getMaterialPage(form).then((req) => {
        if (req.head.result === "200") {
          this.materialList = req.context.list ||[];
        }else{
          this.materialList = []
        }
      });
    },
    // 导出
    exportTable(form = {}) {
      this.$client.ExportWarehouseCheck(form).then(req => {
        if (req.head.result === '200') {
          window.open(req.context)
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    // 查看初始化
    showTable(item) {
      this.$router.push({
        path: `/news-details/${item.id}/待办消息:大额汽车配件领用审批单/5090`
      })
    },
    subOk(form) {
      this.form = form
      this.pageInfo.pageIndex = 1
      this.loadData()
    },
    // 数据查询
    loadData() {
      this.form.page_size = this.pageInfo.pageSize
      this.form.page_index = this.pageInfo.pageIndex
      this.loading = true
      this.$client.GetByPage1OaVehiclePartsReceive({context:this.form}).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          this.data = req.context.list
          this.pageInfo.pageCount = req.context.total
        } else {
          this.data = []
          this.pageInfo.pageCount = 0
        }
        console.log(req)
      })
    },
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
    // 跳转到出库管理
    jumpWarehouseManagement(info){
      this.$router.push({
        name:'warehouse-management',
        params:{
          leave_num: info.leave_num,
          leave_date_start: this.form.begin,
          leave_date_end: this.form.end
        }
      })
    },
    // 跳转到入库管理
    jumpEnterhouseManagement(info){
      this.$router.push({
        name:'stock-management',
        params:{
          enter_num: info.enter_num,
          enter_date_start: this.form.begin,
          enter_date_end: this.form.end
        }
      })
    },
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight
        let th = this.$refs.head.$el.offsetHeight
        let paginationH = this.$refs.paginationH.$el.offsetHeight
        this.TableHeight = maxh - (th + paginationH)
        console.log(this.TableHeight)
      }, 60)
    }
  },
}
</script>

<style lang="scss" scoped>
.inventory-manage{
  width: 100%;
  height: 100%;
}
</style>

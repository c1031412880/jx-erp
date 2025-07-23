<template>
  <div class="inventory-manage">
    <sub-req ref="head" @on-ok="subOk" @on-add="AddInfoDialogShow = true" @on-del="allDel" @on-export="exportTable"></sub-req>
    <tr-table
      ref="table"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectedCurList">

      <template slot-scope="scope" slot="enter_num">
        <el-link type="primary" @click="jumpEnterhouseManagement(scope.data)">{{scope.data.enter_num}}</el-link>
      </template>
      <template slot-scope="scope" slot="leave_num">
        <el-link type="primary" @click="jumpWarehouseManagement(scope.data)">{{scope.data.leave_num}}</el-link>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="showTable(scope.data)" >查看</el-button>
        <el-button type="text" size="mini" @click="editTable(scope.data)" :disabled="scope.data.state == 2" v-if="$isPowerShow('edit')">编辑</el-button>

        <el-popconfirm
          @confirm="examineData([scope.data.id], 2)"
          title="是否确认审核该盘点记录？"
          v-if="scope.data.state != 2 &&　$isPowerShow('examine')">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">审核</el-button>
        </el-popconfirm>
        <!-- <el-popconfirm
          @confirm="examineData([scope.data.id], 3)"
          title="是否确认反审核该盘点记录？"
          v-if="scope.data.state == 2 && $isPowerShow('examine')">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">反审核</el-button>
        </el-popconfirm> -->
        <el-popconfirm
          @confirm="deleteData([scope.data.id])"
          title="确定删除此条信息吗？"
          v-if="scope.data.state != 2 && $isPowerShow('del')">
          <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;"
            >删除</el-button>
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

    <add-info-dialog :dialogBool.sync="AddInfoDialogShow" ref="AddInfoDialog" :materialList="materialList" @on-ok="AddInfoDialogOk"></add-info-dialog>
    <set-info-dialog :dialogBool.sync="SetInfoDialogShow" ref="SetInfoDialog" :materialList="materialList" @on-ok="AddInfoDialogOk"></set-info-dialog>
    <show-info-dialog :dialogBool.sync="ShowInfoDialogShow" :newMaterialList="materialList" :headSearchForm="form" ref="ShowInfoDialog"></show-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import AddInfoDialog from "./component/add-info-dialog";
import SetInfoDialog from "./component/set-info-dialog";
import ShowInfoDialog from "./component/show-info-dialog";

export default {
  name: "inventory-manage",
  components: {ShowInfoDialog, SetInfoDialog, AddInfoDialog, subReq},
  data() {
    //这里存放数据",
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      canRendererTableHeader: [
        {
          id: 1,
          label: "盘点仓库",
          prop: "warehouse_name",
          width: "140",
          align: "center",
          signIndex:0
        },
        {
          id: 2,
          label: "方案名称",
          prop: "plan_name",
          width: "140",
          align: "center",
          signIndex:1
        },
        {
          id: 3,
          label: "盘点日期",
          prop: "check_date",
          width: "140",
          align: "center",
          signIndex:2
        },
        {
          id: 4,
          label: "盘点类型",
          prop: "type_name",
          width: "140",
          align: "center",
          signIndex:3
        },
        {
          id: 5,
          label: "盈亏数量",
          prop: "difference_count",
          width: "140",
          align: "center",
          signIndex:4
        },
        {
          id: 6,
          label: "审核状态",
          prop: "state_name",
          width: "140",
          align: "center",
          signIndex:5
        },
        {
          id: 7,
          label: "盘点负责人",
          prop: "check_name",
          width: "140",
          align: "center",
          signIndex:6
        },
        {
          id: 8,
          label: "关联盘盈入库单号",
          prop: "enter_num",
          width: "180",
          align: "center",
          signIndex:7
        },
        {
          id: 9,
          label: "关联盘亏出库单号",
          prop: "leave_num",
          width: "180",
          align: "center",
          signIndex:8
        },
        {
          id: 10,
          label: "备注",
          prop: "remark",
          width: "140",
          align: "center",
          signIndex:9
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex:10
        },
      ],
      TableHeight: 400,
      loading: false,
      frontFixedNum: 1,
      backFixedNum: 1,
      form: {},
      AddInfoDialogShow: false,
      SetInfoDialogShow: false,
      ShowInfoDialogShow: false,
      selectList: [],
      materialList:[], //所有物资
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
    // 选中集合
    selectedCurList(list) {
      this.selectList = []
      list.forEach(item => {
        this.selectList.push(item.id)
      })
    },
    // 删除选中
    allDel() {
      this.deleteData(this.selectList)
    },
    // 删除
    deleteData(ids = []) {
      this.$client.DeleteWarehouseCheck({
        context: ids
      }).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
    },
    // 审核、取消审核
    examineData(ids,result) {
      this.$client.ReviewRecordWarehouseCheck({
        context: {
          ids: ids,
          result:result
        }
      }).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({message: req.head.describle, type: 'success'});
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
      })
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
    // 编辑初始化
    editTable(item) {
      console.log(item)
      this.$refs.SetInfoDialog.form.id = item.id
      this.$refs.SetInfoDialog.form.warehouse_id = item.warehouse_id
      this.$refs.SetInfoDialog.form.plan_name = item.plan_name
      this.$refs.SetInfoDialog.form.check_date = item.check_date
      this.$refs.SetInfoDialog.form.check_id = item.check_id
      this.$refs.SetInfoDialog.form.state = item.state
      this.$refs.SetInfoDialog.form.type = item.type
      this.$refs.SetInfoDialog.form.remark = item.remark
      this.$refs.SetInfoDialog.getDetails()
      this.SetInfoDialogShow = true
    },
    // 查看初始化
    showTable(item) {
      this.$refs.ShowInfoDialog.form.id = item.id
      this.$refs.ShowInfoDialog.form.warehouse_id = item.warehouse_id
      this.$refs.ShowInfoDialog.form.plan_name = item.plan_name
      this.$refs.ShowInfoDialog.form.check_date = item.check_date
      this.$refs.ShowInfoDialog.form.check_id = item.check_id
      this.$refs.ShowInfoDialog.form.state = item.state
      this.$refs.ShowInfoDialog.form.type = item.type
      this.$refs.ShowInfoDialog.form.remark = item.remark
      this.$refs.ShowInfoDialog.form.enter_num = item.enter_num
      this.$refs.ShowInfoDialog.form.leave_num = item.leave_num
      this.$refs.ShowInfoDialog.getDetails()
      this.ShowInfoDialogShow = true
    },
    // 盘点录入
    AddInfoDialogOk(form) {
      this.$client.CreateOrUpdateWarehouseCheck({
        context: form
      }).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({message: req.head.describle, type: 'success'});
          this.AddInfoDialogShow = false
          this.SetInfoDialogShow = false
        } else {
          this.$message({message: req.head.describle, type: 'error'});
        }
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
      this.$client.GetByPageWarehouseCheck(this.form).then(req => {
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

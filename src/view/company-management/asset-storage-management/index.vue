<template>
  <div class="asset-storage-management">
    <sub-req
      ref="head"
      @on-ok="onSubmit"
      @on-export="exportFile"
      @on-add="openAddPage">

    </sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :selectionShow="true"
      :TableHeight="TableHeight"
      :isShowBottomOptions="false"
      :backFixedNum="backFixedNum"
      :tableHeaderList="canRendererTableHeader"
      @on-select-change-row="selectedList">
      <template slot-scope="scope" slot="state_name">
        <span :style="{'color': !scope.data.state ? '#999999' : '#0CB780'}">{{ scope.data.state_name }}</span>
      </template>
      <template slot-scope="scope" slot="enter_date">
        <span>{{sliceDate(scope.data.enter_date)}}</span>
      </template>
      <template slot-scope="scope" slot="purchase_code">
        <p @click="checkApplicant(scope.data)">{{ scope.data.purchase_code }}</p>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" v-if="$isPowerShow('detail')" @click="openAddPage('check', scope.data)">查看</el-button>
        <el-button style="margin-right: 10px;" type="text" size="mini" v-if="!scope.data.state && $isPowerShow('edit')" @click="openAddPage('edit', scope.data)">编辑</el-button>
        <!-- <el-button style="margin-right: 10px" type="text" size="mini" v-if="!scope.data.state && $isPowerShow('check')" @click="auditApplicant(scope.data)">审核</el-button> -->
        <!-- <el-button type="text" size="mini" v-if="!scope.data.state" @click="deleteRow(scope.data)">删除</el-button> -->
        <el-popconfirm
          style="margin-right: 10px;"
          v-if="!scope.data.state && $isPowerShow('check')"
          title="审核后数据将会自动入库，固定资产会生成对应的编号，将不可撤回，是否确定审核？"
          @confirm="auditApplicant(scope.data)">
          <el-button slot="reference" type="text" size="mini">审核</el-button>
        </el-popconfirm> 
        <el-popconfirm
          v-if="!scope.data.state && $isPowerShow('delete')"
          title="是否确定删除？"
          @confirm="confirmDelete(scope.data)">
          <el-button slot="reference" type="text" size="mini">删除</el-button>
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
      :total="pageInfo.pageCount">
    </el-pagination>

    <add-info-dialog
      ref="addInfo"
      :curEventType="curEventType"
      :dialogBool.sync="isShowAddInfoDialog"
      @save-add-edit="saveApplicantOrder"></add-info-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import addInfoDialog from "./component/add-info-dialog";
export default {
  name: 'asset-storage-management',
  components: {
    subReq,
    addInfoDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      backFixedNum: 1,
      selectedIds:[], //勾选的ID
      curEventType: 'add',
      isShowAddInfoDialog: false,
      canRendererTableHeader: [
        {
          id: 1,
          label: "入库单号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "入库方式",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "入库操作人",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "入库时间",
          prop: "enter_date",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "采购资产",
          prop: "asset_total",
          width: "150",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "供应商",
          prop: "supplier_total",
          width: "150",
          align: "center",
          signIndex: 6,
        },
        {
          id: 8,
          label: "采购申请人",
          prop: "purchase_user_name",
          width: "150",
          align: "center",
          signIndex: 6,
        },
        {
          id: 9,
          label: "采购申请部门",
          prop: "dept_name",
          width: "170",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 10,
          label: "采购审批单号",
          prop: "purchase_code",
          width: "170",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 10,
          sortable: false,
        }
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 查询
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {};
      params = Object.assign({},this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.EnterInfoStatisticsEnterInfo(params)
      .then(res => {
        this.loading = false;
        if (res.head.result === "200") {
          this.data = res.context.list;
          this.pageInfo.pageCount = res.context.total
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };  
      })
    },
    // 添加、编辑、查看
    openAddPage(type, row) {
      this.curEventType = type
      this.isShowAddInfoDialog = true
      if(!!row) {
        this.$refs.addInfo.setData(row)
      }
    },
    // 保存入库单
    saveApplicantOrder(info) {
      let objReq = {
        'add': 'SetRecordEnterInfo',
        'edit': 'EditRecordEnterInfo'
      }
      let params = {}
      params.context = info
      this.$client[objReq[this.curEventType]](params)
      .then(res => {
        if(res.head.result == '200') {
          this.isShowAddInfoDialog = false
          this.loadData()
          this.$message({type: 'success', message: res.head.describle, type: 'success'})
        }else{
          this.$message({type: 'error', message: res.head.describle, type: "error"})
        }
      })
    },
    // 审核
    auditApplicant(row) {
      // console.log(row);
      // return
      let params = {}
      params.context = row.id
      this.$client.AuditRecordEnterInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          this.loadData()
          this.$message({type: 'success', message: res.head.describle, type: 'success'})
        }else{
          this.$message({type: 'error', message: res.head.describle, type: "error"})
        }
      })
    },
    // 删除
    confirmDelete(row) {
      let params = {}
      params.context = row.id
      this.$client.DelRecordEnterInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          this.loadData()
          this.$message({type: 'success', message: res.head.describle, type: 'success'})
        }else{
          this.$message({type: 'error', message: res.head.describle, type: "error"})
        }
      })
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.i_id)
        });
      }
    },
    // 导出Excel
    exportFile(){
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedIds ]
      if(ids.length) {
        params.ids = ids
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.ExportEnterInfoStatisticsEnterInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: res.head.describle})
        }
      })
    },
    // 查看采购审批单
    checkApplicant(row) {
      let detail_id = 1280, title = '资产采购申请'
      this.$router.push({
        path: `/news-details/${row.purchase_id}/${title}/${detail_id}`
      })
    },
    // 切割时间
    sliceDate(str) {
      if(!!str) return str.slice(0, 10)
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
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.asset-storage-management
  height: 100%
  width: 100%
</style>
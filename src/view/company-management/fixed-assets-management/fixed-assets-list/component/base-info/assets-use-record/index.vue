<template>
  <div class="assets-use-record">
    <sub-req
      ref="head"
      @on-ok="onSubmit">
    </sub-req>
    <tr-table
      :data="tableData"
      :loading="loading"
      :TableHeight="TableHeight"
      :tableHeaderList="canRendererTableHeader">
      <template slot-scope="scope" slot="created_date">
        <p> {{scope.data.created_date | splitDate}} </p>
      </template> 
      <template slot-scope="scope" slot="flow_content">
        <p v-html="scope.data.flow_content"></p>
      </template> 
      <template slot-scope="scope" slot="flow_code">
        <el-button type="text" @click="jumpChangeView(scope.data)">{{scope.data.create_type == 1 ? scope.data.flow_code : scope.data.enter_code}}</el-button>
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
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";
export default {
  name: 'assets-use-record',
  components: {
    subReq
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0
      },
      asset_id: '',
      form: {},
      tableData: [],
      loading: false,
      TableHeight: 500,
      canRendererTableHeader: [
        {
          id: 1,
          label: "登记类型",
          prop: "create_type_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "类型",
          prop: "type_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "时间",
          prop: "created_date",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "申请部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "申请人",
          prop: "apply_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "流程编号",
          prop: "flow_code",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "流程内容",
          prop: "flow_content",
          width: "170",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        // {
        //   id: 8,
        //   label: "使用人",
        //   prop: "user_name",
        //   width: "170",
        //   align: "center",
        //   signIndex: 7,
        //   sortable: false,
        // },
        // {
        //   id: 9,
        //   label: "来源",
        //   prop: "source_name",
        //   width: "170",
        //   align: "center",
        //   signIndex: 8,
        //   sortable: false,
        // },
        // {
        //   id: 10,
        //   label: "备注",
        //   prop: "remark",
        //   width: "170",
        //   align: "center",
        //   signIndex: 9,
        //   sortable: false,
        // },
      ]
    }
  },
  methods: {
    setData(id) {
      this.asset_id = id
      this.onSubmit()
    },
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
      params.asset_id = this.asset_id;
      this.$client.GetByPageAssetsLife(params)
      .then(res => {
        this.loading = false;
        if (res.head.result === "200") {
          // console.log(res);
          this.tableData = res.context.list;
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
    jumpChangeView(row) {
      if(row.create_type == 1) {
        // let obj = {
        //   '资产报修单': 1270,
        //   '资产采购申请': 1280,
        //   '资产报废单': 1290,
        //   '资产领用单': 1300,
        //   '资产归还单': 1310,
        // }
        let detail_id, title, apply_id
        switch (row.type) {
          case 1:
            detail_id = 1300, title = '资产领用单', apply_id = row.receive_id
            break;
          case 2:
            detail_id = 1310, title = '资产归还单', apply_id = row.receive_id
            break;
          case 3:
            detail_id = 1270, title = '资产报修单', apply_id = row.repair_id
            break;
          case 4:
            detail_id = 1290, title = '资产报废单', apply_id = row.scrap_id
            break;
          case 5:
            detail_id = 1280, title = '资产采购申请', apply_id = row.purchase_id
            break;
        }
        this.$router.push({
          path: `/news-details/${apply_id}/${title}/${detail_id}`
        })
      }else {
        this.$router.push({
          name:'asset-storage-management',
          params:{
            code: row.enter_code
          }
        })
      }
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
  },
  filters: {
    splitDate(val) {
      if(val) {
        return val.slice(0, 10)
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>
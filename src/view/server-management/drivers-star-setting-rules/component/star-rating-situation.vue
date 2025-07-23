<template>
  <div class="star-rating-situation">
    <sub-req 
      ref="head" 
      @on-ok="onSubmit"
    >
    </sub-req>
    <tr-table
      :data="data"
      :loading="loading"
      :TableHeight="TableHeight"
      :backFixedNum="backFixedNum"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="customSettingList"
      >
      <template slot-scope="scope" slot="now_star">
        <div v-if="scope.data.now_star">
          <el-rate v-model="scope.data.now_star" :max="scope.data.now_star" :disabled="true" :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
        </div>
        <div class="show-flex-box-r show-flex-center" v-else>
          <span>无星级</span>
        </div>
      </template>
      <template slot-scope="scope" slot="operation">
        <el-button type="text" size="mini" @click="editRowInfo(scope.data, 'detail')">查看</el-button>
        <el-button type="text" size="mini" @click="editRowInfo(scope.data, 'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
      </template>
    </tr-table>
    <el-pagination
      style="margin: 5px 0;display:flex; justify-content: flex-end;"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      ref="paginationH"
      :current-page="pageInfo.pageIndex"
      :page-sizes="[10, 20, 30, 40, 50, 100, 200,300]"
      :page-size="pageInfo.pageSize"
      layout="total,sizes, prev, pager, next, jumper"
      :total="pageInfo.pageCount">
    </el-pagination>

    <information-dialog
      :dialogBool.sync="informationVisible"
      ref="information"
      @on-edit="edit"
    ></information-dialog>

    <detail-dialog
      :dialogBool.sync="detailVisible"
      ref="detail"
    ></detail-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import informationDialog from './information-dialog'
import detailDialog from './detail-dialog'
import subReq from "./sub-req";
export default {
  name: 'star-rating-situation',
  components: {
    subReq,
    informationDialog,
    detailDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 300,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "姓名",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "工号",
          prop: "work_code",
          width: "120",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "dept_name",
          width: "160",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "职位",
          prop: "position",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "员工状态",
          prop: "state",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "进单位时间",
          prop: "join_date",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "累积工作年份",
          prop: "work_year",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "当前星级",
          prop: "now_star",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: true,
        },
        {
          id: 9,
          label: "评星时间",
          prop: "last_star_time",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: true,
        },
        {
          id: 10,
          label: "评定季度",
          prop: "year_quarter",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: true,
        },
        {
          id: 11,
          label: "持续季度",
          prop: "quarter_count",
          width: "150",
          align: "center",
          signIndex: 10,
          sortable: true,
        },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 11,
        },
      ],
      informationVisible:false,
      detailVisible: false
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
    });
    this.loadData()
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.GetRecordDriverStar({context:params})
        .then(res => {
          // console.log(JSON.stringify(res));
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
    editRowInfo(row,type) {
      if (type == 'detail') {
        this.detailVisible = true
        this.$nextTick(() => {
          this.$refs.detail.loadData(row.driver_id)
        })
      } else {
        this.informationVisible = true
        this.$nextTick(() => {
          this.$refs.information.setData(row)
        })
      }
    },
    edit(form) {
      this.$client.UpdateDriverStar({context:form})
        .then(res => {
          if (res.head.result == "200") {
            this.informationVisible = false
            this.loadData()
            this.$message({
              showClose: true,
              message: '编辑成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.errmsg,
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
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph - 5;
      }, 60);
    },
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.star-rating-situation
  height: 100%
  width: 100%
</style>
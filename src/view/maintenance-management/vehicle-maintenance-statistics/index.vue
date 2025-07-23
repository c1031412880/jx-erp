<template>
  <div class="vehicle-maintenance-statistics">
    <sub-req
      ref="head"
      @on-btn-export="exportFile"
      @on-ok="onSubmit"></sub-req>

    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="customSettingList"
      @on-select-change-row="selectedList"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading">
      <!-- 自编号--车辆型号 -->
      <template slot-scope="scope" slot="vehicle_number">
        <span v-if="!!scope.data.vehicle_info">{{scope.data.vehicle_info.vehicle_number}}</span>
        <span v-else></span>
      </template>
      <template slot-scope="scope" slot="vehicle_name">
        <span v-if="!!scope.data.vehicle_info">{{scope.data.vehicle_info.vehicle_name}}</span>
        <span v-else></span>
      </template>
      <!-- <template slot-scope="scope" slot="vehicle_name">
        <el-button type="text" v-if="!!scope.data.vehicle_info"  @click="openVehicleInfo(scope.data.vehicle_info.vehicle_name)">{{scope.data.vehicle_info.vehicle_name}}</el-button>
        <span v-else></span>
      </template> -->
      <template slot-scope="scope" slot="department_name">
        <span v-if="!!scope.data.vehicle_info">{{scope.data.vehicle_info.department_name}}</span>
        <span v-else></span>
      </template>
      <template slot-scope="scope" slot="vehicle_kind_name">
        <span v-if="!!scope.data.vehicle_info">{{scope.data.vehicle_info.vehicle_kind_name}}</span>
        <span v-else></span>
      </template>

      <template slot-scope="scope" slot="repair_item_names">
        <el-button type="text" @click="onSelectRow(scope.data, scope.data.maint_dept_name)">{{scope.data.repair_item_names}}</el-button>
      </template>
      <template slot-scope="scope" slot="repair_person_names">
        <el-button type="text" @click="onSelectRow(scope.data, scope.data.maint_dept_name)">{{scope.data.repair_person_names}}</el-button>
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

    <information-dialog
      :data="tableData"
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
    ></information-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
export default {
  name: "vehicle-maintenance-statistics",
  components: {
    subReq,
    informationDialog
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 100,
        pageCount: 0,
      },
      data: [],
      form: {},
      tableData: [],
      loading: false,
      TableHeight: 500,
      selectedIds:[], //勾选的ID
      informationDialogShow: false,
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "车牌",
          prop: "vehicle_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "车辆型号",
          prop: "vehicle_kind_name",
          width: "180",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "维修类别",
          prop: "type_child_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "报修时间",
          prop: "repair_time",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "维修车间",
          prop: "maint_dept_name",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        // {
        //   id: 8,
        //   label: "报修内容",
        //   prop: "repair_describe",
        //   width: "130",
        //   align: "center",
        //   signIndex: 7,
        //   sortable: false,
        // },
        {
          id: 8,
          label: "维修项目",
          prop: "names",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "维修人员",
          prop: "person",
          width: "160",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "总工时",
          prop: "bz_hours",
          width: "120",
          align: "center",
          signIndex: 9,
          sortable: false,
          nestedTablesHeader: [
            {
              label: "普通维修",
              prop: "bz_hours_common",
              width: "120",
              align: "center",
              signIndex: 1,
              sortable:false,
            },
            {
              label: "三包维修",
              prop: "bz_hours_sanbao",
              width: "120",
              align: "center",
              signIndex: 2,
              sortable:false,
            },
            {
              label: "事故维修",
              prop: "bz_hours_repair",
              width: "120",
              align: "center",
              signIndex: 3,
              sortable:false,
            },
          ]
        },
        {
          id: 11,
          label: "材料费",
          prop: "bz_common",
          width: "120",
          align: "center",
          signIndex: 10,
          sortable: false,
          nestedTablesHeader: [
            {
              label: "普通材料费",
              prop: "reality_hours_common",
              width: "120",
              align: "center",
              signIndex: 1,
              sortable:false,
            },
            {
              label: "三包材料费",
              prop: "reality_hours_sanbao",
              width: "120",
              align: "center",
              signIndex: 2,
              sortable:false,
            },
            {
              label: "事故材料费",
              prop: "reality_hours_repair",
              width: "120",
              align: "center",
              signIndex: 3,
              sortable:false,
            },
          ]
        },
        {
          id: 12,
          label: "施救费",
          prop: "rescue_cost",
          width: "160",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "总费用",
          prop: "total_fees",
          width: "80",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "完工日期",
          prop: "finish_time",
          width: "160",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
        {
          id: 15,
          label: "出厂日期",
          prop: "out_time",
          width: "160",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
      ]
    }
  },
  methods: {
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getrOrderList(params)
        .then(res => {
          this.loading = false;
          if (res.head.result == "200") {
            this.data = res.context.list;
            this.pageInfo.pageCount = res.context.total
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          console.log(err);
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 导出Excel
    exportFile() {
      let params = Object.assign({}, this.form);
      let ids = [ ...this.selectedIds ]
      if (ids.length) {
        params.ids = ids
      }
      this.$client.exportVehMaintRepairOrder(params).then(res => {
        if (res.head.result == "200") {
          window.location.href = res.context;
          this.$message({ type: "success", message: "导出成功" });
        } else {
          this.$message({ type: "error", message: "导出失败" });
        }
      });
    },
    // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadData()
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadData()
    },
     // 跳转到车辆信息管理
    openVehicleInfo(lp_num) {
       this.$router.push({
        name:'vehicle-maintenance-file',
        params:{
          numberId: lp_num
        }
      })
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedIds.push(item.id)
        });
      }
    },
    onSelectRow(val, info) {
      this.tableData = val.repair_items
      this.tableData.forEach(item => {
        item.maint_dept_name = info
      })
      this.informationDialogShow = true
    },
    // 计算表格高度 和初始化表头
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
.vehicle-maintenance-statistics {
  width: 100%;
  height: 100%;
}
</style>

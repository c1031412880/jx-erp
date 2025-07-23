<template>
  <div class="water-management-box">
    <div class="water-management">
      <el-card class="box-card center-box" ref="centerBox">
        <div class="department-detail show-flex-box-c" v-loading="loading">
          <sub-req
            ref="head"
            @on-ok="onSubmit"
            @on-save="onSave"
          ></sub-req>
          <div class="show-box">
            <span>已选物品：</span>
            <div class="title-tag">
              <el-tag style="margin: 0 5px" size="mini" effect="dark" type="success" v-for="item in selectedList" :key="item.id">{{item.material_name}}</el-tag>
            </div>
          </div>
          <tr-table
            ref="table"
            :selectionShow="true"
            :reserveSelect="true"
            :data="data"
            :tableHeaderList="customSettingList"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="backFixedNum"
            @on-select-change-row="selectedUserList"
            @double-click-row="dblclickRowTable"
          ></tr-table>
          <el-pagination
            style="margin: 5px 0;display:flex; justify-content: flex-end;"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            ref="paginationH"
            :current-page="pageInfo.pageIndex"
            :page-sizes="[10, 20, 30, 40, 50,]"
            :page-size="pageInfo.pageSize"
            layout="total,sizes, prev, pager, next, jumper"
            :total="pageInfo.pageCount"
          >
          </el-pagination>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./sub-req";

export default {
  name: "materials-manage",
  props: {
    house_id: {
      type: [String,Number],
      default: 0
    },
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
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 0, //后几行固定
      customSettingList: [
        {
          id: 1,
          label: "入库单号",
          prop: "enter_num",
          width: "150",
          align: "center",
          signIndex: "0",
          sortable: false,
        },
        {
          id: 2,
          label: "入库日期",
          prop: "enter_date",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "物料编号",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
         {
          id: 4,
          label: "物料名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
         {
          id: 5,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
         {
          id: 6,
          label: "单位",
          prop: "measure_unit_name",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
         {
          id: 7,
          label: "数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
         {
          id: 8,
          label: "销售单价",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
         {
          id: 9,
          label: "销售金额",
          prop: "total_price",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        }, 
         {
          id: 10,
          label: "成本单价",
          prop: "cost_price",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        }, {
          id: 11,
          label: "成本总价",
          prop: "cost_total_price",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
         {
          id: 12,
          label: "批次",
          prop: "batch_no",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
         {
          id:13,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "关联单号",
          prop: "relate_num",
          width: "130",
          align: "center",
          signIndex: 13,
          sortable: false,
        },
         {
          id: 15,
          label: "采购员",
          prop: "buyer_name",
          width: "130",
          align: "center",
          signIndex: 14,
          sortable: false,
        },
         {
          id: 16,
          label: "仓保员",
          prop: "storage_name",
          width: "130",
          align: "center",
          signIndex: 15,
          sortable: false,
        },
        {
          id: 17,
          label: "审核状态",
          prop: "state_name",
          width: "130",
          align: "center",
          signIndex: 16,
          sortable: true,
        },
        {
          id: 18,
          label: "入库方式",
          prop: "enter_type",
          width: "130",
          align: "center",
          signIndex: 17,
          sortable: false,
        },
        {
          id: 19,
          label: "物料数量",
          prop: "material_num",
          width: "130",
          align: "center",
          signIndex: 18,
          sortable: false,
        }, {
          id: 20,
          label: "物料种类数",
          prop: "material_type_num",
          width: "130",
          align: "center",
          signIndex: 19,
          sortable: false,
        }, {
          id: 21,
          label: "入库仓库",
          prop: "house_name",
          width: "130",
          align: "center",
          signIndex: 20,
          sortable: false,
        },
        {
          id: 22,
          label: "供应商",
          prop: "provider_name",
          width: "130",
          align: "center",
          signIndex: 21,
          sortable: false,
        },
      ],
      loading: false,
      TableHeight:500,
      form:{}, //查询表单数据
      selectedList: []
    };
  },
  components: {
    subReq,
  },
  mounted() {
    this.setHead()
    // this.reqOrgProjectList()
  },
  methods: {
    dblclickRowTable(row,column) {
      this.$refs.table.toggleSelection([row])
    },
    // 清空勾选
    clearData() {
      this.selectedList = []
      this.$refs.table.handleSelectionChange([])
    },
    // 提交勾选物资
    onSave() {
      this.$emit('on-save',this.selectedList)
      this.clearData()
    },
    // 计算高吨
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh -th;
      }, 60);
    },
    
    // 获取列表
    // isCurDepartment //是否是当期组织还是上级组织
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      params.house_id = this.house_id
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getByPageEnterHouse(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context.list;
            this.data.forEach((item,index) => {
              item.id = Number(item.id.toString() + index.toString()) 
            })
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
    // 查询
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.loadData();
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
    // 选中表格勾选框
    selectedUserList(list) {
      this.selectedList = list
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.water-management-box{
  width: 100%;
  height: 100%;

  .show-box {
    width: 100%;
    height: 20px;
    display: flex;
    margin-bottom: 10px;
    align-items: center
    .title-tag {
      flex: 1; 
      overflow: hidden;
      height: 20px;
    }
  }
}
.water-management {
  width: 100%;
  height: 100%;
  display: flex;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    flex: 0 0 15vw;
    margin: 0 5px 0 0;
    width: 300px;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}
.department-detail {

}
.department-detail /deep/ .el-input{
  // width: 250px;
}

.water-management /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>

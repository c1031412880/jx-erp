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
            :tableHeaderList="canRendererTableHeader"
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
    // 物料id     目前只给轮胎用
    tireID: {
      type: Number,
      default: 0
    },
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
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "物资名称",
          prop: "material_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "物资编号",
          prop: "material_code",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "仓库名称",
          prop: "house_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "规格型号",
          prop: "specification",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "计量单位",
          prop: "measure_unit_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 5,
          label: "物料分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "品牌",
          prop: "brand",
          width: "120",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "物料价格（元）",
          prop: "price",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "批次号",
          prop: "batch_no",
          width: "170",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "适用车型",
          prop: "vehicle_kind_names",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "供应商名称",
          prop: "provider_name",
          width: "130",
          align: "center",
          signIndex: 9,
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
    reqOrgProjectList() {
      this.loading = true;
      let params 
      if (this.tireID) {
        params = {
          house_id: this.house_id,
          group_id: this.tireID,
        }
      } else {
        params = {
          house_id: this.house_id,
        }
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      this.$client.getByPage1TimerHouse(params)
        .then((res) => {
          if (res.head.result === "200") {
            this.data = res.context.list
            this.pageInfo.pageCount = res.context.total
            this.loading = false;
          } else {
            this.loading = false;
          }
        }).catch(err=>{console.log(err)});
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList();
    },
     // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.reqOrgProjectList();
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList();
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

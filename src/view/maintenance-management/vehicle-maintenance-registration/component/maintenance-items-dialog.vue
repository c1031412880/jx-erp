<template>
  <el-dialog
    :visible="dialogBool"
    :title="showTitle"
    :before-close="dialogClose"
    fullscreen
    append-to-body>
    <div class="show-flex-box-r">
      <div style="width: 240px; margin-right: 10px;">
        <maintenance-project-tree
          ref="organizationTree"
          :loading="organizationloading"
          :TableHeight="treeHeight"
          :placeholder="placeholder"
          :organizationTreeList="organizationTreeList"
          :organizationTreeListLength="organizationTreeListLength"
          @on-tree="selectDepartment"
          @refresh-tree="refreshTreeList"
        ></maintenance-project-tree>
      </div>
      <div style="width: calc(100% - 240px)">
        <el-form :inline="true" size="mini" label-suffix=":" label-position="left">
          <el-row>
            <el-form-item label="维修项目名称">
              <el-input v-model="form.c_name" placeholder="请输入维修项目名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
            </el-form-item>
          </el-row>
          <el-row>
            <!-- <el-form-item label="已选项目"> -->
              <!-- <el-select style="width:300px" v-model="items" disabled multiple placeholder="请输入维修项目名称">
                <el-option
                  v-for="item in itemsList"
                  :key="item.i_id"
                  :label="item.c_name"
                  :value="item.i_id">
                </el-option> -->
              <!-- </el-select> -->
                <div style="margin-bottom: 10px">
                  <span>已选资产：</span>
                  <el-tag style="margin: 0 5px" size="mini" effect="dark" type="success" v-for="item in itemsList" :key="item.i_id">{{item.c_name}}</el-tag>
                </div>
            <!-- </el-form-item> -->
          </el-row>

        </el-form>
        <tr-table
          ref="trTable"
          :selectionShow="true"
          :data="data"
          :reserveSelect="true"
          :tableHeaderList="canRendererTableHeader"
          :isShowBottomOptions="false"
          :loading="loading"
          :TableHeight="treeHeight"
          @on-select-change-row="selectedProjectList"
        ></tr-table>
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
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="saveItems">添 加</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import maintenanceProjectTree from "./base-info/maintenance-project-tree"
export default {
  components: {
    maintenanceProjectTree
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      showTitle: "维修项目",
      organizationloading: false,
      treeHeight: 700,
      placeholder: "请输入关键词",
      organizationTreeList: [],
      organizationTreeListLength: 0,
      form: {
        c_name: '',
      },
      data: [],
      items: [],
      itemsList: [],
      canRendererTableHeader: [
        {
          id: 1,
          label: "维修项目名称",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所属类别",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "编码",
          prop: "c_code",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: true,
        },
        {
          id: 4,
          label: "工时",
          prop: "i_hours",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        
        {
          id: 5,
          label: "班组工时",
          prop: "describe",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "单价(元)",
          prop: "n_price",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: true,
        },
        {
          id: 7,
          label: "备注",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        }
      ],
      loading: false,
      curSelectedDepartment: null
    };
  },
  watch: {
    // dialogBool(bool) {
    //   if (bool === false) {
    //     this.onClearSelectList()
    //   } 
    // },
  },
  mounted() {
    this.$nextTick(() => {
      this.loadOrganizationTree();
    })
  },
  methods: {
    dialogClose() {
      this.$refs.trTable.handleSelectionChange([])
      this.$emit("update:dialogBool", false);
    },
    onSubmit() {
      this.reqOrgProjectList(true)
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      this.organizationloading = true;
      this.$client.getMoldProjectTree()
      .then(res => {
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          this.organizationTreeListLength = this.organizationTreeList.length;
          this.organizationloading = false;
        } else {
          this.organizationloading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 选择某一组织
    selectDepartment(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      this.form = {}; //搜索置空
      this.reqOrgProjectList(true) // 获取维修项目列表
    },
    // 获取维修项目列表
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrgProjectList(isCurDepartment) {
      this.loading = true;
      let params = {
        i_group_id: isCurDepartment? this.curSelectedDepartment.i_id : this.curSelectedDepartment.p_id
      }
      params = Object.assign({},params,this.form)
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.getMaintainProjectList(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.list;
          this.pageInfo.pageCount = res.context.total
          this.loading = false;
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {

      })
    },
     // 分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.reqOrgProjectList(true);
    },
    // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true);
    },
    // 刷新维修组织分类
    refreshTreeList() {
      this.loading = true;
      this.organizationloading = true;
      this.loadOrganizationTree();
      // 重新定位到目前组织树中
      this.locationCurNode();
    },
    // 重新定位到目前组织树中
    locationCurNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.i_id);

      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 选中表格勾选框
    selectedProjectList(projectList) {
      // console.log('勾选了',projectList);
      this.itemsList = JSON.parse(JSON.stringify(projectList)) 
      let arr = []
      projectList.forEach(item => {
        arr.push(item.i_id)
      });
      this.items = arr
    },
    // // 清空用户选中
    // onClearSelectList() {
    //   this.$refs.trTable.handleSelectionChange([])
    // },
    // 给父及页面提供数据
    saveItems() {
      this.$emit('out-info', this.itemsList)
      this.dialogClose()
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>



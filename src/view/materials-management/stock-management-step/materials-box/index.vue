<template>
  <div class="water-management-box">
    <div class="water-management">
      <el-card class="box-card" ref="centerBox">
        <div class="department-detail show-flex-box-c" v-loading="loading">
          <sub-req
            ref="head"
            @on-ok="onSubmit"
            @on-save="onSave"
            @on-add="openAddPage"
            @on-close="onClose"
          ></sub-req>
          <div class="show-box">
            <span>已选物品：</span>
            <div class="title-tag">
              <el-tag style="margin: 0 5px" size="mini" effect="dark" type="success" v-for="item in selectedList" :key="item.id">{{item.name}}</el-tag>
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
            :omitColumnIndex='[3,5,6,8,10]'
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
    <div class="organization-project-dialog">
      <set-info-dialog
        ref="setOrganizationInfo"
        :dialogBool.sync="isShowSetInfoDialog"
        :curSelecedType="'add'"
        :classifyOptions="classifyOptions"
        @save-add-edit="saveAddEdit"
      ></set-info-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import maintenanceProjectTree from "./maintenance-project-tree";
import setInfoDialog from "./set-info-dialog"
import subReq from "./sub-req";

export default {
  name: "materials-manage",
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 50,
        pageCount: 0,
      },
      visible: false,
      placeholder: "请输入关键词",
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      isShowSetInfoDialog: false,
      classifyOptions: [],
      curSelectedDepartment:null, //当前选中的组织树节点
      isShowAddClassifyDialog: false, // 添加项目分类弹窗
      data:[], //列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "物资名称",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "物资编号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
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
          label: "所属分组",
          prop: "main_name",
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
          label: "厂地",
          prop: "vendor",
          width: "120",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 11,
          label: "是否临时物资",
          prop: "temp_meterial_name",
          width: "120",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
      ],
      loading: false,
      TableHeight:500,
      form:{}, //查询表单数据
      selectedProjectIds:[], //勾选中要删除的IDs
      selectedList: [],
      main_id: ''
    };
  },
  components: {
    maintenanceProjectTree,
    subReq,
    setInfoDialog
  },
  mounted() {
    this.setHead();
    // this.loadOrganizationTree();
    this.reqOrgProjectList()
     // 加载所属类别
    this.loadClassifyGroup();
    // this.$nextTick(() => {
    //   window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
    //     if(this.curSelectedDepartment) {
    //       this.setHead(this.curSelectedDepartment)
    //     }
    //   })
    // })
  },
  methods: {
    onClose() {
      this.$emit("on-close");
    },
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
    setHead(departmentInfo) {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight
        this.TableHeight = maxh -th;
      }, 60);
    },
    // 获取组织tree信息
    loadOrganizationTree() {
      // this.organizationloading = true;
      this.$client.GetMaterialGroup()
      .then(res => {
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          if (!!this.organizationTreeList[0].children) {
            this.organizationTreeList[0].children.forEach(item=> {
              if (item.is_default == 1) {
                this.main_id = item.id
              }
            })
          }
          this.reqOrgProjectList()
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {

      })
    },
    // 加载所属类别
    loadClassifyGroup() {
      this.$client.GetMaterialGroup()
      .then(res => {
        console.log(res)
        if(res.head.result == "200") {
          this.classifyOptions = res.context
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 获取列表
    // isCurDepartment //是否是当期组织还是上级组织
    reqOrgProjectList(isCurDepartment) {
      this.loading = true;
      let params = {
        // main_id: this.main_id
        main_name: '轮胎'
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      this.$client.getMaterialPage(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.data = res.context.list;
          this.data.forEach(element => {
            if(element.usable){
            element.usable=element.usable.toString()
            }
          });
          // 总分类下需要分页
          this.pageInfo.pageCount = res.context.total
          setTimeout(() => {
            this.loading = false;
          }, 800);
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
    // 添加
    saveAddEdit(form) {
      let successrMessage = '添加成功';
      let params = {
        context: form
      }
      this.$client
        .setRecordMaterial(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.reqOrgProjectList(true);
            // // 重新定位到目前组织树中
            this.isShowSetInfoDialog = false;
            this.$emit("on-load")
            this.$message({
              showClose: true,
              message: successrMessage,
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
        .catch((err) => {});
    },
    // 头部事件抛出
    openAddPage(type) {
      this.curSelecedType = type;
      switch (type) {
        case "add":
          if(this.curSelectedDepartment && this.curSelectedDepartment.type === 1) {
            this.$refs.setOrganizationInfo.ruleForm.main_id = this.curSelectedDepartment.id;
          }
          if(this.curSelectedDepartment && this.curSelectedDepartment.type === 2) {
            this.$refs.setOrganizationInfo.ruleForm.main_id = this.curSelectedDepartment.id;

          }
          this.isShowSetInfoDialog = true;
          break;
      }
    },
    // 查询
    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageSize = 20;
      this.pageInfo.pageCount = 0;
      this.reqOrgProjectList(true);
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
    
    // 重新定位到目前组织树中
    locationCurNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.id);

      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    //重新定位到目前上一级组织树中
    locationParentNode() {
      let ids= [];
      ids.push(this.curSelectedDepartment.parent_id);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 选中表格勾选框
    selectedUserList(list) {
      console.log('list',list);
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

  .box-card {
    height: 100%;
    overflow: auto;
  }

  // .left-box {
  //   flex: 0 0 15vw;
  //   margin: 0 5px 0 0;
  //   width: 300px;
  //   height: 100%;
  // }

  // .center-box {
  //   flex: 1;
  //   height: 100%;
  // }
}

.water-management /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
}

.superior-department-content {
  margin-bottom: 30px;
}
</style>

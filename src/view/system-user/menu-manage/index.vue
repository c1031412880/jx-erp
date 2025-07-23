
<template>
  <div class="tr_data_center_class" style="width: 100%;height: 100%;">
    <menu-manage-data-center/>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    name: "menu-manage",
  }
</script>
<!--
<template>
  <div class="menu-manage">
    <sub-req
      ref="head"
      @on-add="openAddJobPage"
      @on-ok="onSubmit"
      @show-table="showTable"
      @shrink-table="shrinkTable"
    ></sub-req>
    <tr-table
      ref="trTable"
      :selectionShow="false"
      :indexShow="false"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowBottomOptions="false"
      :TableHeight="TableHeight"
      :loading="loading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      :expandRowKeys="expandRowKeys"
    >
    <template slot-scope="scope" slot="is_new">
      <span v-if="!!scope.data.type">{{!!scope.data.is_new? '是': '否'}} </span>
      <span v-else>目录菜单不跳转</span>
    </template>
    <template slot-scope="scope" slot="icon_path">
      <div class="show-flex-box-r show-flex-center">
        <el-image
        v-if="!!scope.data.icon_path"
        style="width: 40px; height: 40px"
        :src="scope.data.icon_path"
        :fit="'contain'"></el-image>
      </div>
      
    </template>
    <template slot-scope="scope" slot="operation">
       <el-button type="primary" size="mini" :disabled="!!scope.data.type" @click="addSubmenu(scope.data)">添加字菜单</el-button>
        <el-button type="primary" size="mini" @click="editRowInfo(scope.data)">编辑</el-button>
        <el-popconfirm
          @confirm="deleteRowInfo(scope.data)"
          title="确定删除此条记录吗？">
          <el-button slot="reference" type="danger" size="mini">删除</el-button>
        </el-popconfirm>
        <el-button type="primary" size="mini" @click="openSortPop(scope.data)">排序</el-button>

    </template>
    </tr-table>

    <!-- <el-pagination
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

    <information-dialog
      ref="informationDialog"
      :dialogBool.sync="informationDialogShow"
      :curSelecedType="curSelecedType"
      :title="informationDialogTitle"
      @save-add-edit-job="saveAddEdit"
    ></information-dialog>
    <!-- 自定义 
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>
    <!-- 菜单排序弹窗 
    <sort-dialog
      :dialogBool.sync="isShowSort"
      :sortDataList="sortDataList"
      @save-sort-menu="saveSortMenu"
    ></sort-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import informationDialog from "./component/information-dialog";
import sortDialog from "./component/sort-dialog";
export default {
  name: "menu-manage",
  components: {
    subReq,
    informationDialog,
    sortDialog
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      informationDialogShow: false,
      customSettingVialogVisible: false,
      curSelecedType: "",
      informationDialogTitle: "添加",
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "菜单名称",
          prop: "name",
          width: "200",
          align: "left",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "菜单编号",
          prop: "code",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "跳转路径",
          prop: "link_url",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "新页面",
          prop: "is_new",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "图标",
          prop: "icon_path",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "菜单描述",
          prop: "describe",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "功能菜单",
          prop: "func_name",
          width: "220",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "320",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      expandRowKeys: [],
      isShowSort: false,
      sortDataList:[], // 需要排序菜单
    };
  },
  mounted() {
    this.loadData();
    this.$nextTick(() => {
      this.setHead('initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.canRendererTableHeader = null;
      this.customSettingShowList = null;
      this.customSettingShowList = newestTableHeaderList;
      this.canRendererTableHeader = newestTableHeaderList.filter(item => item.isSelected).map((sing,index) => {
        let obj = {
          id: index +1,
          label: sing.label,
          prop: sing.prop,
          width: sing.width,
          align: sing.align,
          signIndex: index,
          sortable: sing.sortable,
        }
        return obj
      });
      this.$forceUpdate();
      console.log(JSON.stringify(this.canRendererTableHeader));
    },
    // 展开表格
    showTable() {
      this.isExpandTable(this.data, true)
      // this.expandRowKeys = []
      // this.findMenuIds(this.data, this.expandRowKeys)
      // console.log(this.expandRowKeys)
    },
    findMenuIds(list, ids) {
      list.forEach(item => {
        ids.push(item.id + '')
        if(!!item.children && item.children.length > 0) {
          this.findMenuIds(item.children, ids)
        }
      });
    },
    // 收缩表格
    shrinkTable() {
      this.expandRowKeys = []
      this.isExpandTable(this.data, false)
    },
    isExpandTable(arr, isExpand) {
      arr.forEach(i => {
        this.$refs.trTable.$refs.table.toggleRowExpansion(i, isExpand)
        if (!!i.children && i.children.length　> 0) {
          this.isExpandTable(i.children, isExpand)
        }
      })
    },
    // 搜索查询
    onSubmit(form) {
      this.form = form
      // this.pageInfo.pageIndex = 1;
      // this.pageInfo.pageCount = 0;
      console.log(this.form);
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let params = Object.assign({}, this.form);
      // params.page_index = this.pageInfo.pageIndex;
      // params.page_size = this.pageInfo.pageSize;
      this.$client.getMenuRecordsSysMenu(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context;
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

    checkrefOrgShow(refOrgList) {
      let showText = '';
      refOrgList.forEach(item => {
        showText = `${showText}${item},`
      });
      return showText
    },
    // 编辑、添加菜单
    saveAddEdit(form) {
      // return


      let successrMessage = "";
      form.parent_id = Number(form.parent_id)
      let parmas = {
        context: form
      };
      if (this.curSelecedType == "add") {
        delete parmas.context.id;
        successrMessage = "添加成功";
      } else {
        successrMessage = "编辑成功";
      }
      this.$client
        .setMenuRecordSysMenu(parmas)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadData();
            this.informationDialogShow = false;
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
        }).catch((err) => {});
    },
    restTableList() {
      this.form = {};
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    openSettingPageEvent() {
      this.customSettingVialogVisible = true;
    },
    openAddJobPage(type) {
      this.curSelecedType = type;
      this.informationDialogTitle = "添加菜单";
      this.informationDialogShow = true;
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
    openAdvancedFilterPage() {
      this.drawerdialogVisible = true;
    },
    // 编辑
    editRowInfo(form) {
      // console.log(form);
      this.curSelecedType = "edit";
      this.$refs.informationDialog.setData(form)
      this.informationDialogTitle = "编辑菜单";
      this.informationDialogShow = true;
    },
    // 添加子菜单
    addSubmenu(form) {
      this.curSelecedType = "add";
      this.$refs.informationDialog.setSubmenuData(form)
      this.informationDialogTitle = "添加子菜单";
      this.informationDialogShow = true;
    },
    // 删除
    deleteRowInfo(info) {
       let params = {
        context: info.id
      };
      this.$client.deleteMenuRecordSysMenu(params)
      .then(res => {
        if (res.head.result == "200") {
          this.loadData();
          this.$message({
            showClose: true,
            message: "删除成功",
            type: "success",
          });
        } else {
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
    // 打开排序弹窗
    openSortPop(row) {
      // 获取需要排序菜单
      this.sortDataList = [];
      this.$client.getMenuRecordsByIDSysMenu({parent_id: row.parent_id}).then(res => {
        if(res.head.result == "200") {
          console.log(res)
          this.sortDataList = res.context;
          this.isShowSort = true
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
      
    },
    // 保存菜单排序
    saveSortMenu(list) {
      this.$client.sortMenusSysMenu({context:list})
        .then(res => {
          // console.log(JSON.stringify(res))
          if (res.head.result == "200") {
              this.loadData();
              this.isShowSort = false;
 
              this.$message({
                showClose: true,
                message: '排序成功',
                type: "success",
              });
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
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
        this.customSettingShowList = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.menu-manage {
  width: 100%;
  height: 100%;
}
</style>

-->
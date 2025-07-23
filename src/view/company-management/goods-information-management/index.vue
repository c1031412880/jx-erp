<template>
  <div class="goods-information-management">
    <el-card class="left-box">
      <div
        slot="header"
        class="clearfix show-flex-box-r"
        style="height: 37px; flex-wrap: nowrap; align-items:center;">
        <span style="white-space:nowrap;">物品分类</span>
      </div>
      <div class="show-flex-box-r" style="margin-bottom:15px;flex-wrap: nowrap; justify-content: space-evenly;">
        <el-button type="primary" size="mini" :disabled="curSelectedDepartment.sort == 2" v-if="$isPowerShow('addclass')" @click="openGoodsInfoDialog('add')">添加分类</el-button>
        <el-button type="primary" size="mini" :disabled="!(curSelectedDepartment['sort'])" v-if="$isPowerShow('editclass')" @click="openGoodsInfoDialog('edit')">编辑</el-button>
        <el-popover
          placement="bottom"
          title="操作确认"
          width="400"
          v-if="$isPowerShow('delcalss')"
          v-model="visible">
          <div class="show-flex-box-r" style="">
            <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
              <i class="el-icon-question" style="font-size: 25px;"></i>
            </span>
            <div class="show-flex-box-c" >
              <p style="font-size: 18px; margin-bottom: 5px;">{{`${`该分类下有${curSelectedDepartment.count}个资产`}`}}。确认删除吗</p>
              <!-- <span style="color:#F56C6C">是否确定删除？</span> -->
            </div>
          </div>
          <div style="text-align: right; margin: 0">
            <el-button size="mini" type="text" @click="visible = false">取消</el-button>
            <el-button type="primary" size="mini" @click="sureDeleteClassifyGroup()">确定</el-button>
          </div>
          <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;" :disabled="!(curSelectedDepartment['sort'])">删除</el-button>
        </el-popover>
      </div>
      <asset-classification-tree
        ref="organizationTree"
        :placeholder="placeholder"
        :loading="organizationloading"
        :organizationTreeList="organizationTreeList"
        :organizationTreeListLength="organizationTreeListLength"
        @on-tree="selectDepartment"
        @refresh-tree="refreshTreeList"
      ></asset-classification-tree>
    </el-card>
    <el-card class="right-box">
      <sub-req
        ref="head"
        @on-ok="onSubmit"
        @on-add="addGoodsInfo"
        @on-del="onDelete"
        @on-export="exportFile"
        @on-import="openImportFilePop"
        @on-set="onAlarmSet"
        :isCanDelete="isCanDelete">
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
        <template slot-scope="scope" slot="operation">
          <el-button type="text" size="mini" v-if="$isPowerShow('detail')" @click="upDateBaseInfo(scope.data, 'check')">查看</el-button>
          <el-button type="text" size="mini" v-if="$isPowerShow('edit')" @click="upDateBaseInfo(scope.data, 'edit')">编辑</el-button>
          <el-button type="text" size="mini" v-if="$isPowerShow('delete')" @click="deleteCurRowInfo(scope.data)">删除</el-button>
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
    </el-card>
    <div class="div-dialog">
      <!-- 添加分类 -->
      <add-classify-dialog
        ref="addClassifyDialog"
        :classifyOptions1="classifyOptions1"
        :dialogBool.sync="isShowAddClassifyDialog"
        :currType="currChangeType"
        @save-add-edit-organization="saveAddEditOrgClassifyInfo"
      ></add-classify-dialog>
      <!-- 新建物品 -->
      <add-info-dialog
        ref="addInfoDialog"
        :dialogBool.sync="isShowAddinfoDialog"
        :curEventType="curEventType"
        :classifyOptions1="classifyOptions1"
        @sure-save-info="saveGoodsInfo"
      ></add-info-dialog>
      <!-- 上传文件 导出文件弹窗组件 -->
      <file-dialog
        :dialogBool.sync="filedialogVisible"
        :fileData="FileData"
        :typeMessage ="'资产物品'"
        @on-submit-excel ="importInfoExcel"
      ></file-dialog>
      <!-- 报废提醒设置 -->
      <alarm-setting-dialog 
        ref="alarmSet"
        :dialogBool.sync="isShowAlarmSetDialog"
        @save-alarm-set="saveAlarmSet"
      ></alarm-setting-dialog>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import fileDialog from '@/components/fileDialog/file-dialog'
import addClassifyDialog from './component/dialog/add-classify-dialog'
import addInfoDialog from './component/dialog/goods-info-dialog'
import alarmSettingDialog from "./component/dialog/alarm-setting-dialog";
import assetClassificationTree from './component/base-info/asset-classification-tree'
export default {
  components: {
    subReq,
    fileDialog,
    addInfoDialog,
    addClassifyDialog,
    alarmSettingDialog,
    assetClassificationTree
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      data: [],
      form: {},
      loading: false,
      TableHeight: 500,
      backFixedNum: 1,
      visible: false, //添加分组
      placeholder: "请输入关键词",
      organizationloading: false,
      organizationTreeList: [],
      organizationTreeListLength:0,
      curSelectedDepartment:{}, //当前选中的组织树节点
      isShowAddClassifyDialog: false,
      classifyOptions1: [], //所属类别列表
      currChangeType: 'add', //添加分类
      isShowAddinfoDialog: false,
      curEventType: 'add',
      isCanDelete: false,
      selectedIds:[], //勾选可删除的ID
      selectedListIds:[], //勾选的所有ID  
      filedialogVisible:false,//导入弹窗 
      FileData: {
        url: `${window.newHttpConfig.URL_EASYMOCK}/Files/LocalFiles/资产物品导入模板.xlsx`,
      },
      isShowAlarmSetDialog: false,
      canRendererTableHeader: [
        {
          id: 1,
          label: "物品编号",
          prop: "goods_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "物品名称",
          prop: "goods_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        
        {
          id: 3,
          label: "规格型号",
          prop: "model",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },   
        {
          id: 5,
          label: "计量单位",
          prop: "unit_name",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: true,
        },
        {
          id: 6,
          label: "库存数量",
          prop: "surplus_count",
          width: "170",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "平均单价(元)",
          prop: "price",
          width: "170",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        
        {
          id: 8,
          label: "总价值(元)",
          prop: "total_price",
          width: "170",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "物品分类",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "存放地点",
          prop: "address",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "供应商",
          prop: "supplier_name",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 12,
          label: "联系人姓名",
          prop: "contact_person",
          width: "170",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "联系人电话",
          prop: "contact_phone",
          width: "170",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
        {
          id: 14,
          label: "操作",
          prop: "operation",
          width: "180",
          align: "center",
          signIndex: 13,
          sortable: false,
        }
      ]
    }
  },
  mounted() {
    this.loadOrganizationTree();
    this.$nextTick(() => {
      this.setHead();
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    // 获取物料分组树
    loadOrganizationTree() {
      this.organizationloading = true;
      let params ={}
      params.type = 2
      this.$client.GetGroupAssetsInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.organizationTreeList = res.context;
          this.organizationTreeListLength = this.organizationTreeList.length;
          this.classifyOptions1 =res.context[0].children
          this.organizationloading = false;
        } else {
          this.organizationloading = false;
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      }).catch(err => {})
    },
    // 选择某一组织
    selectDepartment(departmentInfo) {
      this.curSelectedDepartment = departmentInfo;
      this.loadData()
    },
    // 刷新资产分组
    refreshTreeList() {
      this.loadOrganizationTree();
      // 重新定位到目前组织树中
      this.loadData();
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
      ids.push(this.curSelectedDepartment.parents);
      this.$refs.organizationTree.setSelecedCheckedKeys(ids);
    },
    // 查询重置
    onSubmit(form) {
      this.form = form;
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载物品信息
    loadData() {
      this.loading = true;
      let params = {
        group_id : this.curSelectedDepartment.id
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      params = Object.assign({},params,this.form)
      this.$client.GetByPageGoodsInfo(params)
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context.list.goods_infos;
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
        this.loading = false;
      }) 
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
    // 添加、编辑分类物品弹窗
    openGoodsInfoDialog(type) {
      this.currChangeType = type;
      if(!!this.curSelectedDepartment && this.currChangeType == 'edit') {
        this.$refs.addClassifyDialog.ruleForm.id = this.curSelectedDepartment.id;
        this.$refs.addClassifyDialog.ruleForm.name = this.curSelectedDepartment.name;
        this.$refs.addClassifyDialog.ruleForm.code = this.curSelectedDepartment.code;
        this.$refs.addClassifyDialog.ruleForm.remark = this.curSelectedDepartment.remark;
        this.$refs.addClassifyDialog.sort = this.curSelectedDepartment.sort;
        this.$refs.addClassifyDialog.ruleForm.parents = this.curSelectedDepartment.parents;
      }
      if(!!this.curSelectedDepartment && this.currChangeType == 'add') {
        this.$refs.addClassifyDialog.parents_type = this.curSelectedDepartment.type;
        this.$refs.addClassifyDialog.ruleForm.parents = this.curSelectedDepartment.id;
        this.$refs.addClassifyDialog.grandfather_id = this.curSelectedDepartment.parents_id;

        if(this.curSelectedDepartment.sort === 0) {
          this.$refs.addClassifyDialog.sort = 1;
        }

        if(this.curSelectedDepartment.sort === 1) {
          this.$refs.addClassifyDialog.sort = 2;
        }
      }

      this.isShowAddClassifyDialog = true;
    },
    // 添加、编辑保存分类
    saveAddEditOrgClassifyInfo(form) {
      let successMessage = '';
      if (this.currChangeType == "add") {
        successMessage = "添加成功";
        delete form.id
      } else {
        successMessage = "编辑成功";
      }
      let params = {
        context: form
      }
      this.$client.SetGroupAssetsInfo(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.loadOrganizationTree();
            // 重新定位到目前组织树中
            this.locationCurNode();
            this.isShowAddClassifyDialog = false;
            this.$message({
              showClose: true,
              message: successMessage,
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
    // 删除分类
    sureDeleteClassifyGroup() {
      let ids = []
      ids.push(this.curSelectedDepartment.id)
      if(this.curSelectedDepartment.children && this.curSelectedDepartment.children.length) {
        this.curSelectedDepartment.children.forEach(item => {
          ids.push(item.id)
        })
      }
      let params = {
        context: ids
      }
      this.$client.DeleteGroupAssetsInfo(params)
        .then((res) => {
          if (res.head.result == "200") {
            // 排序成功重新加载组织树
            this.loadOrganizationTree();
            // 重新定位到目前上一级组织树中
            this.locationParentNode()
            this.visible = false;
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
            this.visible = false;
          }
        })
        .catch((err) => {
          this.visible = false;
        });
    },
    // 新建入库
    addGoodsInfo() {
      this.curEventType = 'add'
      this.isShowAddinfoDialog = true
    },
    // 查看、编辑
    upDateBaseInfo(row, type) {
      // console.log(this, type);
      this.curEventType = type
      setTimeout(() => {
        this.$refs.addInfoDialog.setData(row)
      }, 300)
      this.isShowAddinfoDialog = true
    },
    // 保存入库
    saveGoodsInfo(val) {
      let params = {
        context: {}
      }
      params.context = Object.assign({}, val)
      this.$client.SetTypeGoodsInfo(params).then(res => {
        if (res.head.result == "200") {
          this.isShowAddinfoDialog = false
          this.loadData()
          this.$message({
            showClose: true,
            message: res.head.describle,
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
    },
    // 勾选中的
    selectedList(list) {
      this.selectedIds = [];
      this.selectedListIds = [];
      if (list && list.length > 0) {
        list.forEach((item, index) => {
          this.selectedListIds.push(item.id)
          if(!item.surplus_count) {
            this.selectedIds.push(item.id);
          }
        });
      }
      this.isCanDelete = this.selectedIds.length ? true : false;
    },
    // 删除 
    deleteCurRowInfo(row) {
      if(!!row.surplus_count) {
        this.$message({
          showClose: true,
          message: '该物品库存未清空，请先清空物品库存',
          type: "warning",
        });
        return
      }
      this.selectedIds = [];
      this.selectedIds.push(row.id);
      // 删除
      this.onDelete()
    },
    // 批量删除
    onDelete() {
      let params = {
        context: this.selectedIds,
      };
      this.$client.DeleteGroupGoodsInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          this.selectedIds = [];
          this.isCanDelete = false;
          this.loadData();
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 打开导入弹窗
    openImportFilePop() {
      this.filedialogVisible = true;
    },
    // 导入信息Excel
    importInfoExcel(val){
      // alert(JSON.stringify(val))
      let formData = new FormData();
      formData.append("file", val.file);
      formData.append("type", val.radio);
      let params = formData;
      this.$client.ImportGoodsInfo(params)
      .then(res => {
        if(res.head.result == "200") {
          this.form = {};
          this.pageInfo.pageIndex = 1;
          this.pageInfo.pageCount = 0;
          this.loadData();
          this.filedialogVisible = false;
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h('p',null,res.head.describle));
          this.$msgbox({
            title: '提示',
            message: h('div',null, errorData),
            confirmButtonText: '确定',
          })
          // this.$message({ message: res.head.describle, type: "error" });
        }
      })
    },
    // 导出Excel
    exportFile(){
      let params = Object.assign({},this.form);
      let ids = [ ...this.selectedListIds ]
      if(ids.length) {
        params.ids = ids
      }
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.ExportGoodsInfo(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: res.head.describle})
        }
      })
    },
    // 打开提醒设置
    onAlarmSet() {
      this.$client.GetGoodsInventoryRule().then(res => {
        if (res.head.result == "200") {
          this.$refs.alarmSet.setData(res.context)
        }
      })
      this.isShowAlarmSetDialog = true
    },
    // 提醒设置保存
    saveAlarmSet(info) {
      let params = {
        context: {}
      }
      params.context = info
      this.$client.AddGoodsInventoryRule(params).then(res => {
        this.isShowAlarmSetDialog = false
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "success",
          });
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 计算表格高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH - 50;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.goods-information-management
  height: 100%
  width: 100%
  display: flex
  .left-box
    height: 100%
    width: 300px
    /deep/ .el-card__body
      height: calc(100% - 61px)
      overflow: auto
    /deep/ .el-card__header
      background-color: #F5F5F5
      padding: 12px 20px
  .right-box
    flex: 1
    margin-left: 10px
</style>
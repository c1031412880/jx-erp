<template>
  <div class="data-dictionaries-maintain">
    <div class="dictionaries-wrap">
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items:center;">
          <h2 style="white-space:nowrap;">数据字典分类</h2>
        </div>
        <div class="data-content-box">
          <el-button-group style="margin-bottom: 10px">
            <el-button size="small" type="primary" @click="addClassDictionariesShow" >添加分类</el-button>
            <el-button size="small" type="primary" @click="updateClassDictionariesShow">编辑分类</el-button>
            <el-popconfirm
              @confirm="deleteClassTree(1)"
              title="确定删除选中的分类吗？">
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="small" :disabled="isSort">删除分类</el-button>
            </el-popconfirm>
          </el-button-group>
          <el-button-group style="margin-bottom: 10px">
            <el-button size="small" type="primary" @click="addDictionariesShow">添加字典</el-button>
            <el-button size="small" type="primary" @click="updateDictionariesShow">编辑字典</el-button>
            <el-popconfirm
              @confirm="deleteClassTree(2)"
              title="确定删除选中的字典吗？">
              <el-button slot="reference" type="danger" icon="el-icon-delete" size="small" :disabled="isSort">删除字典</el-button>
            </el-popconfirm>
          </el-button-group>
          <dictionaries-tree
            placeholder="字典组搜索"
            :data="GetClassifyGroupTree"
            :loading="GetClassifyGroupLoading"
            @on-tree="setGroupTreeNode"
            @refresh-tree="loadOrganizationTree"
          ></dictionaries-tree>
        </div>
      </el-card>
    </div>
    <div class="data-content-wrap">
      <el-card class="box-card">
        <div
          slot="header"
          class="clearfix show-flex-box-r"
          style="height: 37px; flex-wrap: nowrap; align-items:center;">
          <h2 style="white-space:nowrap;">{{keyNode ? keyNode.c_name : '未选择'}}--数据字典选项</h2>
        </div>
        <div class="data-content-box">
          <sub-req
            :isSort="isSort"
            @on-delete="chackDelete"
            @adjust-sort-set="adjustSortSet"
            @on-add="addClassDictionariesDialogShow = true;classDicType = 'add'"></sub-req>
          <table-draggable-sort
            :TableHeight="TableHeight"
            :defaultSortProps="defaultSortProps"
            :tableConfig="tableConfig"
            :dataInfoList="data"
            v-if="isSort"></table-draggable-sort>
          <tr-table
            v-else
            :selectionShow="true"
            :data="data"
            :tableHeaderList="canRendererTableHeader"
            :isShowBottomOptions="false"
            :TableHeight="TableHeight"
            :loading="loading"
            :frontFixedNum="frontFixedNum"
            :backFixedNum="backFixedNum"
            @on-select-change-row="deleteRowShow">
            <template slot-scope="scope" slot="i_is_default">
              {{scope.data.i_is_default === 1 ? '是' : '否'}}
            </template>
            <template slot-scope="scope" slot="operation">
              <el-button type="text" size="mini" style="margin-left: 10px;" @click="editRowInfo(scope.data)">编辑</el-button>
              <el-popconfirm
                @confirm="deleteRowInfo([scope.data.i_id])"
                title="确定删除此条记录吗？">
                <el-button slot="reference" type="text" size="mini" style="margin-left: 10px;">删除</el-button>
              </el-popconfirm>
            </template>
          </tr-table>
        </div>
      </el-card>
    </div>

    <!--    添加组织-->
    <add-dictionaries-dialog
      ref="addDictionariesDialog"
      :curType="classType"
      :dialogType="dictionariesType"
      @on-ok="addDictionariesDialogSumb"
      :dialogBool.sync="addDictionariesDialogShow"></add-dictionaries-dialog>

    <!--添加字典-->
    <add-class-dictionaries-dialog
      ref="addClassDictionariesDialog"
      :curType="classDicType"
      @on-ok="addClassDictionariesDialogSumb"
      :dialogBool.sync="addClassDictionariesDialogShow"></add-class-dictionaries-dialog>
  </div>
</template>

<script>
import tableDraggableSort from "@/components/tableDraggableSort";
import addDictionariesDialog from './component/add-dictionaries-dialog'
import addClassDictionariesDialog from './component/add-class-dictionaries-dialog'
import dictionariesTree from './component/dictionaries-tree'
import SubReq from "./component/sub-req";
export default {
  name: "data-dictionaries-maintain",
  components: {SubReq, dictionariesTree, addDictionariesDialog, addClassDictionariesDialog, tableDraggableSort},
  data() {
    return {
      defaultSortProps:{
        value: "i_id",
        label: "c_name",
        sort: "i_seq",
      },
      tableConfig: {
        tableItems: [
          {
            label: "名称",
            prop: "label",
            width: "360",
            align: "left",
          },
          {
            label: "上下拖拽调整排序",
            prop: "sort",
            width: "190",
            align: "center",
          },
        ],
      },
      isSort: false, //是否排序
      sortData: [],
      selectClassList: [],
      dictionariesType: 1, //1分类 2字典
      classDicType: 'add',
      addClassDictionariesDialogShow: false,
      addDictionariesDialogShow: false,
      classType: 'add',
      GetClassifyGroupTree: [],
      GetClassifyGroupLoading: false,
      treeNode: null,
      keyNode: null,
      data:[], //维修项目列表
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: [
        {
          id: 1,
          label: "字典项名称",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所属字典",
          prop: "classify_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "是否默认",
          prop: "i_is_default",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "描述",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
      ],
      loading: false,
      TableHeight:500,
    }
  },
  mounted() {
    this.loadOrganizationTree()
    this.setHead()
  },
  methods: {
    // 返回父组节点
    outGroupTreeNode(nodes,node, key = 'i_id') {
      let groupNode  = null
      const out = (as, a) => {
        for(let i =0;i<as.length;i++) {
          if (as[i][key] === node[key]) {
            groupNode = a
            break
          } else {
            if (as[i].children) {
              out(as[i].children, as[i])
            }
          }
        }
      }
      out(nodes,node)
      return groupNode
    },
    // 更新排序数据
    updateSortInfo(tableData) {
      console.log(tableData)
      let data = []
      tableData.forEach(item => {
        data.push({
          i_id: item.value,
          i_seq: item.sort
        })
      })
      this.sortData = [...data]
    },
    // 排序提交
    adjustSortSet(isSort) {
      this.isSort = !this.isSort
      console.log(isSort)
      if (isSort) {
        if (!this.sortData.length) {
          this.$message({showClose: true, message: '暂无数据可供调整', type: "error",});
          return false
        }
        this.$client.dicSortDictionaryManage({context: this.sortData}).then(req => {
          this.loadData()
          if (req.head.result === '200') {
            this.$message({showClose: true, message: req.head.describle, type: "success",});
          } else {
            this.$message({showClose: true, message: req.head.describle, type: "error",});
          }
        })
      }
    },
    // 分类添加初始化
    addClassDictionariesShow() {
      this.classType='add'
      this.addDictionariesDialogShow = true
      this.dictionariesType = 1
      if (this.treeNode) {
        this.$refs.addDictionariesDialog.ruleForm.i_p_id = this.treeNode.i_id
      }
    },
    // 分类编辑初始化
    updateClassDictionariesShow() {
      if(!this.treeNode) {
        this.$message({showClose: true, message: '请选择分类节点编辑', type: "error",});
        return false
      }
      if(!this.treeNode.i_id) {
        this.$message({showClose: true, message: '总组织节点不能编辑', type: "error",});
        return false
      }
      this.classType='update'
      this.addDictionariesDialogShow = true
      this.dictionariesType = 1
      this.$refs.addDictionariesDialog.ruleForm.i_p_id = this.outGroupTreeNode([...this.GetClassifyGroupTree], this.treeNode).i_id
      this.$refs.addDictionariesDialog.ruleForm.i_id = this.treeNode.i_id
      this.$refs.addDictionariesDialog.ruleForm.c_name = this.treeNode.c_name
    },
    // 字典组添加初始化
    addDictionariesShow() {
      if (this.treeNode) {
        this.$refs.addDictionariesDialog.ruleForm.i_p_id = this.treeNode.i_id
      } else {
        this.$message({showClose: true, message: '请选择类型组织添加字典值', type: "error",});
        return false
      }
      this.classType='add'
      this.addDictionariesDialogShow = true
      this.dictionariesType = 2
    },
    // 字典组编辑初始化
    updateDictionariesShow() {
      if(!this.keyNode) {
        this.$message({showClose: true, message: '请选择字典节点编辑', type: "error",});
        return false
      }
      this.classType='update'
      this.addDictionariesDialogShow = true
      this.dictionariesType = 2
      this.$refs.addDictionariesDialog.ruleForm.i_p_id = this.outGroupTreeNode([...this.GetClassifyGroupTree], this.keyNode).i_id
      this.$refs.addDictionariesDialog.ruleForm.i_id = this.keyNode.i_id
      this.$refs.addDictionariesDialog.ruleForm.c_name = this.keyNode.c_name
      this.$refs.addDictionariesDialog.ruleForm.c_key = this.keyNode.c_key
    },
    // 分类 字典提交
    addDictionariesDialogSumb(form) {
      this.addDictionariesDialogShow = false
      this.$client.addDictClassifyDictionaryManage({context: form}).then(req => {
        this.loadOrganizationTree()
        if (req.head.result === '200') {
          this.$message({showClose: true, message: req.head.describle, type: "success",});
        } else {
          this.$message({showClose: true, message: req.head.describle, type: "error",});
        }
      })
    },
    // 字典提交
    addClassDictionariesDialogSumb(form) {
      form.i_main_id = this.keyNode.i_id
      console.log(form)
      // addDictDetailDictionaryManage
      this.$client.addDictDetailDictionaryManage({context: form}).then(req => {
        this.addClassDictionariesDialogShow = false
        this.loadData()
        if (req.head.result === '200') {
          this.$message({showClose: true, message: req.head.describle, type: "success",});
        } else {
          this.$message({showClose: true, message: req.head.describle, type: "error",});
        }
      })
    },
    // 编辑字典表单初始化
    editRowInfo(info) {
      this.classDicType = 'update'
      this.addClassDictionariesDialogShow = true
      this.$refs.addClassDictionariesDialog.ruleForm.i_id = info.i_id
      this.$refs.addClassDictionariesDialog.ruleForm.c_name = info.c_name
      this.$refs.addClassDictionariesDialog.ruleForm.i_is_default = info.i_is_default
      this.$refs.addClassDictionariesDialog.ruleForm.i_main_id = info.i_main_id
      this.$refs.addClassDictionariesDialog.ruleForm.c_remark = info.c_remark
    },
    // 分类树删除
    deleteClassTree(type = 1) {
      let ids = []
      if (type === 1) {
        if(!this.treeNode) {
          this.$message({showClose: true, message: '请选择需要删除的分类节点', type: "error",});
          return false
        }
        if(!this.treeNode.i_id) {
          this.$message({showClose: true, message: '根组织节点不可删除', type: "error",});
          return false
        }
        ids.push(this.treeNode.i_id)
      } else {
        if(!this.keyNode) {
          this.$message({showClose: true, message: '请选择需要删除的字典节点', type: "error",});
          return false
        }
        ids.push(this.keyNode.i_id)
      }
      this.$client.batchDeleteClassifyDictionaryManage({context: ids}).then(req => {
        this.loadOrganizationTree()
        if (req.head.result === '200') {
          this.$message({showClose: true, message: req.head.describle, type: "success",});
        } else {
          this.$message({showClose: true, message: req.head.describle, type: "error",});
        }
      })
    },
    // 删除详情选项初始化
    deleteRowShow(rows) {
      console.log(rows)
      this.selectClassList = [...rows]
    },
    // 批量删除
    chackDelete() {
      let ids = []
      this.selectClassList.forEach(item => {
        ids.push(item.i_id)
      })
      this.deleteRowInfo(ids)
    },
    // 删除字典
    deleteRowInfo(ids = []) {
      if(!ids.length) {
        this.$message({showClose: true, message: '请选择需要删除的字典项', type: "error",});
        return false
      }
      this.$client.batchDeleteDicDictionaryManage({context: ids}).then(req => {
        this.loadData()
        if (req.head.result === '200') {
          this.$message({showClose: true, message: req.head.describle, type: "success",});
        } else {
          this.$message({showClose: true, message: req.head.describle, type: "error",});
        }
      })
    },
    // 计算高度
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.TableHeight = maxh - 160;
      }, 60);
    },
    // 设置组织选中节点
    setGroupTreeNode(node) {
      this.sortData = []
      this.selectClassList = []
      this.isSort = false
      if (node.type === 2) {
        this.keyNode = node
        this.treeNode = null
        this.loadData()
      } else {
        this.treeNode = node
        this.keyNode = null
      }
    },
// 获取组织tree信息
    loadOrganizationTree() {
      this.GetClassifyGroupLoading = true;
      this.$client.getClassyfyTreeDataBase()
        .then(res => {
          this.GetClassifyGroupLoading = false;
          if (res.head.result == "200") {
            this.GetClassifyGroupTree = [{
              i_id: 0,
              c_name: '分类树',
              type: 1,
              children: [...res.context]
            }];
            // this.GetClassifyGroupTree = res.context;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
        this.GetClassifyGroupTree = []
        this.GetClassifyGroupLoading = false;
      })
    },
    // 获取数据
    loadData() {
      this.loading = true;
      this.$client.listDictionaryManage({i_id: this.keyNode.i_id})
        .then(res => {
          this.loading = false;
          if (res.head.result == "200") {
            this.data = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
        this.data = []
        this.loading = false;
      })
    }
  },
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.data-dictionaries-maintain{
  width 100%
  height 100%
  display flex
  .box-card{
    height 100%;
    .data-content-box{
      height 100%
      overflow-y auto
    }
  }
  .dictionaries-wrap{
    margin-right 10px
    flex 0 0 350px
    width 350px
    height 100%
  }
  .data-content-wrap{
    flex 1
    height 100%
  }
}
.data-dictionaries-maintain /deep/ .el-card__header {
  background-color: #F5F5F5;
  padding: 12px 20px;
  font-weight 600 !important
}

.data-dictionaries-maintain /deep/ .el-card__body {
  height calc(100% - 62px)
}
</style>

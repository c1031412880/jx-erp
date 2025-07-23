<template>
  <div class="address-book">
    <el-card class="content-left">
      <div slot="header" class="clearfix">
        <span>分组树</span>
      </div>
      <div class="tree-box">
        <div class="btn-box">
          <el-button v-if="$isPowerShow('add')" @click="addEditGroup('add')" type="primary" size="mini">添加</el-button>
          <el-button v-if="$isPowerShow('edit')" @click="addEditGroup('edit')" type="primary" size="mini">编辑</el-button>
          <el-popover
            placement="bottom"
            title="操作确认"
            width="400"
             v-if="$isPowerShow('del')"
            v-model="visible">
            <div class="show-flex-box-r" style="">
              <span style="margin-right: 10px; color: #FF9900;" class="show-flex-box-r">
                <i class="el-icon-question" style="font-size: 25px;"></i>
              </span>
              <div class="show-flex-box-c">
                <!-- <p style="font-size: 18px; margin-bottom: 5px;">该日程下共关联了5个维修班组，5个人员。是否确定删除？ 确定后 删除车间、班组信息，解除关联人员关系</p> -->
                <span style="color:#F56C6C">是否确定删除？</span>
              </div>
            </div>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="visible = false">取消</el-button>
              <el-button @click="deleteGroup" type="primary" size="mini">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" size="mini" style="margin-left: 10px;">删除</el-button>
          </el-popover>
        </div>
        <div class="tree-content">
          <div class="tree-top">
            <el-tree
              ref="deptTree"
              :data="firstTreeData"
              node-key="i_id"
              :props="defaultProps"
              v-loading="firstTreeLoading"
              :highlight-current="true"
              :check-on-click-node="true"
              @node-click="handleNodeClick"
              :default-expanded-keys="firstDefaultKeys"
              :current-node-key="firstCurrentNodeKey">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                  <i style="margin-right: 5px; color:#409EFF" :class="'el-icon-notebook-1'"></i>
                  <span style="margin-right: 25px">{{ node.label }}</span>
                </span>
              </span>
            </el-tree>
          </div>
          <div class="tree-bottom">
            <el-tree
              ref="publicTree"
              :data="secondTreeData"
              node-key="id"
              :props="defaultProps"
              v-loading="secondTreeLoading"
              :highlight-current="true"
              :check-on-click-node="true"
              @node-click="handleNodeClick"
              :default-expanded-keys="secondDefaultKeys"
              :current-node-key="secondCurrentNodeKey">
              <span class="custom-tree-node" slot-scope="{ node, data }">
                <span>
                  <i style="margin-right: 5px; color:#409EFF" :class="'el-icon-notebook-1'"></i>
                  <span style="margin-right: 25px">{{ node.label }}</span>
                </span>
              </span>
            </el-tree>
          </div>
        </div>
      </div>
    </el-card>
    <el-card class="content-right">
      <sub-req
        ref="head"
        :type="type"
        @on-ok="onSubmit"
        @on-export="exportTableList"
        @on-add="openPublicInfo">
      </sub-req>
      <tr-table
        :selectionShow="false"
        :data="data"
        :loading="loading"
        :TableHeight="TableHeight"
        :tableHeaderList="canRendererTableHeader"
        :isShowBottomOptions="false"
        :frontFixedNum="frontFixedNum"
        :backFixedNum="backFixedNum"
      >
        <template slot-scope="scope" slot="phone">
          <span>{{setPhone(scope.data)}}</span>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button v-if="$isPowerShow('update')" @click="openPublicInfo(scope.data)" type="text" size="mini">编辑</el-button>
          <el-button @click="openDetailInfo(scope.data)" type="text" size="mini">查看</el-button>
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
        :total="pageInfo.pageCount"
      >
      </el-pagination>
    </el-card>

    <div class="dialog-div">
      <add-group ref="addGroup" @save-add-edit="saveAddGroup" :dialogBool.sync="addGroupVisible" :title="addGroupTitle"></add-group>
      <edit-company-info ref="editCompany" @save-edit="saveEditCompanyInfo" :dialogBool.sync="editCompanyVisible" :title="addPublicTitle" :isEdit="isEdit"></edit-company-info>
      <add-public-info ref="addPublic" @save-add-edit="saveAddPublicInfo" :publicGroupList="publicGroupList" :dialogBool.sync="addPublicVisible" :title="addPublicTitle" :isEdit="isEdit"></add-public-info>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/utils/auth'
import { encryptionNum } from '@/utils/index'
import subReq from "./component/sub-req";
import addGroup from "./component/add-group";
import addPublicInfo from "./component/add-public-info";
import editCompanyInfo from "./component/edit-company-info";
export default {
  name: 'address-book',
  components: {
    subReq,
    addGroup,
    addPublicInfo,
    editCompanyInfo
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      user_id: Number(JSON.parse(getUser()).user_id),
      visible: false,
      firstTreeData: [],
      secondTreeData: [],
      firstDefaultKeys:[],
      secondDefaultKeys:[],
      firstCurrentNodeKey: '',
      secondCurrentNodeKey: '',
      firstTreeLoading: false,
      secondTreeLoading: false,
      defaultProps: {
        children: "children",
        label: "c_name",
      },
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      addGroupVisible: false,
      addGroupTitle: '添加分组',
      editCompanyVisible: false,
      editCompanyTitle: '编辑',
      addPublicVisible: false,
      addPublicTitle: '添加',
      selectTreeNode: {},
      type: false,
      publicGroupList: [],
      isEdit: false,
      customSettingList1: [
        {
          id: 1,
          label: "部门",
          prop: "dept_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        // {
        //   id: 3,
        //   label: "工号",
        //   prop: "work_code",
        //   width: "130",
        //   align: "center",
        //   signIndex: 2,
        //   sortable: false,
        // },
        {
          id: 3,
          label: "手机号码",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
          notTooltip: true
        },
        {
          id: 4,
          label: "分机号",
          prop: "extension_number",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
          notTooltip: true
        },
        {
          id: 5,
          label: "短号",
          prop: "short_number",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "电子邮箱",
          prop: "e_mail",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex: 6,
          sortable: false,
        }
      ], //公司 
      customSettingList2: [
        {
          id: 1,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: true,
        },
        {
          id: 2,
          label: "所在分组",
          prop: "group_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: true,
        },
        {
          id: 3,
          label: "电话号码",
          prop: "phone",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "电子邮件",
          prop: "email",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "办公号码",
          prop: "public_phone",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "公司",
          prop: "company",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "职位",
          prop: "position",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "操作",
          prop: "operation",
          width: "220",
          align: "center",
          signIndex: 7,
          sortable: false,
        }
      ], //公共
    }
  },
  mounted() {
    // console.log(this.$dataCenterHttp.UpdateErpPersonInfo);
    this.$nextTick(() => {
      this.setHead()
      this.getDeptSelectTree()
      this.getPublicSelect()
    })
  },
  methods: {
    // 获取组织树
    getDeptSelectTree() {
      this.firstTreeLoading = true
      this.$client.getUserEmps({
          is_contain_emp: false,
          show_all: false
        }).then((res) => {
          this.firstTreeLoading = false
          if (res.head.result === "200") {
            this.firstTreeData = res.context;
            if(res.context.length > 0) {
              setTimeout(() => {
                // console.log(this.$refs, res.context[0].i_id, this.$refs.deptTree);
                this.firstCurrentNodeKey = res.context[0].i_id
                this.firstDefaultKeys.push(this.firstCurrentNodeKey)
                this.$refs['deptTree'].setCurrentKey(this.firstCurrentNodeKey)
                let node =  this.$refs['deptTree'].getCurrentNode(this.firstCurrentNodeKey)
                this.handleNodeClick(node)
              }, 30);
            }
          }
        }).catch((err) => {this.firstTreeLoading = false});
      
    },
    // 获取公共通讯录
    getPublicSelect() {
      this.secondTreeLoading = true
      let params = { user_id: this.user_id }
      this.$client.GetCommunicateGroupSysMenu(params)
        .then((res) => {
          this.secondTreeLoading = false
          if (res.head.result === "200") {
            this.secondTreeData = [
              {
                id: 999999,
                c_name: '公共通讯录',
                children: res.context,
                type: 0
              },
            ]
            this.publicGroupList = JSON.parse(JSON.stringify(res.context))
          }
        }).catch((err) => {this.secondTreeLoading = false});
    },
    // 添加编辑公共通讯录分组
    addEditGroup(type) {
      this.addGroupTitle = type === 'add' ? '添加分组' : '编辑分组'
      if((type === 'edit' && this.selectTreeNode.type) || (type === 'edit' && this.selectTreeNode.c_name === '公共通讯录')) {
        this.$message.error('请选择公共通讯录分组进行编辑')
        return false
      }else if(type === 'edit') {
        this.$refs.addGroup.form.id = this.selectTreeNode.id
        this.$refs.addGroup.form.c_name = this.selectTreeNode.c_name
        this.$refs.addGroup.form.remark = this.selectTreeNode.remark
      }
      this.addGroupVisible = true
    },
    // 保存公共通讯录分组
    saveAddGroup(form) {
      let params = {
        context:{}
      }
      params.context = form
      params.context.user_id = this.user_id
      this.$client.AddCommunicateGroupSysMenu(params)
        .then((res) => {
          this.addGroupVisible = false
          if (res.head.result === "200") {
            this.$message.success('保存成功')
            this.getPublicSelect()
            // 重新定位到选中节点
            if(!this.selectTreeNode.type) {
              setTimeout(() => {
                this.locationCurNode()
              }, 300);
            }
          }else {
            this.$message.error('保存失败')
          }
        }).catch((err) => {
          this.addGroupVisible = false
          console.log(err);
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 删除公共通讯录分组
    deleteGroup() {
      if(this.selectTreeNode.type || this.selectTreeNode.c_name === '公共通讯录') {
        this.$message.error('请选择要删除的公共通讯录分组')
        return false
      }
      let params = {
        context: this.selectTreeNode.id
      }
      this.$client.DelCommunicateGroupSysMenu(params)
        .then((res) => {
          this.addGroupVisible = false
          if (res.head.result === "200") {
            this.$message.success('删除成功')
            this.getPublicSelect()
            this.visible = false
            // 重新定位到父主节点
            setTimeout(() => {
              this.locationCurParentNode()
            }, 300);
          }else {
            this.$message.error('删除失败')
          }
        }).catch((err) => {
          this.addGroupVisible = false
          console.log(err);
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    // 重新定位到选中节点
    locationCurNode() {
      // console.log(this.selectTreeNode.id,this.$refs['publicTree']);
      this.secondCurrentNodeKey = this.selectTreeNode.id
      this.secondDefaultKeys.push(this.secondCurrentNodeKey)
      this.$refs['publicTree'].setCurrentKey(this.secondCurrentNodeKey)
      let node =  this.$refs['publicTree'].getCurrentNode(this.secondCurrentNodeKey)
      this.handleNodeClick(node)
    },
    // 定位到父主节点
    locationCurParentNode() {
      this.firstCurrentNodeKey = 999999
      this.firstDefaultKeys.push(this.firstCurrentNodeKey)
      this.$refs['publicTree'].setCurrentKey(this.firstCurrentNodeKey)
      let node =  this.$refs['publicTree'].getCurrentNode(this.firstCurrentNodeKey)
      this.handleNodeClick(node)
    },
    // 点击树节点
    handleNodeClick(data) {
      console.log('节点点击',data)
      if(!!data.type) {
        this.secondCurrentNodeKey = ''
        this.$refs['publicTree'].setCurrentKey()
      }else {
        this.firstCurrentNodeKey = ''
        this.$refs['deptTree'].setCurrentKey()
      }
      this.type = (!!data.type || (!data.type && data.c_name === '公共通讯录')) ? true : false
      this.pageInfo.pageIndex = 1
      this.pageInfo.pageCount = 0
      this.canRendererTableHeader = null
      this.canRendererTableHeader = !!data.type ? this.customSettingList1 : this.customSettingList2
      if(!!data.children) delete data.children
      this.selectTreeNode = Object.assign({}, data)
      if(data.c_name === '公共通讯录') this.selectTreeNode.id = 0
      this.loadData()
    },
    onSubmit(form) {
      this.form = form
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 加载数据
    loadData() {
      this.loading = true
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      if(!!this.selectTreeNode.type) {
        // 获取公司人员通讯录列表
        params.context.dept_id = this.selectTreeNode.i_id
        // params.context.user_id = this.user_id
        this.$client.GetCompanyCommunicateSysMenu(params)
        .then(res => {
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
          this.loading = false;
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
      }else {
        // 获取公共通讯录列表
        params.context.group_id = this.selectTreeNode.id
        params.context.user_id = this.user_id
        this.$client.GetCommunicateBookSysMenu(params)
        .then(res => {
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
          this.loading = false;
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
      }
    },
    // 导出
    exportTableList() {
      let params = {context: {}}
      params.context = Object.assign({}, this.form);
      params.context.page_index = this.pageInfo.pageIndex;
      params.context.page_size = this.pageInfo.pageSize;
      if(!!this.selectTreeNode.type) {
        // 导出公司人员通讯录列表
        params.context.dept_id = this.selectTreeNode.i_id
        // params.context.user_id = this.user_id
        this.$client.ExportCompanyCommunicateSysMenu(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })
      }else {
        // 导出公共通讯录列表
        params.context.group_id = this.selectTreeNode.id
        params.context.user_id = this.user_id
        this.$client.ExportPublicCommunicateSysMenu(params)
        .then(res => {
          if(res.head.result == '200') {
            window.location.href = res.context
            this.$message({type: 'success', message: '导出成功'})
          }else{
            this.$message({type: 'error', message: '导出失败'})
          }
        })
      }
    },
    // 添加公共通讯录联系人
    openPublicInfo(info) {
      this.isEdit = false
      this.addPublicTitle = !!info ?  '编辑' : '添加'
      if(this.selectTreeNode.type) {
        setTimeout(() => {
          this.$refs['editCompany'].setData(info)
        }, 100);
        this.editCompanyVisible = true
      }else {
        if(!!info) {
          setTimeout(() => {
            this.$refs['addPublic'].setData(info) 
          }, 100);
        }
        this.addPublicVisible = true
      }
    },
    // 查看详情
    openDetailInfo(row) {
      this.isEdit = true
      this.addPublicTitle = '查看'
      setTimeout(() => {
        if(this.selectTreeNode.type) {
          this.$refs['editCompany'].setData(row)
          this.editCompanyVisible = true
        }else {
          this.$refs['addPublic'].setData(row)
          this.addPublicVisible = true
        }
      }, 100);
    },
    // 保存公共通讯录联系人
    saveAddPublicInfo(info) {
      let params = {context: {}}
      params.context = Object.assign({}, info);
      this.$client.AddPublicCommunicateSysMenu(params)
        .then(res => {
          if (res.head.result == "200") {
            this.addPublicVisible = false
            this.loadData()
            this.$message({type: 'success', message: '保存成功'})
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.addPublicVisible = false
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 保存公司通讯录联系人
    saveEditCompanyInfo(info) {
      let params = {}
      params = Object.assign({}, info);
      this.$dataCenterHttp.UpdateErpPersonInfo(params)
        .then(res => {
          // console.log(res);
          if (res.errcode == "200") {
            this.editCompanyVisible = false
            this.loadData()
            this.$message({type: 'success', message: '保存成功'})
          } else {
            this.$message({
              showClose: true,
              message: res.errmsg,
              type: "error",
            });
          }
        }).catch(err => {
          console.log(err);
          this.editCompanyVisible = false
          // this.$message({
          //   showClose: true,
          //   message: err.errmsg,
          //   type: "error",
          // });
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
    // 设置手机号隐藏
    setPhone(row) {
      let str = ''
      
      if(row.phone && row.phone_view == 3) {
        str = encryptionNum(row.phone, 0, 0)
      }else if(row.phone && row.phone_view == 2) {
        str = encryptionNum(row.phone, 3, 4)
      }else {
        str = row.phone
      }
      return str
    },
    // 计算表格高度 和初始化表头
    setHead() {
      this.canRendererTableHeader = !!this.selectTreeNode.type ? this.customSettingList1 : this.customSettingList2;
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - ph - 25 ;
      }, 60);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.address-book {
  height: 100%;
  width: 100%;
  display: flex;
  .content-left {
    width: 350px;
    height: 100%;
    .tree-box {
      height: 100%;
      width: 100%;
      .tree-content {
        height: calc(100% - 28px);
        width: 100%;
        overflow-y: auto;
        margin-top: 10px;
        .tree-top {
          box-shadow: 0 2px 6px rgba(0, 0, 0, .1);
          height: 50%;
          overflow-y: auto;
        }
        .tree-bottom {
          box-shadow: 0 2px 6px rgba(0, 0, 0, .1);
          height: 50%;
          overflow-y: auto;
        }
      }
    }
    /deep/ .el-card__header {
      background-color: #F5F5F5
    }
    /deep/ .el-card__body {
      height: calc(100% - 53px);
      padding: 10px;
    }
  }
  .content-right {
    flex: 1;
    height: 100%;
    /deep/ .el-card__body {
      padding: 10px;
    }
  }
  
}
</style>
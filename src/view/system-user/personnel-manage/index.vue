<template>
  <personnel-manage-data-center />
</template>
<script type="text/ecmascript-6">
export default {
  name: "personnel-manage",
}
</script>
<!--
<template>
  <div class="personnel-manage">
    <sub-req
      ref="head"
      @on-add="userInfoDialog = true"
      @on-batch-end="batchEnd"
      @on-ok="onSubmit"
    ></sub-req>
    <tr-table
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :TableHeight="TableHeight"
      :loading="loading || headerLoading"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
      @on-select-change-row="selectChange"
    >
      <template slot-scope="scope" slot="operation">
        <el-button type="primary" size="mini" @click="userInfoDialogShow(scope.data)" v-if="$isPowerShow('edit')">编辑</el-button>
        <el-popconfirm
          title="确定停用当前用户的账号么？"
          @confirm="enabled(scope.data)"
          v-if="$isPowerShow('stop') && scope.data.c_state != '3'"
        >
          <el-button type="primary" size="mini" slot="reference" :disabled="scope.data.c_state == '3'">停用</el-button>
        </el-popconfirm>
        <el-button type="primary" size="mini" @click="userInfoDialogShow1(scope.data)" v-if="$isPowerShow('role-power')">查看权限</el-button>
        <el-popconfirm
          title="确定重置当前账号密码么？"
          @confirm="resetPassword(scope.data)"
          v-if="$isPowerShow('reset-passwords')"
        >
          <el-button type="primary" size="mini" slot="reference">重置密码</el-button>
        </el-popconfirm>
        <el-popconfirm
          title="确定删除当前账号吗？"
          @confirm="deleteUserInfo(scope.data)"
          v-if="$isPowerShow('del') && scope.data.c_state == '3'"
        >
          <el-button type="danger" size="mini" slot="reference" :disabled="scope.data.c_state != '3'">删除</el-button>
        </el-popconfirm>
      </template>
      <template slot-scope="scope" slot="c_state">
        <span>
          {{scope.data.c_state == 1 ? '永久'
          : scope.data.c_state == 2 ? '临时'
          : scope.data.c_state == 3 ? '停用'
          : '停用'}}
        </span>
      </template>
      <template slot-scope="scope" slot="c_not_employee">
        <span>
          {{scope.data.c_not_employee == 1 ? '虚拟用户' : `真实员工`}}
        </span>
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

<!--    用户信息编辑
    <user-info-dialog
      :dialogBool.sync="userInfoDialog"
      ref="userInfoDialog"
      title="用户编辑"
      @on-ok="userInfoDialogOk"
    ></user-info-dialog>
    <infoDialog
      :dialogBool.sync="infoDialog"
      ref="infoDialog"
    ></infoDialog>
    <custom-setting
      :dialogBool.sync="customSettingVialogVisible"
      :customSettingList="customSettingList"
      :canRendererTableHeader="canRendererTableHeader"
      :customSettingShowList="customSettingShowList"
      :frontFixedNum="frontFixedNum"
      :backFixedNum="backFixedNum"
    ></custom-setting>

    <drawer-dialog
      :drawer.sync="drawerdialogVisible"
      @on-ok="onSubmit"
    ></drawer-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import subReq from "./component/sub-req";
import drawerDialog from "./component/drawer-dialog";
import userInfoDialog from './component/user-info-dialog'
import infoDialog from './component/info-dialog'
// import {
//   export_car_model,
// } from "@/api/erp";

export default {
  name: "personnel-manage",
  components: {
    subReq,
    drawerDialog,
    userInfoDialog,
    infoDialog,
  },
  data() {
    return {
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      selectList: [],
      userInfoDialog: false,
      infoDialog: false,
      form: {},
      data: [],
      loading: false,
      TableHeight: 500,
      customSettingVialogVisible: false,
      drawerdialogVisible: false,
      customSettingList: [
        {
          id: 1,
          label: "用户账号",
          prop: "c_login_id",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "用户姓名",
          prop: "c_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所属组织",
          prop: "department_name",
          width: "320",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "工号",
          prop: "c_worker_id",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "岗位",
          prop: "position_name",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "用户类型",
          prop: "c_not_employee",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "绑定手机号",
          prop: "c_phone",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: true,
        },
        {
          id: 8,
          label: "拥有角色",
          prop: "contain_role",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "用户状态",
          prop: "c_state",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "可登录平台",
          prop: "string_platform",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 11,
          label: "备注",
          prop: "c_remark",
          width: "130",
          align: "center",
          signIndex: 10,
          sortable: false,
        },
        {
          id: 12,
          label: "最近登陆时间",
          prop: "login_time",
          width: "150",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 13,
          label: "操作",
          prop: "operation",
          width: "320",
          align: "center",
          signIndex: 12,
          sortable: false,
        },
      ],
      frontFixedNum: 2, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingShowList: null,
      titlesId:'', //当前表头的id
      menu_code:'',
      headerLoading: false
    };
  },
  created() {
    this.menu_code = this.$route.meta.code
    this.reqTitleTable()
  },
  mounted() {
    this.$nextTick(() => {
      this.setHead(initialize');
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
      this.$refs.head.onSubmit();
    });
  },
  methods: {
    updateTableHeader(newestTableHeaderList) {
      this.$httpTableHeader.saveTableHeader(this.titlesId,this.menu_code,newestTableHeaderList).then(res => {
        
        this.reqTitleTable()
      }).catch(err => {
        
      })
    },
    // 获取表头
    reqTitleTable() {
      this.headerLoading = true;
      this.$httpTableHeader.reqTableHeader(this.menu_code,this.customSettingList).then(res => {
        this.titlesId = res.titlesId;
        this.canRendererTableHeader = res.canRendererTableHeader;
        this.customSettingList = res.customSettingList;
        this.customSettingShowList = res.customSettingShowList;
        this.$forceUpdate();
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      }).catch(err => {
        setTimeout(() =>{
          this.headerLoading = false;
        },600)
      })
    },
    // 选中行赋值
    selectChange(list) {
      this.selectList = list
    },
    // 提交表单初始化
    userInfoDialogShow(item) {
      console.log(item)
      this.userInfoDialog = true
      setTimeout(() => {
        this.$refs.userInfoDialog.initFormData(item)
      }, 60)
    },
     // 提交表单初始化
    userInfoDialogShow1(item) {
      console.log(item)
      this.infoDialog = true
      setTimeout(() => {
        this.$refs.infoDialog.reqRolePriData(item)
        // this.$refs.infoDialog.initFormData(item)
      }, 60)
    },

    // 提交表单
    userInfoDialogOk(form) {
      if(!form.i_id) {
         this.$client.addUserSysPerson({context: form}).then(req => {
          this.userInfoDialog = false
          this.loadData()
          if (req.head.result === "200") {
            this.$message.success(req.head.describle);
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }else{
        this.$client.EditUserSysPerson({context: form}).then(req => {
          this.userInfoDialog = false
          this.loadData()
          if (req.head.result === "200") {
            this.$message.success(req.head.describle);
          } else {
            this.$message.error(req.head.describle);
          }
        })
      }
    },
    batchEnd() {
      if (!this.selectList.length) {
        this.$message.error('请选择需要操作的用户');
        return false;
      }
      this.$confirm('此操作将停用选择的用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let form = {
          context: []
        }
        this.selectList.forEach(item => {
          form.context.push(item.i_id)
        });
        this.$client.enabledSysPerson(form).then(req => {
          this.loadData()
          if (req.head.result === "200") {
            this.$message.success(req.head.describle);
          } else {
            this.$message.error(req.head.describle);
          }
        })
      })
    },
    // 停用当前用户
    enabled(info) {
      let form = {
        context: [info.i_id]
      }
      this.$client.enabledSysPerson(form).then(req => {
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 重置密码
    resetPassword(info) {
      let form = {
        id: info.i_id
      }
      this.$client.resetPasswordSysPerson(form).then(req => {
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 删除用户
    deleteUserInfo(info) {
      let form = {
        context: [info.i_id]
      }
      this.$client.DelUserSysPerson(form).then(req => {
        this.loadData()
        if (req.head.result === "200") {
          this.$message.success(req.head.describle);
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },

    onSubmit(form) {
      this.form = form;
      console.log(this.form);
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageCount = 0;
      this.loadData();
    },
    // 数据加载
    loadData() {
      this.loading = true;
      let content = this.form;
      content.page_index = this.pageInfo.pageIndex;
      content.page_size = this.pageInfo.pageSize;
      this.$client.listSysPerson(content).then(req => {
        console.log(req);
        this.loading = false;
        if (req.head.result === "200") {
          this.data = req.context.list;
          this.pageInfo.pageCount = req.context.total;
        } else {
          this.data = [];
          this.pageInfo.pageCount = 0;
        }
      })
    },
    // 打开高级筛选
    openAdvancedFilterPage() {
      this.drawerdialogVisible = true
    },
    // 打开自定义表头
    openSettingPageEvent() {
      this.customSettingVialogVisible = true
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

    exportExcel() {
      // export_car_model({}).then((req) => {
      //   console.log(req);
      //   if (req.head.result === "200") {
      //     window.location.href = req.content.path;
      //     this.$message({ message: "导出成功", type: "success" });
      //   } else {
      //     this.$message({ message: "导出失败", type: "error" });
      //   }
      // });
    },

    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        this.canRendererTableHeader = this.customSettingList;
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        let paginationH = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th - paginationH;
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.personnel-manage {
  width: 100%;
  height: 100%;
}
</style>
-->

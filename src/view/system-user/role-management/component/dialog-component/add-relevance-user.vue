<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="750px"
    
  >
    <div class="el-dialog-div">
      <el-form :inline="true" size="mini">
        <el-row>
          <el-form-item label="用户账号:">
            <el-input
              v-model="form.c_login_id"
              placeholder="搜索用户账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="用户姓名:">
            <el-input v-model="form.c_name" placeholder="搜索用户姓名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit()"
              >查询</el-button
            >
            <el-button type="" icon="el-icon-thumb" @click="reset()"
              >重置</el-button
            >
          </el-form-item>
        </el-row>
        <el-row>
          <div class="show-flex-box-r" style="align-items: center">
            <span
              style="
                font-size: 14px;
                font-weight: 700;
                white-space: nowrap;
                margin-right: 12px;
              "
              >已选用户:</span
            >
            <el-input
              clearable
              @clear="onClear"
              @input="inputOut"
              placeholder="请选择用户"
              prefix-icon="el-icon-search"
              size="mini"
              v-model="input_names" class="popover-input-box">
            </el-input>
            <!-- <el-input
              v-model="form.name"
              size="mini"
              placeholder="请选择用户"
            ></el-input> -->
          </div>
        </el-row>
      </el-form>

      <div class="table-content">
        <el-table
          :data="departmentUserList"
          :height="TabelHeight"
          ref="multipleTable"
          border
          :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '4px 0px',fontWeight: '800'}"
          :cell-style="{fontSize: '13px', padding: '4px 0px'}"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" fixed> </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
            fixed
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="c_login_id"
            align="center"
            label="用户账号"
            fixed
          ></el-table-column>
          <el-table-column
            prop="c_name"
            label="用户姓名"
            align="center"
            width="120"
            fixed
          ></el-table-column>
          <el-table-column
            min-width="120"
            prop="department_name"
            align="center"
            show-overflow-tooltip
            label="所属部门"
            fixed
          ></el-table-column>
          <el-table-column
            min-width="120"
            prop="c_remark"
            align="center"
            show-overflow-tooltip
            label="备注"
            fixed
          ></el-table-column>
        </el-table>
        <el-pagination
          style="margin: 10px 0px; float: right"
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
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <div
        class="show-flex-box-r"
        style="width: 100%; justify-content: flex-end; align-items: flex-end"
      >
        <el-button @click="dialogClose">取 消</el-button>
        <el-button type="primary" @click="updatePlaybill()">保 存</el-button>
      </div>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "关联用户",
    },
    // departmentUserList: [Array],
  },
  data() {
    return {
      form: {
        c_login_id: "",
        c_name: "",
      },
      pageInfo: {
        pageIndex: 1,
        pageSize: 20,
        pageCount: 0,
      },
      loading: false,
      TabelHeight: 300,
      departmentUserList:[],
      multipleSelection: [],
      selectedUserIds: [],
      input_names:"",
      input_names_old: "",
    };
  },
  mounted() {
    this.loadDepartmentUserList();
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs.multipleTable.doLayout()
        })
        this.loadDepartmentUserList();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    onSubmit() {
      this.loadDepartmentUserList();
    },
    reset() {
      this.form.c_login_id = "";
      this.form.c_name = "";
      this.pageInfo.pageIndex = 1;
      this.loadDepartmentUserList();
      this.onClear();
    },
    // 获取系统用户
    loadDepartmentUserList() {
      this.loading = true;
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      let params = info;
      params.page_index = this.pageInfo.pageIndex;
      params.page_size = this.pageInfo.pageSize;
      this.$client.listSysPerson(params)
      .then(res => {
        // console.log(JSON.stringify(res))
        if (res.head.result == "200") {
          this.departmentUserList = res.context.list;
          this.pageInfo.pageCount = res.context.total;
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

    handleSelectionChange(val) {
      this.selectedUserIds = [];
      this.multipleSelection = val;
      console.log(this.multipleSelection);
      // this.$emit("selected-mile-detail-list", this.multipleSelection);
      let names =[];
      this.multipleSelection.forEach(item => {
          names.push(item.c_name)
        })
      this.input_names = names.toString()
      this.input_names_old = names.toString()
      this.multipleSelection.forEach((item, index) => {
        this.selectedUserIds.push(item.i_id);
      });
    },
    
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    onClear() {
      this.input_names = ''
      this.input_names_old = ''
      this.toggleSelection(this.multipleSelection)
      // this.multipleSelection = []
      this.selectedUserIds = []
    },
    inputOut() {
      this.input_names = this.input_names_old.toString()
    },
    // 明细分页切换事件
    handleCurrentChange(idx) {
      this.pageInfo.pageIndex = idx;
      this.loadDepartmentUserList();
    },
     // 切换每页条数
    handleSizeChange(sizes) {
      this.pageInfo.pageIndex = 1;
      this.pageInfo.pageSize = sizes;
      this.pageInfo.pageCount = 0;
      this.loadDepartmentUserList();
    },

    updatePlaybill() {
      if(this.selectedUserIds.length > 0) {
        this.$emit("save-seleced-role-user", this.selectedUserIds);
      }else{
        this.$message({
          showClose: true,
          message: "请选择要关联的用户",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog__wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.table-content {
  margin-top: 20px;
}
</style>



<template>
  <div class="superior-department show-flex-box-c">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- <span>卡片名称</span> -->
        <!-- <el-button style="margin-left: 10px" type="primary" size="mini"
          >添加人员</el-button
        > -->
        <el-button type="primary" size="mini" @click="openSelectedUser" :disabled="curRoleType == 2 || curRoleType == 3"
          v-if="$isPowerShow('save_person')">关联用户</el-button
        >
        <el-button type="primary" size="mini" @click="deleteRelevanceUser" :disabled="curRoleType == 2 || curRoleType == 3"
          v-if="$isPowerShow('save_person')">移除用户</el-button
        >
      </div>
      <div class="department-list show-flex-box-c">
        <el-table
          :data="departmentUserList"
          :height="TabelHeight"
          ref="multipleTable"
          border
          highlight-current-row
          :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '4px 0px',fontWeight: '800'}"
          :cell-style="{fontSize: '13px', padding: '4px 0px'}"
          v-loading="loading"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        > 
          <el-table-column type="selection" width="55" > </el-table-column>
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="60"
          >
          </el-table-column>
          <el-table-column
            min-width="100"
            prop="login_id"
            align="center"
            label="用户账号"
          ></el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            align="center"
            width="120"
          ></el-table-column>
          <el-table-column
            min-width="120"
            prop="department"
            align="center"
            show-overflow-tooltip
            label="所属部门"
          ></el-table-column>
          <el-table-column
            min-width="160"
            prop="up_f_station"
            align="center"
            label="操作"
            v-if="curRoleType != 2"
          >
            <template slot-scope="scope">
              <el-popconfirm
                @confirm="deleteUserInfo(scope.row)"
                title="确定要删除此人员？"
                v-if="$isPowerShow('save_person')"
              >
                <el-button slot="reference" type="text" size="mini" :disabled="curRoleType == 3"
                  >移除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">

export default {
  watch:{
    curRoleInfo: {
      handler(newName, oldName) {
        setTimeout(() => {
          this.$refs.multipleTable.doLayout()
        },50)
      },
      immediate: true,
      deep: true
    }
  },
  props: {
    loading:{
      type: [Boolean],
      default: false
    },
    departmentUserList: [Array],
    curRoleType:[String,Number],
    curRoleInfo:[Object]
  },
  components: {
    
  },
  data() {
    return {
      isShowadjustSort: false,
      TabelHeight:400,
      multipleSelection:[],
      selectedUserIds:[],
    };
  },
  methods: {
    openSelectedUser() {
      this.$emit('open-selected-user')
    },
    handleSelectionChange(val) {
      this.selectedUserIds = [];
      this.multipleSelection = val;
      console.log(this.multipleSelection);
      this.$emit('selected-mile-detail-list',this.multipleSelection)
      this.multipleSelection.forEach((item,index) => {
        if(this.curRoleType) {
          this.selectedUserIds.push(item.id);
        }else {
          this.selectedUserIds.push(item.user_id);
        }
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
    // 移除人员
    deleteUserInfo(userInfo) {
      this.selectedUserIds = [];
      // this.toggleSelection(this.multipleSelection);
      let id = this.curRoleType ? userInfo.id : userInfo.user_id
      this.selectedUserIds.push(id);
      this.deleteRelevanceUser();
    },
    deleteRelevanceUser() {
      if(this.selectedUserIds.length < 1) {
        this.$message({
          showClose: true,
          message: "请勾选要移除角色的人员",
          type: "warning",
        });
        return
      }
      this.$emit("delete-relevance-user", this.selectedUserIds)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.superior-department {
  h3 {
    margin-bottom: 20px;
  }
}

.department-list {
  width: 100%;
  height: 500px;
  .department-item {
    width: 100%;
    height: 55px;
    border: 1px #eee solid;
    margin-bottom: 10px;
    cursor: pointer;
    align-items: center;

    >span {
      flex-grow: 1;
      padding: 20px;
      line-height: 15px;
      font-size: 14px;
    }

    >i {
      flex-shrink: 0;
      margin-right: 20px;
    }
  }

  .department-item:hover {
    background: #eee;
  }
}

// .department-list /deep/ .el-table__fixed-right{
//   height: 100% !important; //设置高优先，以覆盖内联样式
// }

</style>

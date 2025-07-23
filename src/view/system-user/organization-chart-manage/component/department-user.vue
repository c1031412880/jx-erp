<template>
  <div class="superior-department show-flex-box-c">
    <h3>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;部门人员</h3>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-button type="primary" size="mini" @click="adjustOrganization"
          :disabled="isShowadjustSort" v-if="$isPowerShow('edit')">调整组织</el-button
        >
        <el-button type="primary" size="mini" @click="adjustSort" v-if="$isPowerShow('edit')"
          >{{isShowadjustSort? '保存':'调整排序'}}</el-button
        >
      </div>
      <div class="department-list show-flex-box-c" v-if="!isShowadjustSort">
        <tr-table
          :selectionShow="true"
          :data="departmentUserList"
          :tableHeaderList="tableHeaderData"
          :isShowBottomOptions="false"
          :TableHeight="TabelHeight"
          :loading="loading"
          :frontFixedNum="1"
          :backFixedNum="1"
          @on-select-change-row="handleSelectionChange"
        >
        <template slot-scope="scope" slot="operation">
          <el-popconfirm
            @confirm="deleteUserInfo(scope.data)"
            title="确定要删除此人员？"
            v-if="$isPowerShow('edit')"
          >
            <el-button slot="reference" type="text" size="mini"
            :disabled="multipleSelection.length > 0"
              >移除部门</el-button
            >
          </el-popconfirm>
          <el-button
            type="text"
            size="mini"
            @click="adjustUser(scope.data)"
            style="margin-right: 10px"
            :disabled="multipleSelection.length > 0"
            v-if="$isPowerShow('edit')"
            >调整部门</el-button
          >
        </template>
      </tr-table>

      </div>
      <div class="adjust-sort-content" v-else>
        <table-draggable-sort
          :isShowIndex="true"
          :defaultSortProps="defaultSortProps"
          :tableConfig="tableConfig"
          :TableHeight="300"
          :dataInfoList="departmentUserList"
        ></table-draggable-sort>
      </div>
    </el-card>
  </div>
</template>

<script type="text/ecmascript-6">
import tableDraggableSort from "@/components/tableDraggableSort";
export default {
  props: {
    loading:{
      type: [Boolean],
      default: false
    },
    isShowAdjustOrganizationDialog:[Boolean],
    departmentUserList: [Array],
  },
  components: {
    tableDraggableSort,
  },
  watch:{
    isShowAdjustOrganizationDialog() {
      if(!this.isShowAdjustOrganizationDialog) {
        this.selectedUserIds = [];
      }
    }
  },
  data() {
    return {
      isShowadjustSort: false,
      TabelHeight:300,
      tableConfig: {
        tableItems: [
          {
            label: "姓名",
            prop: "label",
            width: "360",
            align: "left",
          },
          {
            label: "工号",
            prop: "worker_id",
            width: "360",
            align: "left",
          },
          {
            label: "岗位",
            prop: "post",
            width: "360",
            align: "left",
          },
          {
            label: "拖动顺序调整",
            prop: "sort",
            width: "190",
            align: "center",
          },
          // {
          //   label: "操作",
          //   prop: "operate",
          //   width: "160",
          //   align: "center",
          // },
        ],
      },
      tableHeaderData:[
        {
          id: 1,
          label: "用户账号",
          prop: "login_id",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "姓名",
          prop: "name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "工号",
          prop: "worker_id",
          width: "100",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "岗位",
          prop: "post",
          width: "120",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "操作",
          prop: "operation",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        }
      ],
      multipleSelection:[],
      selectedUserIds:[],
      newTableData:[],
      defaultSortProps:{
        value: "id",
        label: "name",
        sort: "sort",
        worker_id:"worker_id",
        post:"post"
      }
    };
  },
  methods: {
    // 更新排序
    updateSortInfo(tableData) {
      this.newTableData = [];
      console.log(tableData);
      tableData.forEach(item => {
        // delete item.label
        let obj = {
          id: item.value,
          sort: item.sort,
        };
        this.newTableData.push(obj)
      });
    },

    adjustSort() {
      if(this.isShowadjustSort) {
        // 保存
        if(this.newTableData.length > 0) {
          this.$emit('update-sore-event', this.newTableData, 'user')
        }
      }else{
        this.$emit('have-other-sore')
      }
      this.multipleSelection = [];
      this.selectedUserIds = [];
      this.isShowadjustSort = !this.isShowadjustSort;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(this.multipleSelection);
      this.$emit('selected-mile-detail-list',this.multipleSelection)
      this.multipleSelection.forEach((item,index) => {
        this.selectedUserIds.push(item.id);
      });
    },
    // 删除部门人员
    deleteUserInfo(userInfo) {
      this.$emit('removed-department-user',userInfo)
    },
    // 人员调整部门
    adjustUser(userInfo) {
      this.selectedUserIds.push(userInfo.id);
      this.adjustOrganization();
    },
    adjustOrganization() {
      this.$emit("adjust-organization-set", this.selectedUserIds)
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
  height: 300px;
}
.adjust-sort-content{
  // height: 300px;
}
// .superior-department /deep/ .el-table{
//   height: 300px !important;
// }

// .superior-department /deep/ .el-card>.el-card__body {
//   height: 100%;
// }
</style>

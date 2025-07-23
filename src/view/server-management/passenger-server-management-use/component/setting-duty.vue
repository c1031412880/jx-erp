<template>
  <el-dialog
    :visible="dialogBool"
    title="设置责任部门经办人"
    :before-close="dialogClose"
    width="780px"
  >
    <div class="el-dialog-div" ref="maintenanceProjectManage">
      <el-button size="mini" type="primary" :loading="loading" @click="add">添加</el-button>
      <tr-table
        ref="trTable"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="500"
      >
        <template slot-scope="scope" slot="dept_id">
          <get-department-select
            ref="personalTree"
            v-model="scope.data.dept_id"
            :isShowCheckbox="false"
            :placeholder="'请选择责任部门'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="false"
            @on-change="() => {
              return onSelectChange(scope.data.dept_id,scope.index)
            }"
          ></get-department-select>
        </template>
        <template slot-scope="scope" slot="person_ids">
          <el-select
            v-model="scope.data.person_ids"
            style="width: 100%"
            placeholder="请选择责任部门经办人"
            filterable 
            clearable
            multiple
          >
            <el-option
              v-for="(item, index) in userListMap[scope.data.dept_id]"
              :key="item.id + '|' + (index * 1)"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope" slot="manager_ids">
          <el-select
            v-model="scope.data.manager_ids"
            style="width: 100%"
            placeholder="请选择部门审核经办人"
            filterable 
            clearable
            multiple
          >
            <el-option
              v-for="(item, index) in userListMap[scope.data.dept_id]"
              :key="item.id + '|' + (index * 2)"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope" slot="supervisor_ids">
          <el-select
            v-model="scope.data.supervisor_ids"
            style="width: 100%"
            placeholder="请选择分管领导审核经办人"
            filterable 
            clearable
            multiple
          >
            <el-option
              v-for="(item, index) in userListMap[scope.data.dept_id]"
              :key="item.id + '|' + (index * 3)"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button size="mini" type="danger" @click="del(scope.index)">删除</el-button>
        </template>
      </tr-table>
    </div>
    <span class="show-flex-box-r show-flex-center" style="margin-top: 10px;">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" :loading="loading" @click="updatePlaybill()"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      canRendererTableHeader: [
        {
          id: 1,
          label: "责任部门",
          prop: "dept_id",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "责任部门经办人",
          prop: "person_ids",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 2,
          label: "部门审核经办人",
          prop: "manager_ids",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 2,
          label: "分管领导审核经办人",
          prop: "supervisor_ids",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "操作",
          prop: "operation",
          width: "80",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
      ],
      data: [], //项目列表
      loading: false,
      userListMap: {},
      isEchoMap: {}
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.getUserTree()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取列表
    GetPassengerDeptDuty() {
      this.$client.GetPassengerDeptDuty({}) 
      .then(res => {
        this.loading = false
        if (res.head.result == "200") {
          this.data = res.context
          this.data.forEach(item => {
            this.isEchoMap[item.dept_id] = true
          })
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      })
    },
    // 保存 
    updatePlaybill() {
      this.loading = true
      this.$client.UpdatePassengerDeptDuty({context:this.data})
      .then(res => {
        this.loading = false
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: "success"
          });
          this.dialogClose()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      })
    },
    getUserTree() {
      let params = {
        is_contain_emp: true,
        show_all: true
      }
      this.loading = true
      this.$client.getUserEmps(params).then((res) => {
        if (res.head.result === "200") {
          let tree = res.context
          this.getUserMap(tree)
          this.GetPassengerDeptDuty()
        }else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      })
    },
    getUserMap(tree) {
      if (tree.length > 0) {
        tree.forEach(item => {
          if (item.type == 0) {
            let obj = {
              name: item.c_name,
              id: item.i_id
            };
            if (this.userListMap[item.parent_id]) {
              // 去重
              if (!this.userListMap[item.parent_id].some(user => user.id === obj.id)) {
                this.userListMap[item.parent_id].push(obj);
              }
            } else {
              this.userListMap[item.parent_id] = [obj];
            }
          } else if (item.children.length > 0) {
            // 递归处理子组织
            const childUsers = this.getUserMap(item.children);
            if (childUsers.length > 0) {
              if (this.userListMap[item.i_id]) {
                 // 去重
            this.userListMap[item.i_id] = this.userListMap[item.i_id].concat(childUsers.filter(user => !this.userListMap[item.i_id].some(existingUser => existingUser.id === user.id)));
              } else {
                this.userListMap[item.i_id] = childUsers;
              }
            }
          }
        });
      }
      // 返回当前节点及其子节点的所有用户
      return tree.reduce((users, item) => {
        if (item.type == 0) {
           // 去重
          if (!users.some(user => user.id === item.i_id)) {
            users.push({ name: item.c_name, id: item.i_id });
          }
        }
        if (item.children && item.children.length > 0) {
          users = users.concat(this.getUserMap(item.children));
        }
        return users;
      }, []);
    },
    // 添加 
    add() {
      this.data.push({
        dept_id: '',
        person_ids: [],
      })
    },
    del(index) {
      this.data.splice(index,1)
    },
    onSelectChange(dept_id,index) {
      if (!this.isEchoMap[dept_id]) {
        this.data[index].person_ids = []
        this.isEchoMap[dept_id] = false
      }
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  width: 100%;
  height: 100%;
}

</style>


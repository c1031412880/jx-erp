<template>
  <el-dialog
    :visible="dialogBool"
    title="部门经办人设置"
    :before-close="dialogClose"
    :close-on-click-modal="false"
    width="780px"
  >
    <div class="el-dialog-div" ref="maintenanceProjectManage">
      <el-button size="mini" type="primary" @click="add">添加</el-button>
      <tr-table
        ref="trTable"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="500"
      >
        <template slot-scope="scope" slot="i_dept_id">
          <get-department-select
            ref="personalTree"
            v-model="scope.data.i_dept_id"
            :isShowCheckbox="false"
            :placeholder="'请选择责任部门'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="false"
            @on-change="() => {
              return onSelectChange(scope.data.i_dept_id,scope.index)
            }"
          ></get-department-select>
        </template>
        <template slot-scope="scope" slot="i_person_ids">
          <el-select
            v-model="scope.data.i_person_ids"
            style="width: 100%"
            placeholder="请选择责任部门经办人"
            filterable 
            clearable
            multiple
          >
            <el-option
              v-for="item in userListMap[scope.data.i_dept_id]"
              :key="item.id"
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
      <el-button type="primary" size="mini" @click="updatePlaybill()"
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
          prop: "i_dept_id",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "责任部门经办人",
          prop: "i_person_ids",
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
      this.$client.GetErpViolationPerson({})
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context
          this.data.forEach(item => {
            this.isEchoMap[item.i_dept_id] = true
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
      this.$client.AddOrEditErpViolationPerson({context:this.data})
      .then(res => {
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
      this.$client.getUserEmps(params).then((res) => {
        if (res.head.result === "200") {
          let tree = res.context
          this.getUserMap(tree)
          this.GetPassengerDeptDuty()
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
            }
            if (this.userListMap[item.parent_id]) {
              this.userListMap[item.parent_id].push(obj)
            } else {
              this.userListMap[item.parent_id] = [obj]
            }
          }else if (item.children.length > 0) {
            this.getUserMap(item.children)
          }
        });
      }
    }, 
    // 添加 
    add() {
      this.data.push({
        i_dept_id: '',
        i_person_ids: [],
      })
    },
    del(index) {
      this.data.splice(index,1)
    },
    onSelectChange(i_dept_id,index) {
      // console.log(i_dept_id,index,this.isEchoMap[i_dept_id]);
      if (!this.isEchoMap[i_dept_id]) {
        this.data[index].i_person_ids = []
        this.isEchoMap[i_dept_id] = false
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


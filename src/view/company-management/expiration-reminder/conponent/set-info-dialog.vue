<template>
  <el-dialog
    :visible="dialogBool"
    title="提醒规则设置"
    :before-close="dialogClose"
    append-to-body>
    <el-form 
      ref="form" 
      :model="form" 
      :rules="basicRules" 
      label-width="120px"
      size="mini">
      <el-form-item label="部门名称:" prop="dept_id">
        <get-department-select-tree
          ref="personalTree"
          v-model="form.dept_id"
          :isShowCheckbox="false"
          :placeholder="'请选择部门'"
          :isContainEmp="false"
          :show_all="true"
          :isExportMultiple="false"
        ></get-department-select-tree>
      </el-form-item>
      <el-form-item label="提醒人员:" prop="remind_user">
        <el-select
          v-model="form.remind_user"
          placeholder="请选择部门后选择提醒人员"
          style="width: 100%;"
          filterable 
          clearable
          multiple>
          <el-option
            v-for="item in userListMap[form.dept_id]"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="是否提醒经办人:" prop="is_remind">
        <el-switch
          v-model="form.is_remind">
        </el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="updatePlaybill('form')"
        >保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelectTree
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {
        id: 0,
        dept_id: '',
        remind_user: [],
        is_remind: false,
      },
      basicRules: {
        dept_id: [
          { required: true, message: "请选择提醒部门", trigger: "change" },
        ],
        remind_user: [
          { required: true, message: "请选择提醒人员", trigger: "change" },
        ],
      },
      userListMap: {}, //组织人员映射
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.personalTree.onClear()
        Object.assign(this.$data.form, this.$options.data().form);
      }
    },
  },
  mounted() {
    this.getUserTree()
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取人员树
    getUserTree() {
      let params = {
        is_contain_emp: true,
        show_all: true
      }
      this.$client.getUserEmps(params).then((res) => {
        if (res.head.result === "200") {
          let tree = res.context
          this.getUserMap(tree)
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
    setData(info) {
      for(let key in this.form) {
        if(info[key]) {
          this.form[key] = info[key]
        }
      }
    },
    // 保存 
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {context: {}}
          info.context = Object.assign({}, this.form);
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
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


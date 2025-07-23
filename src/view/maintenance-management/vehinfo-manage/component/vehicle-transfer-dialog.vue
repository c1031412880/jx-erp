<template>
  <el-dialog
    :visible="dialogBool"
    title="车辆调动"
    :before-close="dialogClose"
    width="560px"
    
  >
    <div class="el-dialog-div">
      <el-form
        size="mini"
        ref="form"
        label-width="120px"
      >
        <el-form-item label="自编号:" >
          <el-input
            v-model="form.v_num"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="车牌号:">
          <el-input
            v-model="form.lp_num"
            disabled
          ></el-input>
        </el-form-item>

        
        <el-form-item label="原组织:"  v-if="dialogBool && !!form.i_old_department">
          <get-department-select
            ref="baseTree"
            :disabled="true"
            :placeholder="placeholder"
            :isShowCheckbox="false"
            v-model="form.i_old_department"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="新组织:" v-if="dialogBool">
          <get-department-select
            ref="baseTree"
            :placeholder="placeholder"
            :isShowCheckbox="false"
            v-model="form.new_dept_id"
          ></get-department-select>
        </el-form-item>
        <el-form-item label="备注:">
          <el-input
            type="textarea"
            v-model="form.reason"
            maxlength="300"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="ok">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-dept-emp-select-tree";
export default {
  components: {getDepartmentSelect},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
  },
  data() {
    return {
      placeholder: '选择组织',
      form: {
        v_num: '',
        lp_num: '',
        vehicle_ids: [],
        i_old_department: 0,
        new_dept_id: 0,
        reason: '',
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    ok() {
      let info = JSON.parse(JSON.stringify(this.form))
      if (!this.form.new_dept_id) {
        this.$message.error('请选择调动新组织');
        return false
      }
      delete info.i_old_department
      delete info.lp_num
      delete info.v_num
      this.$emit('on-ok', info)
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


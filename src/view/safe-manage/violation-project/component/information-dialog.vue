<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="600px"
    :close-on-click-modal="false"
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="违法项目名称:" prop="c_name">
          <el-input v-model="form.c_name" placeholder="请输入违法项目名称"></el-input>
        </el-form-item>
        <el-form-item label="罚款:" prop="n_money">
          <el-input-number :controls="false" v-model="form.n_money" ></el-input-number>
        </el-form-item>
        <el-form-item label="扣分:" prop="i_score">
          <el-input-number :controls="false" v-model="form.i_score" ></el-input-number>
        </el-form-item>
        <el-form-item label="备注:" prop="c_remark">
          <el-input
            v-model="form.c_remark"
            type="textarea"
            maxlength="200"
            :rows="4"
            show-word-limit
            placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
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
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      date: [],
      form: {
        i_id: 0,
        c_name: '',
        n_money: '',
        i_score: '',
        c_remark: "",
      },
      basicRules: {
        c_name: [
          { required: true, message: "请输入违法项目名称", trigger: "change" },
        ],
        n_money: [
          { required: true, message: "请输入罚款值", trigger: "change" },
        ],
        i_score: [
          { required: true, message: "请输入扣分值", trigger: "change" },
        ],
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

    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          // let info = this.$outFormData(this.form);
          this.$emit("save-add-edit-job", this.form);
        } else {
          return false;
        }
      });
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div /deep/ .el-input {
  width: 420px;
}
</style>


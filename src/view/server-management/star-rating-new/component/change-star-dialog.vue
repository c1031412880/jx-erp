<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    width="420px"
    :before-close="dialogClose">
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="80px" size="mini">
        <el-form-item label="驾驶员:" required prop="driver_name">
          <span>{{form.driver_name}}</span>
        </el-form-item>
        <el-form-item label="更改星级" prop="star">
          <el-select v-model="form.star" style="width: 100%;" clearable placeholder="请选择星级">
            <el-option label="无星级" :value="0"></el-option>
            <el-option label="一星级" :value="1"></el-option>
            <el-option label="二星级" :value="2"></el-option>
            <el-option label="三星级" :value="3"></el-option>
            <el-option label="四星级" :value="4"></el-option>
            <el-option label="五星级" :value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注:" prop="remark">
            <el-input v-model="form.remark" type="textarea" placeholder="备注"
            :autosize="{minRows: 2, maxRows: 2}" :style="{width: '100%'}"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')" size="mini">提 交</el-button>
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
      default: "更改星级",
    },
  },
  data() {
    return {
      form: {
        id: '',
        driver_name: '',
        star: '',
        remark: '',
      },
      basicRules: {
        star: [
          { required: true, message: "请选择星级", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data.form, this.$options.data().form);
        this.$refs.form.clearValidate()
      }else{
        
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
          let info = {...this.form};
          delete info.driver_name
          this.$emit("save-change", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>


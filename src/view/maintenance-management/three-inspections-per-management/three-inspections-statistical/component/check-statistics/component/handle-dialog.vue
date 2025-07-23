<template>
  <el-dialog
    :visible="dialogBool"
    title="处理结果"
    :before-close="dialogClose"
    width="560px"
  >
    <div class="el-dialog-div">
      <el-form ref="form" size="mini">
        <el-form-item label="检查结果:">
          <el-select v-model="form.handle_result" placeholder="请选择">
            <el-option
              v-for="item in resultsList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理备注:">
          <el-input v-model="form.handle_remark" type="textarea" :rows="2"  placeholder="请输入处理备注"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {
        id: '',
        handle_result: 1,
        handle_remark: '',
      },
      resultsList: [
        {
          value: 1,
          label: '继续行驶'
        },
        {
          value: 2,
          label: '停驶'
        },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
        
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill() {
      this.$emit("save-add", this.form);
    },
    
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 200px;
}
</style>


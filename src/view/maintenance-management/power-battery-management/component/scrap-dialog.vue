<template>
  <el-dialog
    :title="title"
    :visible="dialogVisible"
    width="600px"
    :before-close="handleClose"
    top="0vh"
  >
    <el-form :model="form" :rules="basicRules" ref="form" label-width="150px" size="mini">
      <el-form-item label="电池回收价值（元）:" prop="recovery_value">
        <el-input
          v-model.number="form.recovery_value"
          type="number"
          placeholder="请输入电池回收价值"
        ></el-input>
      </el-form-item>
      <el-form-item label="尾气处理器（元）:" prop="exhaust_gas_processor">
        <el-input
          v-model.number="form.exhaust_gas_processor"
          type="number"
          placeholder="请输入尾气处理器"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleClose">取 消</el-button>
      <el-button size="small" type="primary" @click="updatePlaybill">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      title: '编辑',
      form: {
        recovery_value: '',
        exhaust_gas_processor: ''
      },
      basicRules: {
        recovery_value: [{ required: true, message: '请输入电池回收价值', trigger: 'change' }],
        exhaust_gas_processor: [{ required: true, message: '请输入尾气处理器', trigger: 'change' }]
      }
    }
  },
  watch: {
    dialogVisible(bool) {
      if (!bool) {
        Object.assign(this.$data, this.$options.data())
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    handleClose() {
      this.$emit('update:dialogVisible', false)
    },
    updatePlaybill() {
      this.$refs['form'].validate(valid => {
        if (valid) {
          let info = {}
          for (let key in this.form) {
            if (this.form[key] || this.form[key] === 0) {
              info[key] = this.form[key]
            }
          }
          this.$emit('save-edit', info)
        } else {
          return false
        }
      })
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
>>>.el-dialog {
  top: 30%;
  transform: translateY(-30%);
}
</style>

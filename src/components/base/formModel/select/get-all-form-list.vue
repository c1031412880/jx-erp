<template>
  <el-select
    :disabled="disabled"
    clearable
    v-loading="loading"
    v-model="id"
    :placeholder="placeholder"
    filterable
    @change="change">
    <el-option
      v-for="item in optionsAll"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
    <el-option-group
      v-for="group in contactFormOptions"
      :key="group.label"
      :label="group.label">
      <el-option v-for="(item, index) in group.list" :key="index" :label="item.name"
                 :value="item.id" :disabled="item.disabled"></el-option>
    </el-option-group>
  </el-select>
</template>

<script type="text/ecmascript-6">
  export default {
    props: {
      value: {},
      placeholder: {
        type: String,
        default: '请选择选择表单'
      },
      disabled: {
        type: Boolean,
        default: false
      },
      isAll: {
        type: Boolean,
        default: true
      }
    },
    watch: {
      value(newVal) {
        this.id = newVal
      }
    },
    data() {
      return {
        id: '',
        contactFormOptions: [],
        optionsAll: [],
        loading: false,
      }
    },
    created() {
      this.loadData()
    },
    mounted() {
      if (this.value) {
        this.id = this.value
      }
    },
    methods: {
      // 初始化数据
      loadData() {
        this.loading = true
        this.contactFormOptions = []
        this.optionsAll = []
        this.$client.getAllFormsFlowManager({}).then(req => {
          this.loading = false
          console.log('新表单接口',req)
          if (req.head.result === '200') {
            this.contactFormOptions.push({
              label: '固定表单',
              list: req.context.fix_form
            })
            this.contactFormOptions.push({
              label: '自定义表单表单',
              list: req.context.unfix_form
            })
            // req.context.fix_form.forEach(item => {
            //   this.optionsAll.push(item)
            // })
            req.context.unfix_form.forEach(item => {
              this.optionsAll.push(item)
            })
          }
          if (this.isAll) {
            this.contactFormOptions = []
          } else {
            this.optionsAll = []
          }
        })
      },
      change(val) {
        this.$emit('input', val)
        this.data.forEach(item => {
          if(item.i_id===val) {
            this.$emit('change', item)
          }
        })
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>

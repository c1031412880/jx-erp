<template>
  <!-- 专门给审批单流程用的  -->
  <el-select
    :disabled="disabled"
    :clearable="clearable"
    :size="size"
    v-loading="loading"
    v-model="id"
    :placeholder="placeholder"
    filterable
    :multiple="isMultiple"
    :collapse-tags="collapseTags"
    @change="change">
    <el-option
      v-for="item in options"
      :key="item.i_id"
      :label="item.c_name"
      :value="item.c_code">
    </el-option>
  </el-select>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    value: {},
    size: '',
    placeholder: {
      type: String,
      default: '请选择表单'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    classKey:String,
    isMultiple: {
      type: Boolean,
      default: false
    },
    isShowDefaultValue:  {
      type: Boolean,
      default: false
    },
    collapseTags:  {
      type: Boolean,
      default: false
    },
    clearable:  {
      type: Boolean,
      default: true
    },
  },
  watch: {
    value(newVal) {
      this.id = newVal
    }
  },
  data() {
    return {
      id: '',
      options: [],
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
      this.options = []
      let context = []
      context.push(this.classKey)
      this.$client.getDictionaryDataBase({context: context}).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          if (req.context.length) {
            this.options = req.context[0].dic_details;//审批单用
            if(this.isShowDefaultValue && !this.id) {
              try{ 
                this.options.forEach(element => {
                  if(!!element.i_is_default) {
                    if(this.isMultiple) {
                      let valueIds = [];
                      valueIds.push(element.c_code)
                      this.id = valueIds
                      this.change(this.id)
                    }else{
                      this.id = element.c_code
                      this.change(this.id)
                      throw new Error("EndIterative");
                    }
                  }
                });
              }catch(e){
                // console.log(e)
              }
            }
          }
        }
      })
    },
    selectedLabels(ids){
      let list =  this.options.filter(t=> {return ids.indexOf(t.c_code) !== -1})
      let label = []
      list.forEach(item => {
        label.push(item.c_name)
      })
      return label
    },
    change(val) {
      this.$emit('input', val)
      this.$emit('change', val)
      this.options.forEach(item => {
        if(item.c_code == val) {
          this.$emit('on-change', item, val)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>

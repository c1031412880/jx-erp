<template>
  <el-select
    :disabled="disabled"
    :clearable="clearable"
    :size="size"
    :loading="loading"
    v-model="id"
    :placeholder="placeholder"
    filterable
    :multiple="isMultiple"
    :collapse-tags="collapseTags"
    :style="{'width': width}"
    @change="change">
    <el-option
      v-for="item in options"
      :key="item.c_code"
      :label="item.c_name"
      :disabled="item.c_name === '转外修' ? true : false"
      :value="isValueCode ? item.c_code : item.c_name">
    </el-option>
  </el-select>
</template>

<script type="text/ecmascript-6">
import keyConfig from './config'
export default {
  props: {
    value: {},
    size: '',
    placeholder: {
      type: String,
      default: '请选择选择表单'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    classKey:String,
    isMultiple: {
      type: Boolean,
      default: false
    },
    isValueCode: {
      type: Boolean,
      default: true
    },
    isShowDefaultValue:  {
      type: Boolean,
      default: false
    },
    collapseTags:  {
      type: Boolean,
      default: false
    },
    width:  {
      type: String,
      default: ''
    },
    accidentType: {
      type: Boolean,
      default: false
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
      options: [
        {c_code: 1}
      ],
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
      context.push(keyConfig[this.classKey])
      this.$client.getDictionaryDataBase({context: context}).then(req => {
        this.loading = false
        if (req.head.result === '200') {
          if (req.context.length) {
            this.options = req.context[0].dic_detls;
            if(this.accidentType && this.classKey == '报修类别') {
              this.options.push({
                c_code: -1,
                c_name: '事故'
              })
            }
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
    change(val) {
      this.$emit('input', val)
      this.options.forEach(item => {
        if((this.isValueCode ? item.c_code : item.c_name)===val) {
          this.$emit('change', item)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>

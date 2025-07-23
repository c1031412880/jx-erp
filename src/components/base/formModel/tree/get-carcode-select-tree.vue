<template>
  <el-popover
    placement="bottom"
    trigger="click"
    v-model="visible"
    :disabled="disabled">
    <div style="max-height: 300px;overflow:auto;" :style="`${!!width? `min-width: ${width}px;` : ''}`">
      <!-- <el-radio-group v-model="vehType" >
        <el-radio :label="0">全部</el-radio>
        <el-radio :label="1">营运</el-radio>
        <el-radio :label="2">报废</el-radio>
      </el-radio-group> -->
      <carcode-tree
        ref="tree"
        v-model="id"
        :isShowCheckbox="isShowCheckbox"
        :oilType="oilType"
        :placeholder="'请输入关键词'"
        @on-check="carCodeCheck"
      ></carcode-tree>
    </div>
    <el-input
      clearable
      slot="reference"
      @clear="onClear"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      :disabled="disabled"
      :value="input_names" class="popover-input-box">
    </el-input>
  </el-popover>
</template>

<script type="text/ecmascript-6">
  import carcodeTree from './get-carcode-tree'
  import { debounce } from '@/utils/index'
  export default {
    name: "get-carcode-tree",
    components: {carcodeTree},
    props: {
      value: {},
      placeholder: [String],
      isShowCheckbox:{
        type: Boolean,
        default: false
      },
      disabled:{
        type: Boolean,
        default: false
      },
      width: {
        type:[String,Number],
        default: '',
      },
      isExportMultiple: {
        type: Boolean,
        default: true
      },
      oilType: {
        type: [String,Number],
        default: 0    //0是全部车辆 1是燃油车
      },
      invalid: {
        type: [String,Number],
        default: 0    //0是全部车辆 1是燃油车
      },
    },
    watch:{
      value(val) {
        this.id = val
        // alert(JSON.stringify(newVal))
        // this.$refs.tree.findSelectedNode()

      },
      visible(vaule) {
        if(vaule) {
          this.$refs.tree.inputFocus()
        }
      },
      valSelect(val) {
        this.debounceFilter(val);
      }
    },
    data() {
      return {
        id: '',
        input_names: '',
        visible: false,
        vehType: 0,
        debounceFilter: null,
      }
    },
    created() {
      this.debounceFilter = debounce((val) => {
        this.$refs.tree && this.$refs.tree.filter(val);
        if(!val) {
          this.$refs.tree && this.$refs.tree.allExpanded && this.$refs.tree.allExpanded(false)
        }
      }, 300);
    },
    mounted() {
      this.id = this.value
    },
    methods: {
      carCodeCheck(node) {
        let nodes = []
        let carCode = []
        let names = []
        node.forEach(item => {
          if (item.type == 3) {
            nodes.push(item)
            carCode.push(item.i_id)
            names.push(item.number)
          }
        })
        this.input_names = names.toString()
        if(this.isExportMultiple) {
          this.$emit('input', carCode)
        }else{
          this.$emit('input', carCode[0])
          if(carCode.length == 1) {
            this.visible = false
          }
        }
        this.$emit('on-change', carCode, nodes)
        // 回显tree选中
        // this.$refs.tree.setCheckedNodes(node);
        // this.$refs.tree.setCurrentKey(carCode);
      },
      inputOut() {
        console.log("inputout")
        this.input_names = this.input_names_old.toString()
      },
      onClear() {
        // alert(1111)
        this.input_names_old = ''
        this.input_names = ''
        this.id = ''
        this.$refs.tree.resetChecked()
        // this.$refs.tree.setCheckedNodes([]);
        this.$refs.tree.setCurrentKey([]);
        if(this.isExportMultiple) {
          this.$emit('input', [])
        }else{
          this.$emit('input', '')
        }

        this.$emit('on-change', [])
      },
      // 回显
      setCheckedKeys(keys) {
        this.$refs.tree.setCheckedkeys(keys);
      },
      // 设置当前的key
      setCurrentKey(keys) {
        this.$refs.tree.setCurrentKey(keys);
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>

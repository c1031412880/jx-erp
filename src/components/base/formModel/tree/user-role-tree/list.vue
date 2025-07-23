<template>
  <div>
    <div style="min-height: 300px;display: flex;width: 700px;">
      <el-card header="待选列表" style="flex: 1">
        <el-button-group style="margin-bottom: 10px">
          <!-- <el-button size="mini" :type="activeName === 1 ? 'primary' : ''" @click="activeName = 1">按组织架构</el-button> -->
          <!--          <el-button size="mini" :type="activeName === 2 ? 'primary' : ''" @click="activeName = 2">按角色</el-button>-->
        </el-button-group>
        <div style="width: 100%;overflow: auto;height: 460px">
          <get-fill-role-emp-tree
            v-if="activeName === 2"
            v-model="id"
            ref="roleTree"
            :isShowCheckbox="isShowCheckbox"
            :placeholder="'请输入关键词'"
            :is_contain_emp="is_contain_emp"
            :show_all="show_all"
            :func_type="func_type"
            @on-check="vehicleCheckNew"
            @input="setInput"
            @on-names="inputNames"
          ></get-fill-role-emp-tree>
          <get-fill-dept-emp-tree
            v-if="activeName === 1"
            v-model="id"
            ref="tree"
            :isShowCheckbox="isShowCheckbox"
            :placeholder="'请输入关键词'"
            :is_contain_emp="is_contain_emp"
            :show_all="show_all"
            :func_type="func_type"
            @on-check="vehicleCheckNew"
            @input="setInput"
            @on-names="inputNames"
          ></get-fill-dept-emp-tree>
        </div>
      </el-card>
      <el-card style="flex: 1">
        <div slot="header" class="clearfix">
          <span>已选列表({{list_value.length}})</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="onClear">清空</el-button>
        </div>
        <ul style="width: 100%;height: 478px;overflow: auto">
          <li style="width: 100%;display: flex;margin-bottom: 5px;" v-for="(item,i) in list_value" :key="i">
            <div style="flex: 1;line-height: 25px;">{{item.label}}</div>
            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="clearList(item)"></el-button>
          </li>
        </ul>
      </el-card>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import getFillRoleEmpTree from "./get-fill-role-emp-tree";
import getFillDeptEmpTree from "./get-fill-dept-emp-tree";
export default {
  name: "user-role-tree",
  components: {getFillRoleEmpTree, getFillDeptEmpTree},
  props: {
    placeholder: [String],
    isShowCheckbox:{
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
    // 是否包含人员(默认不包含)
    is_contain_emp: {
      type: Boolean,
      default: false
    },
    // 是否包含从属人员(默认不包含)
    show_all: {
      type: Boolean,
      default: false
    },
    // 功能类别(1:营运单元 2:维修单元 3:仓储单元, 默认营运单元)
    func_type: {
      type: [Number, String],
      default: 1
    }
  },
  watch:{
  },
  data() {
    return {
      id: [],
      input_names: '',
      list_value: [],
      activeName: 1,
    }
  },
  mounted() {
  },
  methods: {
    inputNames(names, values = []) {
      this.input_names = names.toString()
      this.list_value = values.sort((a,b) => {
        return a.index - b.index
      })
    },
    vehicleCheck(node) {
      // alert(JSON.stringify(node))
      let nodes = []
      let vehs = []
      let names = []
      node.forEach(item => {
        nodes.push(item)
        vehs.push(item.i_id || item.id)
        names.push(item.c_name || item.name)
      })
      this.input_names = names.toString()
      if(this.isShowCheckbox) {
        this.$emit('input', vehs)
      }else{
        this.$emit('input', this.id)
      }
      this.$emit('on-change', vehs, nodes)
    },
    // input返回
    setInput(val) {
      this.$emit('input', val)
    },
    // 点击或者多选返回
    vehicleCheckNew(value, node) {
      if(!this.isExportMultiple) {
        if(node.length > 0) {
          this.visible = false
        }
      }
      this.$emit('on-change', value, node)
    },
    onClear() {
      // alert(1111)
      this.input_names = ''
      this.id = this.isShowCheckbox ? [] : ''
      // this.$refs.tree.resetChecked()
      // this.$refs.tree.setCheckedNodes([]);
      // this.$refs.tree.setCurrentKey(null);
      if(this.isShowCheckbox) {
        this.$emit('input', [])
      }else{
        this.$emit('input', '')
      }

      this.$emit('on-change', [])
    },
    clearList(item) {
      if (!this.isShowCheckbox) {
        this.list_value = []
        this.onClear()
      } else {
        let data = [...this.id]
        if (data) {
          let ids = data.filter(obj => {
            return obj !== item.value
          })
          let netIDS = this.$refs.tree.idObj[item.value] ? this.$refs.tree.idObj[item.value] : []
          const delGroup = (index) => {
            let notGroup = this.$refs.tree.outGroupTreeNode(this.$refs.tree.data, {index: index}, 'index') || {index: 0}
            if (notGroup.index > 1) {
              this.$refs.tree.filterNotKeys(notGroup.index)
              delGroup(notGroup.index)
            }
          }
          netIDS.forEach(index => {
            delGroup(index)
          })
          this.$refs.tree.filterNotKeys(1)
          this.id = ids
        }
      }
    }
    
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>

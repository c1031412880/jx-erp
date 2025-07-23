<template>
  <div>
    <el-input
      clearable
      @clear="onClear"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      :disabled="disabled"
      @focus="visible = true"
      :value="input_names" class="popover-input-box">
    </el-input>
    <el-dialog
      title="选择人员"
      :visible.sync="visible"
      append-to-body
      width="740px">
      <div style="min-height: 300px;display: flex;width: 700px;">
        <el-card header="待选列表" style="flex: 1">
          <el-button-group style="margin-bottom: 10px">
            <!-- <el-button size="mini" :type="activeName === 1 ? 'primary' : ''" @click="activeName = 1">按组织架构</el-button> -->
            <!-- <el-button size="mini" :type="activeName === 2 ? 'primary' : ''" @click="activeName = 2">按角色</el-button> -->
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
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="onCancel" size="mini">取  消</el-button>
        <el-button type="primary" @click="onSubmit" size="mini">确  认</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import getFillRoleEmpTree from "./get-fill-role-emp-tree";
import getFillDeptEmpTree from "./get-fill-dept-emp-tree";
export default {
  name: "user-role-tree",
  components: {getFillRoleEmpTree, getFillDeptEmpTree},
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
    },
    // 是否按勾选顺序排序节点
    isCheckSort: {
      type: Boolean,
      default: false
    },
  },
  watch:{
    value(newVal) {
      this.id = newVal
      if (!newVal) {
        this.input_names = ''
      }
      if (this.oneActive) {
        this.visible = true
        setTimeout(() => {
          this.visible = false
        }, 100)
      }
    },
    visible(vaule) {
      if(vaule) {
        try {
          this.$refs.tree.inputFocus()
        } catch (e) {}
      }
      this.oneActive = false
    }
  },
  data() {
    return {
      id: '',
      input_names: '',
      list_value: [],
      nodeSortArr: [],//按勾选顺序排序的节点
      visible: false,
      activeName: 1,
      oneActive: true
    }
  },
  mounted() {
    this.id = this.value
  },
  methods: {
    inputNames(names, values = []) {
      // console.log(names, 'names');
      // console.log(values, 'values');
      if(!this.isCheckSort) {
        this.list_value = values;
        this.input_names = names.toString()
      } else{
        let newArr = JSON.parse(JSON.stringify(values));
        let nameArr = [];
        this.nodeSortArr.forEach((it, i)=>{
          newArr.forEach(jt=>{
            if(it.i_id === jt.value) jt.sortNum = i;
          })
        })
        newArr.sort(function (a, b) {
          return a.sortNum - b.sortNum;
        })
        this.list_value = newArr;
        newArr.forEach(it=> nameArr.push(it.label));
        this.input_names = nameArr.toString()
      }
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
      // console.log(val, 'aaaaaaaaaaaaa');
      this.$emit('input', val)
    },
    // 点击或者多选返回 singleNode(当前点击复选框的节点) isCheck(勾选或取消勾选)
    vehicleCheckNew(value, node, singleNode, isCheck) {
      if(!this.isExportMultiple) {
        if(node.length > 0) {
          this.visible = false
        }
      }

      if(!this.isCheckSort){// 树节点自然顺序
        this.$emit('on-change',value, node);
      }else{//按勾选顺序进行排序
        if(isCheck) this.nodeSortArr.push(singleNode);
        else {
          for (let i = 0; i < this.nodeSortArr.length; i++) {
            let it = this.nodeSortArr[i];
            if(singleNode.i_id === it.i_id){
              this.nodeSortArr.splice(i, 1);
              break;
            }
          }
        }
        let nodeSortArr = this.nodeSortArr;
        let nodeSortIdArr = [];
        this.nodeSortArr.forEach(item=>{
          nodeSortIdArr.push(item.i_id);
        })
        // nodeSortArr nodeSortIdArr(勾选顺序)
        // singleNode(当前点击复选框的节点)
        // isCheck(勾选或取消勾选)
        this.$emit('on-change',nodeSortArr, nodeSortIdArr);
      }
    },
    onClear() {
      // alert(1111)
      this.input_names = ''
      this.id = this.isShowCheckbox ? [] : ''
      this.nodeSortArr = [];
      // this.$refs.tree.resetChecked()
      // this.$refs.tree.setCheckedNodes([]);
      // this.$refs.tree.setCurrentKey(null);
      if(this.isShowCheckbox) {
        this.$emit('input', [])
      }else{
        this.$emit('input', '')
      }

      this.$emit('on-change', [], []);
    },
    //取消按钮
    onCancel(){
      this.visible = false;
      this.list_value = [];
      this.$emit('on-close')
      this.onClear();
    },
    clearList(item) {
      for (let i = 0; i < this.nodeSortArr.length; i++) {
        let it = this.nodeSortArr[i];
        if(item.value === it.i_id){
          this.nodeSortArr.splice(i, 1);
          break;
        }
      }

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
      let group = this.$refs.tree.outGroupTreeNode(this.$refs.tree.data, {i_id: item.value})
      // console.log(this.id, group, item, this.$refs.tree.notTypeKey)
    },
    // // 回显
    // setCheckedKeys(keys) {
    //   this.$refs.tree.setCheckedkeys(keys);
    // },
    // // 设置当前的key
    // setCurrentKey(keys) {
    //   this.$refs.tree.setCurrentKey(keys);
    // }
    onSubmit() {
      this.visible = false
      this.$emit('on-ok')
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>

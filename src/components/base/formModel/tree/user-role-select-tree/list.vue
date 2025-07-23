<template>
<el-dialog
    width="740px"
    title="选择人员"
    :visible.sync="selectPersonShow"
    append-to-body
    :before-close="dialogClose"
    :close-on-click-modal="false">
    <div style="min-height: 300px;display: flex;width: 700px;">
      <el-card header="待选列表" style="flex: 1">
        <!-- <el-button-group style="margin-bottom: 10px"> -->
          <!-- <el-button size="mini" :type="activeName === 1 ? 'primary' : ''" @click="activeName = 1">按组织架构</el-button> -->
          <!--          <el-button size="mini" :type="activeName === 2 ? 'primary' : ''" @click="activeName = 2">按角色</el-button>-->
        <!-- </el-button-group> -->
        <div style="width: 100%;overflow: auto;height: 460px">
          <get-fill-dept-emp-tree
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
            <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="clearList(item,i)"></el-button>
          </li>
        </ul>
      </el-card>
    </div>
    <span slot="footer" class="dialog-footer">
        <el-button type="" @click="onCancel" size="mini">取  消</el-button>
        <el-button type="primary" @click="onSubmit" size="mini">确  认</el-button>
      </span>
  </el-dialog>

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
    selectPersonShow: Boolean,
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
    },
    // 是否按勾选顺序排序节点
    isCheckSort: {
      type: Boolean,
      default: true
    },
  },
  watch:{
    value(newVal) {
      this.id = newVal
      if (this.nodeSortArr.length == 0) {
        this.nodeSortIdArr = JSON.parse(JSON.stringify(newVal))
      }
      // if (!newVal) {
      //   this.input_names = ''
      // }
      // if (this.oneActive) {
      //   this.visible = true
      //   setTimeout(() => {
      //     this.visible = false
      //   }, 100)
      // }
    },
    selectPersonShow(vaule) {
      if(vaule) {
        try {
          this.$refs.tree.inputFocus()
        } catch (e) {}
      }
      // this.oneActive = false
    }
  },
  data() {
    return {
      id: [],
      input_names: '',
      list_value: [],
      nodeSortArr: [],//按勾选顺序排序的节点
      nodeSortIdArr: [],
      arr: [],
      oneActive: true
    }
  },
  mounted() {
  },
  methods: {
    inputNames(names, values = []) {
      // console.log('names', names);
      // console.log('values', values);
      if(!this.isCheckSort) {
        this.input_names = names.toString()
        this.list_value = values.sort((a,b) => {
          return a.index - b.index
        })
      } else {
        let newArr = JSON.parse(JSON.stringify(values));
        this.nodeSortIdArr.forEach((it, i)=>{
          newArr.forEach(jt=>{
            if(it === jt.value) jt.sortNum = i;
          })
        })
        newArr.sort(function (a, b) {
          return a.sortNum - b.sortNum;
        })
        this.list_value = newArr
        this.nodeSortArr = JSON.parse(JSON.stringify(this.list_value))
        this.nodeSortArr.forEach(item => {
          item.i_id = item.value
        })
      }
    },
    // input返回
    setInput(val) {
      this.$emit('input', val)
    },
    // 点击或者多选返回
    vehicleCheckNew(value, node,singleNode, isCheck) {
      if(!this.isExportMultiple) {
        if(node.length > 0) {
          this.visible = false
        }
      }

      if (!this.isCheckSort) {
        this.$emit('on-change', value, node)
      }else{//按勾选顺序进行排序
        this.arr = []
        this.addNodeArr([singleNode])
        if(isCheck) {

          // this.arr.forEach((item,index) => {
          //   if (this.nodeSortIdArr.indexOf(item.i_id) !== -1) {
          //     this.arr.splice(index,1)
          //   }
          // })
          this.arr = this.arr.filter((item=> {return this.nodeSortIdArr.indexOf(item.i_id) == -1}))
          this.nodeSortArr = [...this.nodeSortArr,...this.arr]
        }
        else {
          let ids = []
          this.arr.forEach(item => {
            ids.push(item.i_id)
          })
          // for (let i = this.nodeSortArr.length - 1; i >= 0; i--) {
          //   // let it = this.nodeSortArr[i];
          //   for (let index = this.arr.length -1; index >= 0; index--) {
          //     if(this.arr[index].i_id == this.nodeSortArr[i].i_id){
          //       this.nodeSortArr.splice(i, 1);
          //     }
          //   }
          // }
          this.nodeSortArr = this.nodeSortArr.filter((item=> {return ids.indexOf(item.i_id) == -1}))
        }

        // let nodeSortArr = this.nodeSortArr;
        this.nodeSortIdArr = [];
        this.nodeSortArr.forEach(item=>{
          this.nodeSortIdArr.push(item.i_id);
        })
        // nodeSortArr nodeSortIdArr(勾选顺序)
        // singleNode(当前点击复选框的节点)
        // isCheck(勾选或取消勾选)
        // this.$emit('on-change',this.nodeSortArr, this.nodeSortIdArr);
      }
    },
    addNodeArr(list) {
      for (let index = 0; index < list.length; index++) {
        if (list[index].children.length > 0) {
          return  this.addNodeArr(list[index].children)
        } else {
          this.arr.push(list[index])
        }
      }
    },
    onClear() {
      // alert(1111)
      this.input_names = ''
      this.nodeSortArr = []
      this.nodeSortIdArr = []
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
    clearList(item,i) {
      if (!this.isShowCheckbox) {
        this.nodeSortArr = []
        this.onClear()
      } else {
        let data = [...this.id]
        if (data) {
          let ids = data.filter(obj => {
            return obj !== item.value
          })
          this.nodeSortArr.splice(i,1)
          this.nodeSortIdArr.splice(i,1)

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
    },
    onCancel() {
      this.nodeSortArr = []
      this.nodeSortIdArr = []
      // this.selectPersonShow = false
      this.$emit("update:selectPersonShow",false)
    },
    dialogClose() {
      this.$emit("update:selectPersonShow",false)
    },
    onSubmit() {
      this.$emit('on-ok',this.list_value);
      // this.selectPersonShow = false
    },
    
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.popover-input-box{
  // width 300px
}

</style>

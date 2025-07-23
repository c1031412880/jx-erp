<template>
  <el-dialog
    :visible="dialogBool"
    title="关联用户"
    :before-close="dialogClose"
    width="760px"
    
  >
    <div class="el-dialog-div show-flex-box-r">
      <el-card class="box-card left-box">
        <div slot="header" class="clearfix">
          <span>选择关联用户</span>
        </div>
        <div style="height: 300px">
          <!-- <user-tree
            ref="tree"
            v-model="id"
            :isShowCheckbox="true"
            :placeholder="'请输入关键词'"   
            @on-check="departmentCheck"
            :isContainEmp="true"
            :funcType="''"
            :isCheckStrictly="false"
          ></user-tree> -->
          <get-fill-dept-emp-tree
              v-model="id"
              ref="tree"
              :isShowCheckbox="isShowCheckbox"
              :placeholder="'请输入关键词'"
              :is_contain_emp="true"
              :show_all="true"
              :func_type="0"
              @on-check="vehicleCheckNew"
            ></get-fill-dept-emp-tree>
        </div>
         
      </el-card>
      <el-card class="box-card center-box" ref="centerBox">
          <div slot="header" class="clearfix">
            <span>已选列表({{user_list.length}})</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="onUserClear">清空</el-button>
          </div>
          <ul style="width: 100%;height: 478px;overflow: auto">
            <li style="width: 100%;display: flex;margin-bottom: 5px;" v-for="(item,index) in user_list" :key="index">
              <div style="flex: 1;line-height: 25px;">{{item.c_name}}</div>
              <el-button size="mini" type="danger" icon="el-icon-delete" circle @click="clearList(item,index)"></el-button>
            </li>
          </ul>
        </el-card>


      <!-- <el-card  class="box-card center-box" ref="centerBox">
        <div slot="header" class="clearfix">
          <span>已选列表{{this.user_list.length}}</span>
          <el-button style="float: right; padding: 3px 0" type="text" @click="onUserClear()">清空</el-button>
        </div>
        <tr-table
          :selectionShow="false"
          :data="user_list"
          :tableHeaderList="canRendererTableHeader"
          :TableHeight="300"
          :frontFixedNum="0"
          :backFixedNum="0"
        >
          <template slot-scope="scope" slot="operation">
           <el-button type="danger" size="mini" @click="deleteVehicle(scope.data, scope.index)">删除</el-button>
          </template>
  
        </tr-table>
      </el-card> -->
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="ok" size="mini">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
  import userTree from '@/components/base/formModel/tree/get-user.vue'

  import getFillDeptEmpTree from "@/components/base/formModel/tree/user-role-tree/get-fill-dept-emp-tree";
  export default {
    components: {
      userTree,
      getFillDeptEmpTree
    },
    props: {
      dialogBool: Boolean,
      isShowCheckbox:{
        type: Boolean,
        default: true
      },
    },
    data() {
      return {
        id:[],
        user_list: [],
        canRendererTableHeader:[
           {
              id: 1,
              label: "姓名",
              prop: "c_name",
              width: "130",
              align: "center",
              signIndex: 0,
              sortable: true,
            },
            {
              id: 2,
              label: "操作",
              prop: "operation",
              width: "110",
              align: "center",
              signIndex: 1,
              sortable: false,
            },
        ]
      };
    },
    watch: {
      dialogBool(bool) {
        if (bool === false) {
          Object.assign(this.$data, this.$options.data());
        }
      },
    },
    methods: {
      dialogClose() {
        this.$emit("update:dialogBool", false);
      },
       // 点击或者多选返回
        vehicleCheckNew(value, node) {
          // console.log(value, node)
          this.user_list = []
          if(value.length> 0) {
              value.forEach(item => {
              if (!item.type) {
                this.user_list.push(item)
              }
            })
          }
          // if(!this.isExportMultiple) {
          //   if(node.length > 0) {
          //     this.visible = false
          //   }
          // }
          // this.$emit('on-change', value, node)
        },
      departmentCheck(node,parentNode) {
        // console.log(node,parentNode)
        this.user_list = []
        if(node.length> 0) {
            node.forEach(item => {
            if (!item.type) {
              this.user_list.push(item)
            }
          })
        }
        
      },
      clearList(item,zIndex) {
        if (!this.isShowCheckbox) {
          this.user_list = []
          this.onClear()
        } else {
          let data = [...this.id]
          if (data) {
            let ids = data.filter(obj => {
              return obj !== item.i_id
            })
            let netIDS = this.$refs.tree.idObj[item.i_id] ? this.$refs.tree.idObj[item.i_id] : []
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
        // let group = this.$refs.tree.outGroupTreeNode(this.$refs.tree.data, {i_id: item.i_id})

        this.user_list.splice(zIndex,1)

        // console.log(this.id, group, item, this.$refs.tree.notTypeKey)
      },


      // deleteVehicle(row,index) {
      //   this.user_list.splice(index, 1)
      //   // this.$refs.tree.notTypeKey = []
      //   this.id = this.user_list.map(item => {
      //     let i_id = item.i_id
      //     return i_id
      //   })
      //   // this.$refs.tree.setCheckedkeys(this.id)
      // },
      // 清空
      onUserClear() {
        this.id = []
        // this.$refs.tree.setCheckedkeys(this.id)
        this.user_list = []
      },
      ok() {
        if(!this.id || this.id.length == 0) {
          this.$message({type: 'warning', message: '请选择关联的人员'})
          return 
        }

        // console.log(this.id)
        // return
        this.$emit('save-selected-user', this.id)
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  width: 100%;
  height: 420px;

  .box-card {
    height: 100%;
    overflow: auto;
  }

  .left-box {
    // flex: 0 0 23vw;
    margin: 0 5px 0 0;
    width: 300px;
    height: 100%;
  }

  .center-box {
    flex: 1;
    height: 100%;
  }
}
.el-dialog-div /deep/ .el-card__header {
    background: #F5F5F5 !important;
  }

</style>

<template>
<div class="role-info" style="height:400px;overflow-x:hidden">
  <el-row>
    <el-col :span="11">
      <role-tree
        :is_show="0"
        ref="userGroupTree"
        @on-check-change="getTreeNodes"
        :placeholder="'搜索'"
        :showCheckbox="true"></role-tree>
    </el-col>
    <el-col :span="12" style="margin-left: 5px">
      <el-table height="550" border :data="data">
        <el-table-column prop="c_name" label="角色"></el-table-column>
        <el-table-column prop="c_name" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="removeData(scope.$index)" :disabled="curChangeType == 'detail'">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</div>
</template>

<script type="text/ecmascript-6">
  import roleTree from 'components/base/formModel/tree/role-tree'
  export default {
    components: {roleTree},
    props:{
      curChangeType:{
        type: String,
        default: 'add'
      }
    },
    data() {
      return {
        data: [],
        keys: [],
        roleIds:[],
      }
    },
    methods: {
      // 重置信息
      resetData() {
        this.roleIds = [];
        this.data = [];
        this.keys = [];
        this.$refs.userGroupTree.setSelectCheckedKeys(this.keys);
      },
      initTreeData({data = [], keys = []}) {
        this.data = data;
        this.keys = keys;
        this.$refs.userGroupTree.setSelectCheckedKeys(this.keys);
      },
      // 树选中事件
      getTreeNodes(nodes,keys) {
        if(this.curChangeType == 'detail') {
          return
        }
        this.data = []
        nodes.forEach(item => {
          this.data.push({
            c_name: item.c_name,
            i_role_id: item.i_id
          })
        })
        this.keys = keys
      },
      removeData(index) {
        this.data.splice(index, 1)
        this.keys.splice(index, 1)
        this.$refs.userGroupTree.setSelectCheckedKeys(this.keys)
      },
      // 数据回显
      setData(val) {
          this.data = [];
          this.keys = [];
          if(!!val.roles) {
            val.roles.forEach(item => {
              this.data.push({
                c_name: item.c_name,
                i_role_id: item.i_id
              });
              this.keys.push(item.i_id)
            })
            this.$refs.userGroupTree.setSelectCheckedKeys(this.keys)
          }
      },
      // 给父级页面提供得获取本页数据
      getData() {
        return new Promise((resolve, reject) => {
          if (this.data.length < 1) {
            reject({
              result: 400,
              msg: '带星号为必填项'
            })
            return
          }
          this.roleIds = [];
          if(this.data.length > 0) {
            this.data.forEach(item => {
              this.roleIds.push(item.i_role_id)
            });
          }
          resolve({ 
            formData: {
              role_ids: this.roleIds
            },
            result:200,
            msg: '获取成功'

          })
        })
      },
    },
    
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

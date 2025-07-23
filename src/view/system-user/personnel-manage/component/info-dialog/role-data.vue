<template>
  <el-row>
    <el-col :span="23" style="height: 550px;overflow: auto;">
      <div style="height:50px"> 当前角色：<el-button size="small" v-for="(item,i) in this.data" >{{item.c_name}}</el-button></div>
      <role-tree
        :is_show="0"
        ref="userGroupTree"
        @on-check-change="getTreeNodes"
        :placeholder="'搜索'"
        :showCheckbox="true"></role-tree>
    </el-col>
    <!-- <el-col :span="12" style="margin-left: 5px">
      <el-table height="550" border :data="data">
        <el-table-column prop="c_name" label="角色"></el-table-column>
        <el-table-column prop="c_name" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="removeData(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col> -->
  </el-row>
</template>

<script type="text/ecmascript-6">
  import roleTree from 'components/base/formModel/tree/role-tree1'
  export default {
    components: {roleTree},
    data() {
      return {
        data: [],
        keys: []
      }
    },
    methods: {
      initTreeData({data = [], keys = []}) {
        this.data = data;
        this.keys = keys;
        this.$refs.userGroupTree.setSelectCheckedKeys(this.keys);
      },
      // 树选中事件
      getTreeNodes(nodes,keys) {
        this.data = []
        nodes.forEach(item => {
          this.data.push({
            c_name: item.c_name,
            i_org_id: item.i_id
          })
        })
        this.keys = keys
      },
      removeData(index) {
        this.data.splice(index, 1)
        this.keys.splice(index, 1)
        this.$refs.userGroupTree.setSelectCheckedKeys(this.keys)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

<template>
  <el-row>
    <el-col :span="11" style="height: 550px;overflow: auto;">
      <get-user-group-tree
        ref="userGroupTree"
        @on-check-change="getTreeNodes"
        :showCheckbox="true"></get-user-group-tree>
    </el-col>
    <el-col :span="12" style="margin-left: 5px">
      <el-table height="550" border :data="data">
        <el-table-column prop="c_name" label="组织"></el-table-column>
        <el-table-column prop="c_name" label="是否为主组织">
          <template slot-scope="scope">
            <el-switch
              @change="switchChange(scope.row)"
              v-model="scope.row.is_main_org"
              active-color="#13ce66"
              inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="c_name" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="text" @click="removeData(scope.$index)">移除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script type="text/ecmascript-6">
  import getUserGroupTree from 'components/base/formModel/tree/get-user-group-tree'
  export default {
    components: {getUserGroupTree},
    data() {
      return {
        data: [],
        keys: [],
        orgObj: {}
      }
    },
    methods: {
      initTreeData({data = [], keys = []}) {
        this.data = data;
        this.keys = keys;
        this.orgObj = {};
        this.data.forEach(item => {
          this.orgObj[item.i_org_id] = item.is_main_org
        });
        console.log(this.orgObj, data)
        this.$refs.userGroupTree.setSelectCheckedKeys(this.keys);
      },
      // 树选中事件
      getTreeNodes(nodes,keys) {
        this.data = []
        nodes.forEach(item => {
          this.data.push({
            c_name: item.dept_name,
            i_org_id: item.dept_id,
            is_main_org: this.orgObj[item.dept_id] ? this.orgObj[item.dept_id] : false
          })
        })
        console.log(this.data, '回显')
        this.keys = keys
      },
      switchChange(item) {
        this.orgObj[item.i_org_id] = item.is_main_org
      },
      removeData(index) {
        console.log(index)
        this.data.splice(index, 1)
        this.keys.splice(index, 1)
        this.$refs.userGroupTree.setSelectCheckedKeys(this.keys)
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

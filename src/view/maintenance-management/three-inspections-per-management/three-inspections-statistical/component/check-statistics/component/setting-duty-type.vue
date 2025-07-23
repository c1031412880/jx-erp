<template>
  <el-dialog
    :visible="dialogBool"
    title="提醒设置"
    :before-close="dialogClose"
    width="780px"
  >
    <div class="el-dialog-div" ref="maintenanceProjectManage">
      <el-button size="mini" type="primary" @click="add">添加</el-button>
      <el-tabs v-model="tabsValue" type="card">
        <el-tab-pane
          v-for="(item, index) in tableTabs"
          :key="item.name"
          :label="item.title"
          :name="item.name"
        >
          <tr-table
            ref="trTable"
            :data="item.data"
            :tableHeaderList="canRendererTableHeader"
            :TableHeight="500"
          >
            <template slot-scope="scope" slot="vehicle_ids">
              <vehicle-tree 
                placeholder="选择车辆" 
                :vehicleTree="vehicleTree"
                v-model="scope.data.vehicle_ids"
              >
              </vehicle-tree>
            </template>
            <template slot-scope="scope" slot="person_ids">
              <user-tree
                v-model="scope.data.person_ids"
                :userTree="userTree"
                :placeholder="'请选择姓名'"
              ></user-tree>
            </template>
            <template slot-scope="scope" slot="operation">
              <el-button size="mini" type="danger" @click="del(index,scope.index)">删除</el-button>
            </template>
          </tr-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <span class="show-flex-box-r show-flex-center" style="margin-top: 10px;">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="updatePlaybill()"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import vehicleTree from "../tree/vehicle-tree";
import userTree from "../tree/user-tree";
export default {
  components: {
    vehicleTree,
    userTree
  },
  props: {
    dialogBool: Boolean,
    vehicleTree: [Array],
    userTree: [Array],
  },
  data() {
    return {
      tabsValue: '1',
      tableTabs: [
        {
          name: '1',
          title: '低风险',
          data: []
        },
        {
          name: '2',
          title: '中风险',
          data: []
        },
        {
          name: '3',
          title: '高风险',
          data: []
        },
      ],
      canRendererTableHeader: [
        {
          id: 1,
          label: "检查车辆",
          prop: "vehicle_ids",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "提醒人",
          prop: "person_ids",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "操作",
          prop: "operation",
          width: "80",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
      ],
      data: [], //项目列表

      userListMap: {},
      isEchoMap: {}
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.GetWarnDayCheck()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取列表
    GetWarnDayCheck() {
      this.$client.GetWarnDayCheck({})
      .then(res => {
        if (res.head.result == "200") {
          let list = res.context
          list.forEach(item => [
            this.tableTabs.forEach(child => {
              if (item.risk_level == child.name) {
                child.data.push(item)
              }
            })
          ])
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      })
    },
    // 保存 
    updatePlaybill() {
      let list = []
      this.tableTabs.forEach(item => {
        item.data.forEach(child => {
          child.risk_level = item.name
          list.push(child)
        })
      });

      let checkData = list.filter(item => {
        return (item.vehicle_ids.length == 0 || item.person_ids.length == 0)
      })

      if (checkData.length > 0) {
        this.$message({
          showClose: true,
          message: "请选择检查车辆和提醒人",
          type: "warning"
        });
        return
      }
      this.$client.AddOrUpdateWarnDayCheck({context:list})
      .then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: "success"
          });
          this.dialogClose()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      })
    },
    // 添加 
    add() {
      this.tableTabs.forEach(item => {
        if (item.name == this.tabsValue) {
          item.data.push({
            vehicle_ids: [],
            person_ids: [],
          })
        }
      })
    },
    del(i,index) {
      this.tableTabs[i].data.splice(index,1)
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  width: 100%;
  height: 100%;
}

</style>


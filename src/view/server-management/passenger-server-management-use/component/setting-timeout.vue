<template>
  <el-dialog
    :visible="dialogBool"
    title="设置超时类别"
    :before-close="dialogClose"
    width="780px"
  >
    <div class="el-dialog-div" ref="maintenanceProjectManage">
      <el-button size="mini" type="primary" @click="add">添加</el-button>
      <tr-table
        ref="trTable"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :TableHeight="500"
      >
        <template slot-scope="scope" slot="time_out_level">
          <el-input v-model="scope.data.time_out_level"></el-input>
        </template>
        <template slot-scope="scope" slot="time_out_time">
          <el-input-number v-model="scope.data.time_out_time" :controls="false"></el-input-number>
        </template>
        <template slot="is_default" slot-scope="scope">
          <el-switch
            v-model="scope.data.is_default"
            :active-value="1"
            :inactive-value="2"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="changeDefault(scope.data.is_default,scope.index)">
          </el-switch>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button size="mini" type="danger" @click="del(scope.index)">删除</el-button>
        </template>
      </tr-table>
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
export default {
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      canRendererTableHeader: [
        {
          id: 1,
          label: "超时级别",
          prop: "time_out_level",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "规定回复逾期时间(天)",
          prop: "time_out_time",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "默认项",
          prop: "is_default",
          width: "80",
          align: "center",
          signIndex: 2,
          sortable: false,
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
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.GetTimeOutRules()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取列表
    GetTimeOutRules() {
      this.$client.GetTimeOutRules({})
      .then(res => {
        if (res.head.result == "200") {
          this.data = res.context
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      })
      .catch(err => {});
    },
    updatePlaybill() {
      this.$client.UpdateTimeOutRule({context:this.data})
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
      .catch(err => {});
    },
    // 添加 
    add() {
      this.data.push({
        time_out_level: '',
        time_out_time: '',
      })
    },
    del(index) {
      this.data.splice(index,1)
    },
    changeDefault(is_default,i) {
      if (is_default == 1) {
        this.data.forEach((item,index) => {
          if (index != i) {
            item.is_default = 2
          }
        })
      }
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


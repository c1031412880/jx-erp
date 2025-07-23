<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    append-to-body
    :before-close="dialogClose"
    width="900px">
    <div class="el-dialog-div">
      <p style="color: #999;font-size: 12px;">说明：完工需所有维修人员会签确认</p>
      <tr-table
        :data="data"
        :selectionShow="false"
        :TableHeight="TableHeight"
        :tableHeaderList="canRendererTableHeader">
        <template slot-scope="scope" slot="completed_status_name">
          <span :style="{'color': setStateColor(scope.data.completed_status)}">{{ scope.data.completed_status_name }}</span>
        </template>
        <!-- <template slot-scope="scope" slot="operation">
            <el-button type="text" @click="cancelRepairCompletion" :disabled="scope.data.completed_status == 1">撤销</el-button>
          </template> -->
      </tr-table>
    </div>
    <span slot="footer" class="dialog-footer" v-show="selectChangeType != 'detail'">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="danger" v-if="cancelAuth" @click="cancelRepairCompletion()">撤 销</el-button>
      <el-button type="primary" v-else @click="updatePlaybill()">确认完工</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import {getUser} from '@/utils/auth'
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "完工确认",
    },
    selectChangeType: {
      type: String,
      default: "add",
    },
  },
  mounted() {
  },
  data() {
    return {
      orderId: 0,
      data: [],
      loading: false,
      cancelAuth: false,
      TableHeight: 500,
      canRendererTableHeader: [
        {
          id: 1,
          label: "维修人员",
          prop: "repair_person",
          width: "120",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "维修项目",
          prop: "repair_item",
          width: "160",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "维修班组",
          prop: "repair_shop_name",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        
        {
          id: 4,
          label: "实际工时",
          prop: "real_work_hour",
          width: "120",
          align: "left",
          signIndex: 3,
          sortable: true,
        },
        {
          id: 5,
          label: "完工状态",
          prop: "completed_status_name",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "完工时间",
          prop: "completed_date",
          width: "180",
          align: "left",
          signIndex: 5,
          sortable: true,
        },
        // {
        //   id: 7,
        //   label: "操作",
        //   prop: "operation",
        //   width: "130",
        //   align: "center",
        //   signIndex: 6,
        //   sortable: false,
        // }
      ],
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
    setStateColor(state) {
      let color = ''
      switch (state) {
        case 1:
          color = '#999'
          break;
        case 2:
          color = '#67C23A'
          break;
        case 3:
          color = '#F56C6C'
          break;
      }
      return color
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    loadData(id) {
      this.orderId = id
      // 获取维修人员完工列表
      this.$client.GetListCompletedSignDetail({main_id: id})
        .then(res => {
          if (res.head.result == "200") {
            this.data = res.context.list
            let userInfo = JSON.parse(getUser());
            let list = this.data.filter(item => item.repair_person_id == userInfo.user_id);
            let list2 = this.data.filter(item => (item.repair_person_id == userInfo.user_id) && item.completed_status == 2);
            if(list2.length > 0 && list.length == list2.length) this.cancelAuth = true;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 完工
    updatePlaybill() {
      this.$confirm('请确认您的工作是否完成?', '提示', {
        confirmButtonText: '已完成',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let info = {
          completed_status: 2,
          main_id: this.orderId,
        }
        this.$emit("save-repair-item", info);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    },
    // 撤销
    cancelRepairCompletion() {
      this.$confirm('请确认是否撤销?', '提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let info = {
          completed_status: 3,
          main_id: this.orderId,
        }
        this.$emit("save-repair-item", info);
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        });          
      });
    }
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


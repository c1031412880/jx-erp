<template>
  <el-dialog
    :visible="dialogBool"
    title="批量添加"
    :before-close="dialogClose"
    width="960px"
  >
    <div class="el-dialog-div">
      <el-card class="left-box">
        <div
          style="white-space: nowrap; margin-bottom: 10px; font-weight: bold"
        >
          线路车辆选择
        </div>
        <vehicle-tree
          ref="vehicleTree"
          :placeholder="'请输入车辆'"
          @on-check="getVehicle"
        ></vehicle-tree>
      </el-card>
      <el-card class="right-box">
        <el-form ref="form" size="mini">
          <el-form-item label="选择日期:" prop="month">
            <el-date-picker
              v-model="month"
              type="date"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
              @change="loadData"
              :clearable="false"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-table
              ref="table"
              :data="data"
              show-summary
              :sumIndex="sumIndex"
              :summary-method="getSummaries"
              highlight-current-row
              :header-cell-style="{
                background: '#E0F3FF',
                color: '#333333',
                fontSize: '16px',
                padding: '2px 0px',
                fontWeight: '700',
              }"
              :cell-style="{ fontSize: '13px', padding: '2px 0px' }"
              stripe
              border
              height="500"
              style="width: 100%"
            >
              <el-table-column
                type="index"
                width="60"
                label="序号"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="line_name"
                label="线路"
                width="80"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="vehicle_number"
                label="自编号(车牌号)"
                width="150"
                align="center"
              ></el-table-column>
              <el-table-column
                prop="val"
                label="*氢气(kg)"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.val"
                    placeholder="请输入氢气"
                    oninput="value=value.replace(/[^\d.-]/g,'')"
                    @blur="scope.row.val = $event.target.value"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="amount"
                label="*金额(元)"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.amount"
                    placeholder="请输入金额"
                    oninput="value=value.replace(/[^\d.-]/g,'')"
                    @blur="scope.row.amount = $event.target.value"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="driver_id"
                label="签名司机"
                width="155"
                align="center"
              >
                <template slot-scope="scope">
                  <get-driver-select-tree
                    ref="lineTree"
                    :isShowCheckbox="false"
                    v-model="scope.row.driver_id"
                    :placeholder="'选择签名司机'"
                    :isExportMultiple="false"
                    :TreeData="TreeData"
                    :width="'200'"
                  >
                  </get-driver-select-tree>
                </template>
              </el-table-column>
              <el-table-column
                prop="addgas_person"
                label="加气员"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.addgas_person"
                    placeholder="输入加气人"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column
                prop="remark"
                label="备注"
                width="120"
                align="center"
              >
                <template slot-scope="scope">
                  <el-input
                    v-model="scope.row.remark"
                    placeholder="请输入备注"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-form-item>
        </el-form>
      </el-card>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import vehicleTree from "./vehicle-tree";
import getDriverSelectTree from "./get-driver-select-tree";
import {formatDate,deepCopy} from '@/utils/index'
export default {
  components: {
    vehicleTree,
    getDriverSelectTree
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      TreeData: [],
      data: [],
      month: formatDate(new Date(),'yyyy-MM-dd'),
      old_ids:[],
      sumIndex: [4, 5],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.vehicleTree.onVehicleClear();
      } else {
        this.loadData()
        this.loadTreeData()
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        });
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    getVehicle(nodes, ids) {
      // 删除时
      if (this.old_ids.length > ids.length) {
        this.data = this.data.filter(item=> {
          return ids.includes(item.vehicle_id)
        })
        //新增时
      }else if(this.old_ids.length < ids.length) {
        let newNode = nodes.filter(item =>
          !this.old_ids.includes(item.i_id)
        )
        let obj = {
            vehicle_id: newNode[0].i_id,
            line_id: newNode[0].parent_id,
            vehicle_number: newNode[0].c_name,
            line_name: newNode[0].parent_name,
            //新增的数据则赋空值
            val: "",
            amount: "",
            remark: "",
            month: "",
            addgas_person: "",
            driver_id: "",
            id: "",
          };
          this.data.push(obj);
      }
      this.old_ids = deepCopy(ids)
    },
    //加载树数据
    loadTreeData() {
      this.$client.getDeptDriverTree()
      .then((res) => {
          if (res.head.result === "200") {
            this.TreeData = res.context;
          }
        })
        .catch((err) => {});
    },
    // 数据加载
    loadData() {
      let params = {
        month_start: this.month,
        month_end: this.month
      }
      this.$client
        .DataListVehicleHydrogenRecord(params)
        .then((res) => {
          if (res.head.result == "200") {
            this.data = res.context.list
            this.data.forEach(item => {
              if(item.vehicle_number && item.lincense_plate_number){
                item.vehicle_number = `${item.vehicle_number}(${item.lincense_plate_number})`
              }
            });
            this.old_ids = res.context.list.map((item) => item.vehicle_id);
            this.$refs.vehicleTree.setCheckedNodes(this.old_ids);
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    updatePlaybill() {
      let value_success = true;
      let amount_success = true;
      let list = [];
      this.data.forEach((item) => {
        if (item.val === "") {
          value_success = false;
        }
        if (item.amount === "") {
          amount_success = false;
        }
        let obj = {
          vehicle_id: item.vehicle_id,
          line_id: item.line_id,
          month: this.month,
          val: item.val,
          amount: item.amount,
          remark: item.remark,
          addgas_person: item.addgas_person,
          driver_id: item.driver_id,
          ex_department_name: item.ex_department_name,
        };
        list.push(obj);
      });
      if (!value_success) {
        this.$message({
          showClose: true,
          message: "氢气不能为空",
          type: "warning",
        });
        return;
      }
      if (!amount_success) {
        this.$message({
          showClose: true,
          message: "金额不能为空",
          type: "warning",
        });
        return;
      }
      this.$emit("save-add", list);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        const values = data.map((item) => Number(item[column.property]));
        const i_index = this.sumIndex.indexOf(index);
        if (i_index !== -1) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += "";
          sums[index] = Number(sums[index]).toFixed(2);
        } else {
          if (index === 0) {
            sums[index] = "总计";
            return;
          }
          sums[index] = "";
        }
      });

      return sums;
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 600px;
  display: flex;

  .left-box {
    width: 280px;
    height: 100%;
  }

  .right-box {
    flex: 1;
    height: 100%;
  }
}
</style>


<template>
  <el-dialog
    :visible="dialogBool"
    title="批量添加"
    :before-close="dialogClose"
    width="960px"
    
  >
    <div class="el-dialog-div">
      <el-card class="left-box">
        <div style="white-space:nowrap;margin-bottom: 10px;font-weight: bold;">线路车辆选择</div>
        <vehicle-tree
          ref="vehicleTree"
          :placeholder="'请输入车辆'"
          @on-check="getVehicle"
        ></vehicle-tree>
      </el-card>
      <el-card class="right-box">
        <el-form ref="form" size="mini">
          <el-form-item label="油耗月份:" prop="oil_date">
            <el-date-picker
              v-model="oil_date"
              type="month"
              format="yyyy-MM"
              value-format="yyyy-MM-dd"
              placeholder="选择月">
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-table
              ref="table"
              :data="data"
              show-summary
              highlight-current-row
              :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '2px 0px',fontWeight: '700'}"
              :cell-style="{fontSize: '13px', padding: '2px 0px'}"
              stripe
              border
              height="500"
              :summary-method="getSummaries"
              style="width: 100%">
              <el-table-column type="index" width="60" label="序号" align="center"></el-table-column>
              <el-table-column prop="parent_name" label="线路" width="80" align="center"></el-table-column>
              <el-table-column prop="c_name" label="车牌号" width="80" align="center"></el-table-column>
              <el-table-column prop="lable" label="自编号" width="80" align="center"></el-table-column>
              <el-table-column prop="value" label="油耗(L)" width="120" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.value" placeholder="请输入油耗，保留两位小数" oninput="value=value.replace(/[^\d.-]/g,'')" @change="changeValvue(scope.row.value,scope.$index)" @blur="scope.row.value = $event.target.value"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="fee" label="金额(元)" width="120" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.fee" placeholder="请输入金额(，保留两位小数" oninput="value=value.replace(/[^\d.-]/g,'')" @change="changeFee(scope.row.fee,scope.$index)" @blur="scope.row.fee = $event.target.value"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="remark" label="备注" width="120" align="center">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.remark" placeholder="请输入油耗，保留两位小数"></el-input>
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
import vehicleTree from './vehicle-tree'
export default {
  components: {
    vehicleTree
  },
  props: {
    dialogBool: Boolean,
  },
  mounted() {
  },
  data() {
    return {
      data: [],
      oil_date: '',
      carData: [],
      ids: [],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
        this.$refs.vehicleTree.onVehicleClear()
      }else{
        this.setDate();
        this.$nextTick( () => {
          this.$refs["form"].resetFields();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
     // 设置默认日期
    setDate() {
      let date = new Date();
      // date.setTime(new Date().getTime());
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      this.oil_date = Y + '-' + M + '-01'
    },
    changeValvue(val,index) {
      if(!!val) {
        this.data[index].value = Number(val).toFixed(2)
      }
    },
    changeFee(val,index) {
      if(!!val) {
        this.data[index].fee = Number(val).toFixed(2)
      }
    },
    getVehicle(nodes,ids){
      let new_list = []
      let old_list = []
      nodes.forEach((item,index) => {
        let i_index = this.ids.indexOf(item.i_id)

        if (i_index == -1) {
          let obj = {
            vehicle_id: item.i_id,
            line_id: item.parent_id,
            lable: item.lable,
            c_name: item.c_name,
            parent_name: item.parent_name,
            value: '',
            remark: '',
            oil_date: '',
            fee: '',
            id: '',
          }
          new_list.push(obj)
        } else {
          let info = this.data.filter(child => {return child.vehicle_id == this.ids[i_index]})
          old_list.push(info[0])
        }
      });

      this.data = [...old_list,...new_list]
      this.ids = []
      this.data.forEach(item => {
        this.ids.push(item.vehicle_id)
      })
      this.$nextTick(() => {
        this.$refs.table.doLayout()
      })
    },
    updatePlaybill() {
      if (!this.oil_date) {
        this.$message({
          showClose: true,
          message: '请选择油耗月份',
          type: "warning",
        });
        return
      }
      if (this.data.length === 0) {
        this.$message({
          showClose: true,
          message: '请选择新增车辆',
          type: "warning",
        });
        return
      } 
      let value_success = true
      let fee_success = true
      let list = []
      this.data.forEach(item => {

        if (item.value === '') {
          value_success = false
        }

        if (item.fee === '') {
          fee_success = false
        }
        let obj = {
          vehicle_id: item.vehicle_id,
          line_id: item.line_id,
          oil_date: this.oil_date,
          value: Number(item.value),
          remark: item.remark,
          fee: Number(item.fee),
          ex_department_name: item.ex_department_name,
        }
        list.push(obj)
      })
      if (!value_success) {
        this.$message({
          showClose: true,
          message: '油耗不能为空',
          type: "warning",
        });
        return
      }
      if (!fee_success) {
        this.$message({
          showClose: true,
          message: '油耗金额不能为空',
          type: "warning",
        });
        return
      }
      this.$emit('save-add',list)
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        // if (index === 0) {
        //   sums[index] = '总计';
        //   return;
        // }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ''
          sums[index] = Number(sums[index]).toFixed(2)
        } else {
          if (index === 0) {
            sums[index] = '总计';
            return;
          }
          sums[index] = '--';
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


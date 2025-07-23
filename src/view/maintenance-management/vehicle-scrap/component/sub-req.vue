<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="车辆:">
          <get-vehicle-select-tree
            ref="vehicleTree"
            :placeholder="'选择车辆'"
            :isShowCheckbox="false"
            v-model="form.vehicle_id"
            :isExportMultiple="false"
            :width="'180'">
          </get-vehicle-select-tree>
          <!-- <el-select v-model="form.vehicle_id" clearable filterable placeholder="选择车辆">
            <el-option
              v-for="item in firstVehicleData"
              :key="item.vehicle_id"
              :label="item.lp_num"
              :value="item.vehicle_id">
            </el-option>
          </el-select> -->
        </el-form-item>
        <el-form-item label="燃料类别:">
          <tr-select-dictionaries 
            v-model="form.fuel" 
            :classKey="'燃料类别'" 
            :placeholder="'请选择'">
          </tr-select-dictionaries>
        </el-form-item>
        <el-form-item label="审批状态:">
          <el-select v-model="form.state" placeholder="请选择审批状态" clearable>
            <el-option
              v-for="item in disposeConditionOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item v-if="$isPowerShow('rule-setting')">
          <el-button type="primary" @click="$router.push({
            name:'maintenance-rules-setting',
            params:{
              ruleType:'third'
          }
          })">报废规则设置</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm @confirm="onBtn('batch-set')" title="是否重新生成待报废车辆？" v-if="$isPowerShow('patch')">
            <el-button slot="reference" type="primary" size="mini" style="margin-left: 10px;">生成待报废车辆</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add-scrap')" v-if="$isPowerShow('add')">添加待报废车辆</el-button>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onBtn('batch-scrap')" v-if="$isPowerShow('submit')">批量报废申请</el-button>
        </el-form-item>

        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')"
          >导出</el-button
          >
        </el-form-item>

      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
  export default {
    props:{
      firstVehicleData:[Array]
    },
    components:{
      getVehicleSelectTree,
    },
    mounted() {
      this.onSubmit();
    },
    data() {
      return {
        disposeConditionOptions:[ //处理状态
          { value: 1, name: "未提交审批" },
          { value: 2, name: "审批中" },
          { value: 3, name: "审批通过" },
          { value: 4, name: "审批拒绝" },
          { value: 5, name: "已撤销" }
        ],
        form: {
          vehicle_id:"",
          fuel: "",
          state: "",
          check_state: 0
        },
      };
    },
    methods: {
      // 查询
      onSubmit() {
        let info = {};
        for (let i in this.form) {
          if (this.form[i]) {
            info[i] = this.form[i];
          }
        }
        if(this.form.check_state === 0) {
          info.check_state = 0
        }
        this.$emit("on-ok", info);
      },
      // 重置
      resetForm() {
        Object.assign(this.$data, this.$options.data());
        this.onSubmit();
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      },
      // 添加编辑
      onBtn(com) {
        this.$emit(`on-${com}`);
      },
  
    },
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <div class="show-flex-box-r" style="justify-content: space-between;">
          <el-form-item label="公车别名:">
            <el-select v-model="form.bus_id" clearable placeholder="请选择车辆别名" @change="selectedBus">
            <el-option
              v-for="item in vehDataList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
          </el-form-item>
          <!-- <div>
            <span style="color:#909399;font-size:12px;">备注： 灰色表示过期 橙黄色代表已被预定 绿色代表自己选中</span>
          </div> -->
        </div>
        
        <!-- <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>> -->
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  data() {
    return {
      vehDataList: [],
      form: {
        bus_id:"",
      },
    };
  },
  mounted() {
    this.reqUtilityVehicle();
    this.onSubmit();
  },
  methods: {
    // 获取全部公车
    reqUtilityVehicle() {
      this.$client.getByPageBusManage()
        .then(res => {
          if (res.head.result == "200") {
            this.vehDataList = res.context;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    selectedBus(val) {
      this.onSubmit();
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.bus_id = "";
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

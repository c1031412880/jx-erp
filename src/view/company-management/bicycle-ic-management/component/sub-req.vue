<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="卡状态">
          <el-select v-model="form.state" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="正常" value="0"></el-option>
            <el-option label="退卡" value="1"></el-option>
            <el-option label="挂失" value="2"></el-option>
            <el-option label="挂失退卡" value="3"></el-option>
            <el-option label="人为损坏退卡" value="4"></el-option>
            <el-option label="自然损坏退卡" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="关键字">
          <el-input v-model="form.content" placeholder="卡号/身份证号/顾客姓名搜索" clearable></el-input>
        </el-form-item>
        <el-form-item label="卡类型">
          <el-select v-model="form.card_type" placeholder="请选择">
            <el-option label="全部" value=""></el-option>
            <el-option label="市民卡" value="1"></el-option>
            <el-option label="团体卡" value="2"></el-option>
            <el-option label="本地卡" value="3"></el-option>
            <el-option label="临时卡" value="4"></el-option>
            <el-option label="公交卡" value="5"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询类型" class="red-label">
          <el-select v-model="form.query_type" placeholder="请选择">
            <el-option label="全部" value="0"></el-option>
            <el-option label="专用卡" value="1"></el-option>
            <el-option label="市民卡和公交卡" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款类型">
          <el-select v-model="form.return_type" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="网银退款" value="11"></el-option>
            <el-option label="现金退款" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注销类型">
          <el-select v-model="form.cacel_type" placeholder="全部">
            <el-option label="全部" value=""></el-option>
            <el-option label="无卡注销" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="注销时间">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="注销开始时间"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="注销结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="操作员">
          <get-department-select
            ref="personalTree"
            v-model="form.user_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择操作员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onOperatorChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type="primary" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree2";
export default {
  components: {
    getDepartmentSelect
  },
  data() {
    return {
      date: [],
      form: {
        state: '',
        content: '',
        card_type: '',
        query_type: '0',
        return_type: '',
        cacel_type: '',
        user_ids: []
      }
    };
  },
  mounted() {
  },
  methods: {
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i] && this.form[i].length > 0) {
          info[i] = this.form[i];
        }
      }
      if (this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        info.start_time = this.date[0];
        info.end_time = this.date[1];
      } else {
        this.date = [];
        this.form.start_time = '';
        this.form.end_time = '';
      }
      if (this.form.user_ids.length == 0) {
        delete info.user_ids;
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      this.form = {
        state: '',
        content: '',
        card_type: '',
        query_type: '0',
        return_type: '',
        cacel_type: '',
        user_ids: []
      };
      this.date = [];
      this.form.start_time = '';
      this.form.end_time = '';
      this.onSubmit();
      if (type == 'reset') {
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      }
    },
    // 操作员选择变化
    onOperatorChange(vehs, nodes) {
      if (vehs && vehs.length > 0) {
        this.form.user_ids = vehs.map(item => {
          return Number(item.split('_')[1]);
        });
      } else {
        this.form.user_ids = [];
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.red-label .el-form-item__label
  color red
</style>

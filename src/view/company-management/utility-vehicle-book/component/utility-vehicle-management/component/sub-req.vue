<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="车辆别名:">
          <el-input v-model="form.name" placeholder="请输入车辆别名" clearable></el-input>
        </el-form-item>
        <el-form-item label="车辆状态:">
          <el-select v-model="form.state" placeholder="请选择车辆状态" clearable>
            <el-option
              v-for="item in carStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="负责人:">
          <el-input v-model="form.duty_name" placeholder="请输入负责人" clearable></el-input>
        </el-form-item>
        <el-form-item label="上次年检时间:">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="addRecord()" type="primary" v-if="$isPowerShow('add')"
            >添加公车</el-button
          >
        </el-form-item> -->
        <!-- <el-form-item>
          <el-button type="primary"  @click="deleteJob()" v-if="$isPowerShow('del')">删除会议室</el-button>
        </el-form-item> -->
      </el-row>
      <el-row>
       <el-form-item>
          <el-button class="el-icon-plus" @click="addRecord()" type="primary" v-if="$isPowerShow('add')"
            >添加公车</el-button
          >
        </el-form-item> 
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      date:[],
      carStatusOptions:[ //
        { value: 0, name: "未使用" },
        { value: 1, name: "使用中" }
      ],
      form: {
        name: '',
        duty_name: '',
        state: '',
        last_check_start: '',
        last_check_end: ''
      },
    };
  },
  mounted() {
  },
  methods: {
    // 查询
    onSubmit() {
      if(!!this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        this.form.last_check_start = this.date[0];
        this.form.last_check_end = this.date[1];
      }else{
        this.date = []
        this.form.last_check_start = ''
        this.form.last_check_end = ''
      }
      
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.state === 0) {
        info.state = 0
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      this.form.duty_name = "";
      this.form.state = "";
      Object.assign(this.$data, this.$options.data());
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 添加编辑
    addRecord() {
      this.$emit("on-add");
    },
    deleteJob() {
      this.$emit("delete-Job");     
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

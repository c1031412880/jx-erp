<template>
  <div>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item prop="type">
          <el-select v-model="form.type" clearable placeholder="请选择">
            <el-option
              v-for="item in checkOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="key_word">
          <el-input
            placeholder="请输入关键字"
            v-model="form.key_word"
          ></el-input>
        </el-form-item>
        <el-form-item prop="driver_id" label="车主:">
         <el-select v-model="form.driver_id" filterable  clearable placeholder="请选择">
              <el-option
                v-for="item in taxiDriverList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item prop="operation_state" label="车辆状态:">
          <el-select v-model="form.operation_state" clearable placeholder="请选择">
            <el-option
              v-for="item in carStatusOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button  @click="resetForm()" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="date_type">
          <el-select v-model="form.date_type" clearable placeholder="请选择">
            <el-option
              v-for="item in dateOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="start">
         <el-date-picker
          v-model="date"
          type="daterange"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          range-separator="至"
          end-placeholder="结束日期"
          @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="vehicle_owner" label="所有权:">
          <el-select v-model="form.vehicle_owner" clearable placeholder="请选择">
            <el-option
              v-for="item in ownershipOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" v-if="$isPowerShow('add')" @click="onBtn('add')"
            >添加</el-button
          >
        </el-form-item>
        <el-form-item>
           <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除勾选的记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" >删除</el-button>
          </el-popconfirm>
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
  props:{
    taxiDriverList:[Array]
  },
  components: {},
  data() {
    return {
      date:[],
      checkOptions:[
        { value: 1, name: "车牌号" },
        { value: 2, name: "发动机号" },
        { value: 3, name: "车架号" },
        { value: 4, name: "道路运输证号" },
      ],
      dateOptions:[
        { value: 1, name: "注册日期" },
        { value: 2, name: "行驶证年审日期" },
        { value: 3, name: "营运证到期日期" }
      ],
      carStatusOptions:[
        { value: 0, name: "全部" },
        { value: 1, name: "营运" },
        { value: 2, name: "停运" },
        { value: 3, name: "报废" },
      ],
      ownershipOptions:[
        { value: 0, name: "全部" },
        { value: 1, name: "自营" },
        { value: 2, name: "挂靠" }
      ],
      form: {
        type: 1,
        key_word:'',
        driver_id:'',
        operation_state: 0,
        date_type: 1,
        start: '',
        end: '',
        vehicle_owner: 0
      },
    };
  },
  mounted() {
    this.onSubmit()
  },
  methods: {
     selectedTime() {
      if(!!this.date && this.date.length > 0) {
        this.date = this.$addTime(this.date);
        this.form.start = this.date[0];
        this.form.end = this.date[1];
      }else{
        this.form.start = '';
        this.form.end = '';
      }
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      if(this.form.operation_state === 0) {
        info.operation_state = 0
      }
      if(this.form.vehicle_owner === 0) {
        info.vehicle_owner = 0
      }
      if(!this.form.key_word) {
        delete info.type
      }
      if(!this.form.start) {
        delete info.date_type
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      if(!type) {
        Object.assign(this.$data, this.$options.data());
        setTimeout(() => {
          this.$message({type: 'success', message: '重置成功'})
        },300)
      }
      this.onSubmit()
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit("open-setting-Page")
    },
    // 刷新
    refreshTableList() {
      this.resetForm('refresh')
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

<template>
  <div>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item label="用车时间:" prop="timeDate">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            style="width:100%"
            @change="selectedTime"
            >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="用车单位:" prop="use_uint">
          <el-input v-model="form.use_uint" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="联系人:" prop="contact_person">
          <el-input v-model="form.contact_person" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="包车类型:" prop="check_year">
          <el-select v-model="form.chariot_type" placeholder="请选择" style="width:100%" clearable>
            <el-option label="普通包车" :value="1"></el-option>
            <el-option label="大型用车" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单状态:" prop="check_year">
          <el-select v-model="form.types" placeholder="请选择" multiple collapse-tags clearable>
            <el-option
              v-for="item in stateData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" v-if="$isPowerShow('add')" icon="el-icon-plus">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            @confirm="onBtn('delete')"
            title="确定删除选中的包车信息吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" size="mini">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            @confirm="onBtn('end')"
            title="确定完结选中的包车信息吗？"
            v-if="$isPowerShow('end')">
            <el-button slot="reference" type="primary" size="mini">完结</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onBtn('export')" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  components: {},
  data() {
    return {
      form: {
        issuance_time_start: '',
        issuance_time_end: '',
        contact_person: '',
        chariot_type: '',
        types: [1,2,3],
        use_uint:''
      },
      date: [],
      stateData: [
        {
          label: '草稿',
          value: 1
        },
        {
          label: '填报中',
          value: 2
        },
        {
          label: '填报完成',
          value: 3
        },
        {
          label: '完结',
          value: 4
        },
      ]
    };
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
  },
  methods: {
    onSetTime(type = 'thisYear') {
      let timeObj = getDate(type)
      this.form.issuance_time_start = timeObj.startTime
      this.form.issuance_time_end = timeObj.endTime
      this.date = [this.form.issuance_time_start, this.form.issuance_time_end]
      this.form.issuance_time_end = this.form.issuance_time_end + ' 23:59:59'
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.form.issuance_time_start = this.date[0]
        this.form.issuance_time_end = this.date[1] + ' 23:59:59'
      } else {
        this.form.issuance_time_start = ''
        this.form.issuance_time_end = ''
      }
    },
    // 查询
    onSubmit() {
      let info = this.form
      this.$emit("on-ok", info);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    resetForm() {
      Object.assign(this.$data, this.$options.data());
      this.onSubmit()
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

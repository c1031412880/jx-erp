<template>
  <el-form :inline="true" size="mini">
    <el-form-item label="接收时间:">
      <el-date-picker
        v-model="date"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="selectedTime"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
    </el-form-item>
    <el-form-item label="消息类型:">
      <el-select v-model="form.type" clearable>
        <el-option label="待办消息" value="1"></el-option>
        <el-option label="到期提醒" value="2"></el-option>
        <el-option label="系统消息" value="3"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button size="mini" type="primary" @click="onSubmit">查询</el-button>
    </el-form-item>
    <el-form-item>
      <el-popconfirm
        title="确定标记所有记录为已读吗？"
        @confirm="read()">
        <el-button type="primary" slot="reference">全部已读</el-button>
      </el-popconfirm>
    </el-form-item>
    <el-form-item>
      <el-popconfirm
        title="确定清空所有记录吗？"
        @confirm="empty()">
        <el-button type="primary" slot="reference">一键清空</el-button>
      </el-popconfirm>
    </el-form-item>
  </el-form>
</template>

<script type="text/ecmascript-6">
import {getDate} from '@/utils/index'
export default {
  data() {
    return {
      date: '',
      form: {
        type: '',
        start_time: '',
        end_time: ''
      },
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.onSetTime()
      this.onSubmit()
    })
  },
  methods: {
    // 已读
    read() {
      this.$client.ReadAllMessageMessageCenter({}).then(req => {
        this.onSubmit()
        if (req.head.result === '200') {
          this.$message({
            message: req.head.describle,
            type: 'success'
          });
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    // 清空
    empty() {
      this.$client.EmptyAllMessageMessageCenter({}).then(req => {
        this.onSubmit()
        if (req.head.result === '200') {
          this.$message({
            message: req.head.describle,
            type: 'success'
          });
        } else {
          this.$message.error(req.head.describle);
        }
      })
    },
    onSetTime(type = 'lastOneMonth') {
      let timeObj = getDate(type)
      this.form.start_time = timeObj.startTime
      this.form.end_time = timeObj.endTime
      this.date = [this.form.start_time, this.form.end_time]
      this.form.end_time = this.form.end_time + ' 23:59:59'
    },
    selectedTime() {
      if(this.date && this.date.length>0) {
        this.form.start_time = this.date[0]
        this.form.end_time = this.date[1] + ' 23:59:59'
      } else {
        this.form.start_time = ''
        this.form.end_time = ''
      }
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
      this.form.post_id = ''
      Object.assign(this.$data, this.$options.data());
      setTimeout(() => {
        this.onSubmit()
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

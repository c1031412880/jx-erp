<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="发布日期:">
          <el-date-picker
            v-model="date"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期"
            @change="selectedTime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm
            @confirm="onBtn('del')"
            title="是否确批量删除记录？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" icon="el-icon-delete"  size="mini">删除</el-button>
          </el-popconfirm>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
  import {getDate} from '@/utils/index'
  export default {
    props:{
     
    },
    components:{
      
    },
    mounted() {
      this.onSetTime();
      this.onSubmit();
    },
    data() {
      return {
        date:[],
        form: {
          begin:"",
          end: "",
          model: 10003
        },
      };
    },
    methods: {
      onSetTime(type = 'lastOneMonth') {
        let timeObj = getDate(type)
        this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
        this.form.begin = this.date[0]
        this.form.end = this.date[1]
        // console.log(this.date)
      },
      selectedTime: function() {
        if(this.date && this.date.length>0) {
          this.date = this.$addTime(this.date)
          // console.log(this.date)
          this.form.begin = this.date[0];
          this.form.end = this.date[1];
        }else{
          this.form.begin = '';
          this.form.end = '';
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
        if(this.form.check_state === 0) {
          info.check_state = 0
        }
        this.$emit("on-ok", info);
      },
      // 重置
      resetForm() {
        Object.assign(this.$data.form, this.$options.data().form)
        this.onSetTime()
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

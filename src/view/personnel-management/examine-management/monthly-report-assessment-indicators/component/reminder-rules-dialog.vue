<template>
  <el-dialog
    :visible="dialogBool"
    title="提醒规则"
    :before-close="dialogClose"
    width="560px"
    :close-on-click-modal="false"
  >
    <div class="el-dialog-div">
      <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="120px" label-suffix=":">
        <el-form-item label="最终提醒时间" prop="month_day">
          <span>每月</span>
          <el-input-number v-model="form.month_day" style="width:80px" :controls="false"></el-input-number>
          <span>号</span>
        </el-form-item>
        <el-form-item label="提前提醒天数" prop="warn_day">
          <el-input-number v-model="form.warn_day" style="width:80px" :controls="false"></el-input-number>
          <span>天</span>
        </el-form-item>
        <el-form-item label="每天提醒时间" prop="notice_point">
          <el-time-select
            v-model="form.notice_point"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:59'
            }"
            placeholder="选择时间">
          </el-time-select>
        </el-form-item>
        <el-form-item label="提醒方式" prop="notice_type_list">
          <el-checkbox-group v-model="form.notice_type_list">
            <el-checkbox :label="1">系统提醒</el-checkbox>
            <el-checkbox :label="2">APP推送</el-checkbox>
            <el-checkbox :label="3">短信通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="提醒内容" prop="warn_content">
          <el-input v-model="form.warn_content" type="textarea" :rows="4" clearable></el-input>
        </el-form-item>
        <el-form-item label="规则是否启用" prop="valid">
          <el-switch v-model="form.valid" :active-value="1" :inactive-value="2" active-color="#13ce66"></el-switch>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="submit()">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {
        id: 0,
        month_day: '',
        warn_day: '',
        notice_point: '',
        notice_type_list: [],
        warn_content: '',
        valid: 1
      },
      rules: {
        month_day: [
          {
            required: true,
            message: "请输入最终提醒时间",
            trigger: "change",
          },
        ],
        warn_day: [
          {
            required: true,
            message: "请输入提前提醒天数",
            trigger: "change",
          },
        ],
        notice_point: [
          {
            required: true,
            message: "请输入每天提醒时间",
            trigger: "change",
          },
        ],
        warn_content: [
          {
            required: true,
            message: "请输入提醒内容",
            trigger: "change",
          },
        ],
      }
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data.form, this.$options.data().form);
      }else{
        this.loadData()
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
    // 数据回显
    setData(val){
      Object.keys(this.form).forEach(key => {
        if (val.hasOwnProperty(key)) {
          if (val[key]) {
            this.form[key] = val[key]
          }
        }
      })
    },
    loadData() {
      this.$client.GetNoticeRule({}).then((res) => {
        if (res.head.result == "200") {
          this.setData(res.context.list)
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 保存
    submit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$emit("on-ok",this.form)
        } else {
          reject({
            msg: '获取失败,带星号的为必填项'
          });
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
}
</style>


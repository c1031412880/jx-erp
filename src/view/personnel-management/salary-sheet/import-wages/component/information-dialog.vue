<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="660px"
    center
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="100px" size="mini">
        <el-form-item label="发放月份：" prop="month">
          <el-date-picker
            v-model="form.month"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发放类别:" prop="type">
          <el-select v-model="form.type" placeholder="请选择发放类别">
            <el-option
              v-for="item in typeOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="发放内容:" prop="send_types">
          <el-checkbox-group 
              v-model="form.send_types"
              >
              <el-checkbox v-for="item in sendTypesOptions" :label="item" :key="item">{{item}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>

      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')" size="mini">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "下发工资条",
    },
    time:[String]
  },
  mounted() {
  },
  data() {
    return {
      typeOptions: [
        { value: 1, name: '工资'},
        // { value: 2, name: '奖金'},
        // { value: 3, name: '其他'},
      ],
      sendTypesOptions:['基本工资', '工龄工资', '职称补贴', '预发数','奖金', '加班费', '代发工资', '应发工资','扣基本养老金', '扣医保基本金', '扣住房公积金', '扣失业保险金','工会费', '房租水电费', '考勤扣款', '应扣合计', '补扣20%工资','计税工资', '扣个税','实发工资'],
      form: {
        month: "",
        type: 1,
        send_types:['基本工资', '工龄工资', '职称补贴', '预发数','奖金', '加班费', '代发工资', '应发工资','扣基本养老金', '扣医保基本金', '扣住房公积金', '扣失业保险金','工会费', '房租水电费', '考勤扣款', '应扣合计', '补扣20%工资','计税工资', '扣个税','实发工资'],
        cover:0,
      },
      basicRules: {
        month: [
          { required: true, message: "请选择发放的月份", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择发放类别", trigger: "change" },
        ],
        send_types: [
          { required: true, message: "请选择发放内容", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.setDate()
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置默认月份
    setDate() {
      this.form.month = this.time
      // let date = new Date();
      // // date.setTime(new Date().getTime());
      // let Y = date.getFullYear()
      // // let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      // let M = date.getMonth()
      // if(M == 0) {
      //   Y = Y - 1 
      //   M = 12
      // }
      // M = M < 10?'0' + M : M 
      // let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      // this.form.month = Y + '-' + M + '-' + D
    },
   
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$confirm('是否确认现在下发工资条?', '提示', {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.$emit("save-issue", info);
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '已取消'
            });
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>

.el-dialog-div /deep/ .el-date-editor {
  width: 500px;
}
.el-dialog-div /deep/.el-select,.el-select--mini {
  width: 500px;
}
.el-dialog-div /deep/ .el-input,.el-input--mini{
  width: 500px;
}

</style>


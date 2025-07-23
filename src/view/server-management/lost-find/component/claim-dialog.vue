<template>
  <el-dialog
    :visible="dialogBool"
    title="物品认领"
    :before-close="dialogClose"
    width="480px"
    top="25vh"
  >
    <div class="el-dialog-div">
      <el-form :model="form" ref="form" :rules="basicRules" label-width="100px" size="mini">
        <el-form-item label="姓名:" prop="take_name">
          <el-input v-model="form.take_name" placeholder="请输入姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="phone">
          <el-input v-model="form.phone" placeholder="请输入联系电话" clearable></el-input>
        </el-form-item>
        <el-form-item label="身份证号:" prop="id_no">
          <el-input v-model="form.id_no" placeholder="请输入身份证号" clearable></el-input>
        </el-form-item>
        <el-form-item label="认领时间:" prop="take_time">
          <el-date-picker
            v-model="form.take_time"
            type="datetime"
            placeholder="请选择时间"
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
          ></el-date-picker>
        </el-form-item> 
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getUser } from "@/utils/auth";
import {formatDate, formatDateTime} from '@/utils/index'
export default {
  components: {
    getUser,
  },
  props: {
    dialogBool: Boolean,
  },
  mounted() {},
  data() {
    return {
      date: [],
      form: {
        id: 0,
        take_name: "",
        phone: "",
        id_no: "",
        take_time: "",
        operator_user: "",
        operator_time: "",
      },
      basicRules: {
        operator_user: [
          {
            required: true,
            message: "请输入姓名",
            trigger: "change",
          },
        ],
        phone: [
          {
            required: true,
            message: "请输入联系电话",
            trigger: "change",
          },
        ],
        take_time: [
          {
            required: true,
            message: "请选择认领时间",
            trigger: "change",
          },
        ],
        operator_user: [
          {
            required: true,
            message: "请选择经办人",
            trigger: "change",
          },
        ],
        operator_time: [
          {
            required: true,
            message: "请选择办理时间",
            trigger: "change",
          },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.form.take_time = formatDateTime(new Date())
        this.$nextTick(() => {
          if (getUser()) {
            let userInfo = JSON.parse(getUser());
            this.form.operator_user = Number(userInfo.user_id);
          }
          this.$refs.form.clearValidate();
        })
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill() {
      this.form.operator_time = formatDate(new Date(),'yyyy-MM-dd hh:mm:ss')
      if (!/^[1][3,4,5,7,8,9][0-9]{9}$/.test(this.form.phone)) {
        this.$message({
          showClose: true,
          message: "手机号格式错误",
          type: "error",
        });
				return;
			}
      this.$refs.form.validate(valid => {
        if (valid) {
          let info = this.form;
          this.$emit("save", info);
        } else {
          return false;
        }
      });
    }
  }
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 170px;
}

.el-dialog-div /deep/ .el-input {
  width: 300px;
}
</style>


<template>
  <el-dialog :visible="dialogBool" title="车辆报废" :before-close="dialogClose" width="760px">
    <div class="scrap-dialog-content">
      <el-form size="mini" :rules="basicRules" :model="form" ref="scrapForm" inline>
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="自编号:">
              <el-input disabled v-model="v_num" autosize type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="车牌号:">
              <el-input disabled v-model="lp_num" autosize type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item required prop="scrap_date" label="报废日期:">
              <el-date-picker
                v-model="form.scrap_date"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="date"
                placeholder="选择日期">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="24">
          <el-col :span="4">
            <el-form-item>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item  prop="scrap_remark" label="报废原因:">
              <el-input v-model="form.scrap_remark" autosize type="textarea"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form> 
    </div>
    <div slot="footer" class="dialog-footer" >
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="submit()">提 交</el-button>
    </div>
  </el-dialog>
</template>
<script type="text/ecmascript-6">
import { formatDateTime } from "@/utils/index"
export default {
  props: {
    dialogBool: Boolean,
    scrapData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {
      form: {
        scrap_date: '',
        scrap_remark: ''
      },
      lp_num: '',
      v_num: '',
      basicRules: {
        scrap_date: [
          {
            required: true,
            message: "请选择报废日期",
            trigger: "blur",
          },
        ]
      }
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data())
      } else {
        this.lp_num = this.scrapData.map(item => item.lp_num).join(",")
        this.v_num = this.scrapData.map(item => item.v_num).join(",")
        // this.$refs.scrapForm.clearValidate()
        let t = setTimeout(() => {
          this.$refs.scrapForm.clearValidate()
          clearTimeout(t)
        }, 60)
        this.setTime()
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false)
    },
    setTime() {
      this.form.scrap_date = formatDateTime(new Date())
    },
    submit() {
      this.$refs.scrapForm.validate((valid) => {
        if (valid) {
          let ids = this.scrapData.map(item => item.id)
          this.$emit("on-submit", {...this.form, ids: ids})
          this.dialogClose()
        } else {
          return this.$message({
            showClose: true,
            message: "带星号的为必填项",
            type: "warning"
          })
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .scrap-dialog-content {
    max-height: 500px;
    overflow-x: hidden;
    /deep/ .el-form--inline .el-form-item {
      width: 100%;
    }
    /deep/ .el-form-item__label {
      width: 100px;
    }
    /deep/ .el-form-item__content {
      width: calc(100% - 100px)
    }
  }
</style>

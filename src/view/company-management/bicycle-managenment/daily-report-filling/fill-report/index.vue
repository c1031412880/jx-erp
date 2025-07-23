<template>
  <div class="fill-report">
    <el-row ref="head">
      <el-form :inline="true" size="mini">
        <el-form-item label="日期" prop="date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择申请日期"
            v-model="form.date"
            style="width: 100%;"
            :clearable="false">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="经办人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :isContainEmp="true"
            :isExportMultiple="false"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save()">保存</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="clear()">清空</el-button>
        </el-form-item>
      </el-form>
    </el-row>

    <div :style="{height:TableHeight + 'px',overflow: 'auto'}">
      <table-box 
      ref="tableBox"
      :tableBoxType="'edit'"></table-box>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import tableBox from '../component/table-box';
import {formatDate, deepCopy} from '@/utils/index'
import { getUser } from "@/utils/auth"
export default {
  name: "fill-report",
  components: {
    getDepartmentSelect,
    tableBox
  },
  data() {
    return {
      form: {
        date:formatDate(new Date(),'yyyy-MM-dd'),
        user_id:"",
      },
      TableHeight: 500
    };
  },
  mounted() {
    this.form.user_id = Number(JSON.parse(getUser()).user_id)
    this.$nextTick(() => {
      this.setHead()
    })
  },
  methods: {
    // 保存
    save() {
      if (!this.form.user_id) {
        this.$message({
          showClose: true,
          message: '请选择录入人员',
          type: "warning",
        });
        return
      }
      let form = deepCopy(this.$refs.tableBox.form)
      for (const key in form) {
        if (key != 'remark' && key != 'title') {
          form[key] = Number(form[key])
        }
      }
      let params = Object.assign({},form)
      params.date = this.form.date
      params.user_id = this.form.user_id
      this.$client.AddOrUpdateBicycleManage({context:params})
        .then(res => {
          if (res.head.result == "200") {
            this.$message({
              showClose: true,
              message: '保存成功',
              type: "success",
            });
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    // 取消
    clear() {
      this.$refs.tableBox.claerForm()
    },
    // 计算表格高度 和初始化表头
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        this.TableHeight = maxh - th
      }, 60);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.fill-report {
  width: 100%;
  height: 100%;
}
</style>

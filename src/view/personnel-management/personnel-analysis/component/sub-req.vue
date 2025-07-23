<template>
  <div style="height: 25px;">
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <get-department-select
            ref="departmenTree"
            v-model="form.dept_ids"
            :isShowCheckbox="true"
            :placeholder="'请选择部门'"
            :isContainEmp="false"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onSubmit"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.type" @change="changeType" placeholder="请选择" style="width: 150px;">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 年龄  -->
        <el-form-item v-if="form.type == 1">
          <div style="display: flex;">
            <el-input v-model="first_start" style="width: 60px;" @change="changeAge"></el-input>
            {{ '-' }}
            <el-input v-model="last_start" style="width: 60px;" @change="changeAge"></el-input>
          </div>
        </el-form-item>
        <!-- 学历 -->
        <el-form-item v-if="form.type == 2">
          <el-select v-model="form.query_condition" placeholder="请选择" @change="onSubmit">
            <el-option
              v-for="item in educationOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- 在职教育  -->
        <el-form-item v-if="form.type == 3">
          <el-select v-model="form.query_condition" placeholder="请选择" @change="onSubmit">
            <el-option
              v-for="item in educationOptions"
              :key="item.label"
              :label="item.label"
              :value="item.label">
            </el-option>
          </el-select>
        </el-form-item>
         <!-- 职称等级  -->
         <el-form-item v-if="form.type == 4">
          <el-select v-model="form.query_condition" placeholder="请选择" @change="onSubmit">
            <el-option label="正高级" value="正高级"></el-option>
            <el-option label="副高级" value="副高级"></el-option>
            <el-option label="中级" value="中级"></el-option>
            <el-option label="初级" value="初级"></el-option>
          </el-select>
        </el-form-item>
         <!-- 技能等级  -->
         <el-form-item v-if="form.type == 5">
          <el-select v-model="form.query_condition" placeholder="请选择" @change="onSubmit">
            <el-option label="高级技师" value="高级技师"></el-option>
            <el-option label="技师" value="技师"></el-option>
            <el-option label="高级工" value="高级工"></el-option>
            <el-option label="中级工" value="中级工"></el-option>
            <el-option label="初级工" value="初级工"></el-option>
          </el-select>
        </el-form-item>
         <!-- 员工状态  -->
         <el-form-item v-if="form.type == 6">
          <tr-select-dictionaries
            v-model="form.query_condition"
            :classKey="'员工状态'"
            @change="onSubmit"
            :placeholder="'请选择员工状态'"
          ></tr-select-dictionaries>
          <!-- <el-select v-model="form.query_condition" placeholder="请选择" @change="onSubmit">
            <el-option
              v-for="item in employmentlist"
              :key="item.name"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select> -->
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
  },
  props: {
    employmentlist: [Array],
    type: String,
  },
  data() {
    return {
      typeList: [
        {
          value: 1,
          label: '年龄'
        },
        {
          value: 2,
          label: '全日制学历'
        },
        {
          value: 3,
          label: '在职教育'
        },
        {
          value: 4,
          label: '职称等级'
        },
        {
          value: 5,
          label: '技能等级'
        },
        {
          value: 6,
          label: '员工状态'
        },
      ],
      form: {
        type: 1,
        query_condition: '',
        dept_ids: [],
      },
      educationOptions: [
        { label: '博士', value: 1 },
        { label: '研究生', value: 2 },
        { label: '大学', value: 3 },
        { label: '大专', value: 4 },
        { label: '中技', value: 5 },
        { label: '中专', value: 6 },
        { label: '高中及以下', value: 7 }
      ],
      first_start: '',
      last_start: '',
    };
  },
  mounted() {
  },
  watch: {
  },
  methods: {
    changeType() {
      this.form.query_condition = ''
      this.first_start = ''
      this.last_start = ''
      this.onSubmit()
    },
    // 修改年龄
    changeAge() {
      // 都有数值
      if (this.first_start && this.last_start) {
        if (this.last_start < this.first_start) {
          this.$message({
            showClose: true,
            message: '结束年龄不能小于开始年龄',
            type: "warning",
          });
          this.last_start = ''
          return
        }
        this.form.query_condition = `${this.first_start}-${this.last_start}`
        this.onSubmit()
      }

      if (!this.first_start && !this.last_start) {
        this.form.query_condition = ''
        this.onSubmit()
      }
    },
    // 查询
    onSubmit() {
      this.$emit("on-ok", this.form,this.type);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

<template>
  <div>
    <el-form :inline="true" size="mini" :model="form" ref="form">
      <el-row>
        <el-form-item prop="user_id" label="人员：">
           <get-department-select
              ref="userTree"
              v-model="form.user_id"
              :isContainEmp="true"
              :placeholder="'请选择人员'"
              :isShowCheckbox="false"
              :isExportMultiple="false"
            ></get-department-select>
        </el-form-item>
        <el-form-item prop="dept_ids" label="部门：">
          <get-department-select
              ref="deptTree"
              v-model="form.dept_ids"
              :isContainEmp="false"
              :placeholder="'请选择部门'"
            ></get-department-select>
          </el-form-item>
        <el-form-item prop="type" label="员工奖惩:">
          <el-select v-model="form.type" placeholder="请选择所属种类" >
            <el-option label="全部" :value="0"></el-option>
            <el-option label="奖励" :value="1"></el-option>
            <el-option label="惩罚" :value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item prop="create_start" label="录入时间:">
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
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {getDepartmentSelect},
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
        user_id: '',
        dept_ids:[],
        type: 0,
        create_start: '',
        create_end: '',
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
        this.form.create_start = this.date[0];
        this.form.create_end = this.date[1];
      }else{
        this.form.create_start = '';
        this.form.create_end = '';
      }
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      if(this.form.type === 0) {
        info.type = 0
      }
      if(this.form.dept_ids.length == 0) {
        delete info.dept_ids
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      if(!type) {
        this.$refs.userTree.onClear()
        this.$refs.deptTree.onClear()
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

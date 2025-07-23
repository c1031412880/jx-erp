<!--  -->
<template>
  <div>
    <el-drawer
      title="高级筛选"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="dialogClose"
      size="650px">
    <div class="advanced-filter ">
      <el-form ref="form" :model="form"  label-width="100px" size="mini">
        <el-row :gutter="50">
          <el-col :span="24">
            <el-form-item label="出生日期:" prop="birth_start">
              <el-date-picker
                v-model="date1"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="selectedTime1"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="进单位时间:" prop="begin">
              <el-date-picker
                v-model="date"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="selectedTime"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="年龄:" prop="">
              <el-input-number v-model="form.age_start " :controls="false"></el-input-number>
              ——
              <el-input-number v-model="form.age_end" :controls="false"></el-input-number>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="12">
            <el-form-item label="职级:" prop="rank">
              <tr-select-dictionaries
                v-model="form.rank"
                :classKey="'岗位级别'"
                :placeholder="'请选择职级'"
                :isMultiple="false"
              ></tr-select-dictionaries>
            </el-form-item>
          </el-col> -->
          
          <el-col :span="12">
            <el-form-item label="全日制学历:" prop="full_education">
            <tr-select-dictionaries
              v-model="form.full_education"
              :classKey="'最高学历'"
              :placeholder="'请选择全日制学历'"
              :isMultiple="false"
            ></tr-select-dictionaries>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业院校:" prop="school">
              <el-input v-model="form.school" placeholder="请输入全日制毕业院校" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所学专业:" prop="major">
              <el-input v-model="form.major" placeholder="请输入全日制所学专业" clearable
              :style="{width: '100%'}"></el-input>
          </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="最高学历:" prop="highest_education">
              <tr-select-dictionaries
                v-model="form.highest_education"
                :classKey="'最高学历'"
                :placeholder="'请选择最高学历'"
                :isMultiple="false"
              ></tr-select-dictionaries>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="毕业院校:" prop="highest_school">
              <el-input v-model="form.highest_school" placeholder="请输入最高学历毕业院校" clearable
              :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="所学专业:" prop="highest_major">
              <el-input v-model="form.highest_major" placeholder="请输入最高学历所学专业" clearable
              :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="政治面貌:" prop="political">
              <el-select v-model="form.political" placeholder="请选择政治面貌" clearable :style="{width: '100%'}">
                <el-option 
                  v-for="(item, index) in politicalOptions" 
                  :key="index" 
                  :label="item.name"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="民族:" prop="nation">
              <el-input v-model="form.nation" placeholder="请填写民族" clearable
                :style="{width: '100%'}"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="demo-drawer__footer show-flex-box-r show-flex-center">
        <el-button icon="el-icon-refresh-left" @click="resetForm('form')">重置</el-button>
        <el-button icon="el-icon-search" type="primary" @click="onSubmit">查询</el-button>
      </div>
    </div>
    
    </el-drawer>
  </div>
</template>

<script>
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getPositionList from "@/components/base/formModel/select/get-position-list";
export default {
  components: { getSelectDictionaries,getPositionList},
  data() {
    return {
      direction: 'rtl',
      politicalOptions:[
        { value: "群众", name: "群众" },
        { value: "团员", name: "团员" },
        { value: "党员", name: "党员" },
        { value: "预备党员", name: "预备党员" },
      ],
      date: [],
      date1:[],
      form:{
        birth_start:'',
        birth_end:'',
        age_start: '',
        age_end: '',
        rank:'',
        full_education:'',
        school: '',
        major: '',
        highest_education: '',
        highest_school: '',
        highest_major: '',
        nation: '',
      },
    };
  },
  props: {
    drawer: Boolean,
  },

  watch: {
    drawer(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },

  methods: {
    // 修饰符回调
    dialogClose() {
      // element组件的修饰符关闭方法(使用自己的)
      this.$emit("update:drawer", false);
    },
    selectedTime: function(val) {
      if(!!val && val.length) {
        this.date = this.$addTime(this.date)
        this.form.begin = this.date[0]
        this.form.end = this.date[1]
      }else{
        this.date = []
        this.form.begin =''
        this.form.end = ''
      }
    },
    selectedTime1: function(val) {
      if(!!val && val.length) {
        this.date1 = this.$addTime(this.date1)
        this.form.birth_start = this.date1[0]
        this.form.birth_end = this.date1[1]
      }else{
        this.date1 = []
        this.form.birth_start =''
        this.form.birth_end = ''
      }
    },
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
      this.dialogClose();
    },
    resetForm(formName) {
      Object.assign(this.$data, this.$options.data());
      this.$refs[formName].resetFields();
      
      this.onSubmit()
      // this.$parent.informationDialogOk();
      // setTimeout(() => {
      //   this.$message({ message: "重置成功", type: "success" });
      // }, 50);
    }
  },
};
</script>
<style lang='scss' scoped>
.advanced-filter{
  padding: 0 40px;
}
.demo-drawer__footer{
  margin-top: 40px;
}
</style>
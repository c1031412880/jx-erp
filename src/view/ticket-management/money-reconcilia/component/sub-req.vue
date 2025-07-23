<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="选择开始日期"
            end-placeholder="选择结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="personalTreeOne"
            v-model="user_indexs1"
            :isShowCheckbox="true"
            :placeholder="'请选择值班人员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onDutyChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="personalTreeTwo"
            v-model="user_indexs2"
            :isShowCheckbox="true"
            :placeholder="'请选择存款人员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onEntryChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="personalTreeThree"
            v-model="user_indexs3"
            :isShowCheckbox="true"
            :placeholder="'请选择点钞人员'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="true"
            :isCheckStrictly="false"
            @on-change="onReckonChange"
          ></get-department-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.state" clearable placeholder="审核状态">
            <el-option label="已审核" :value="1"></el-option>
            <el-option label="未审核" :value="0"></el-option>
            <el-option label="取消审核" :value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type icon="el-icon-refresh-right">重置</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button @click="onAdd()" type="primary" v-if="$isPowerShow('add')">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="deleteSelect()" type="primary" v-if="$isPowerShow('del')">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import')">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')">导出</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="isCheck('sure')" type="primary" v-if="$isPowerShow('check')">批量审核</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="isCheck('cancle')" type="primary" v-if="$isPowerShow('check')">取消审核</el-button>
        </el-form-item>
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i class="el-icon-s-tools" style="cursor: pointer" @click="openSettingPage()"></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree2";
export default {
  components: {
    getDepartmentSelect
  },
  data() {
    return {
      date: [],
      form: {
        begin_time: "",
        end_time: "",
        duty_ids: [],
        entry_ids: [],
        reckon_ids: [],
        state: ""
      },
      user_indexs1: [],
      user_indexs2: [],
      user_indexs3: [],
    };
  },
  mounted() {
    this.setSearchtime();
    this.onSubmit();
  },
  methods: {
    onDutyChange(vehs, nodes){
      if (vehs && vehs.length > 0) {
        this.form.duty_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.duty_ids = []
      }
    },
    onEntryChange(vehs, nodes){
      if (vehs && vehs.length > 0) {
        this.form.entry_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.entry_ids = []
      }
    },
    onReckonChange(vehs, nodes){
      if (vehs && vehs.length > 0) {
        this.form.reckon_ids = vehs.map(item => {
          return Number(item.split('_')[1])
        });
      } else {
        this.form.reckon_ids = []
      }
    },
    setSearchtime() {
      let date = new Date();
      date.setTime(date.getTime()-24*60*60*1000);
      let Y = date.getFullYear()
      let M = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
      let D = date.getDate() < 10 ? ('0' + date.getDate()) : date.getDate()
      date = Y + '-' + M + '-' + D
      this.date =[`${date} 00:00:00`, `${date} 23:59:59`]
      console.log(this.date);
    },
    // 查询
    onSubmit() {
      if (this.date && this.date.length > 1) {
        this.date = this.$addTime(this.date);
        this.form.begin_time = this.date[0];
        this.form.end_time = this.date[1];
      }else{
        this.form.begin_time = '';
        this.form.end_time = '';
      }
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      if(this.form.duty_ids.length == 0) {
        delete info.duty_ids
      }
      if(this.form.entry_ids.length == 0) {
        delete info.entry_ids
      }
      if(this.form.reckon_ids.length == 0) {
        delete info.reckon_ids
      }
      if(this.form.state === 0) {
        info.state = 0
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      this.form.duty_ids = [];
      this.form.entry_ids = [];
      this.form.reckon_ids = [];
      this.form.state = "";
      this.$refs.personalTreeOne.onClear();
      this.$refs.personalTreeTwo.onClear();
      this.$refs.personalTreeThree.onClear();
      this.form.begin_time = "";
      this.form.end_time = "";
      this.date = [];
      this.setSearchtime();
      this.onSubmit();
      if(type == 'reset') {
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      }
      
    },
    // 添加编辑
    onAdd() {
      this.$emit("on-add", "add");
    },
    deleteSelect() {
      this.$emit("delete-select");
    },
    isCheck(type) {
      this.$emit("is-check", type);
    },
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
    // 刷新列表
    refreshTableList() {
      this.$parent.restTableList();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-form-item {
}
</style>

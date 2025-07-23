<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="姓名:">
          <el-input v-model="form.name" placeholder="搜索姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="出生年月:">
          <el-date-picker
            v-model="form.birthday"
            type="daterange"
            range-separator="至"
            start-placeholder="选择开始日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            end-placeholder="选择结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="25步工作流程:">
          <el-select v-model="form.work_flow" clearable placeholder="请选择25步工作流程">
            <el-option
              v-for="item in flowOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="性别:">
          <el-select v-model="form.sex" clearable placeholder="请选择性别">
            <el-option label="男" :value="1"></el-option>
            <el-option label="女" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发展培养方式:">
          <el-select v-model="form.way" clearable placeholder="请选择发展培养方式">
            <el-option label="重点培养" :value="2"></el-option>
            <el-option label="正常培养" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发展阶段:">
          <el-select v-model="form.state" clearable placeholder="请选择发展阶段">
            <el-option
              v-for="item in developmentPhaseOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm('reset')" type="primary" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button class="el-icon-plus" @click="addBut()" type="primary" v-if="$isPowerShow('add')"
            >新增</el-button
          >
        </el-form-item>
        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
      flowOptions:[
        {
          value: 1,
          label: '递交入党申请书'
        }, {
          value: 2,
          label: '党组织派人谈话'
        }, {
          value: 3,
          label: '推荐和确定入党积极份子'
        }, {
          value: 4,
          label: '上级党委备案'
        }, {
          value: 5,
          label: '指定培养联系人'
        }, {
          value: 6,
          label: '培养教育考察'
        }, {
          value: 7,
          label: '确定发展对象'
        }, {
          value: 8,
          label: '报上级党委备案'
        }, {
          value: 9,
          label: '确定入党介绍人'
        }, {
          value: 10,
          label: '进行政治审查'
        }, {
          value: 11,
          label: '开展集中培训'
        }, {
          value: 12,
          label: '支部委会审查'
        }, {
          value: 13,
          label: '上级党委预审'
        }, {
          value: 14,
          label: '填写入党志愿书'
        }, {
          value: 15,
          label: '支部讨论大会'
        }, {
          value: 16,
          label: '上级党委派人谈话'
        }, {
          value: 17,
          label: '上级党委审批'
        }, {
          value: 18,
          label: '再上级党委组织部门备案'
        }, {
          value: 19,
          label: '编入党支部和党小组'
        }, {
          value: 20,
          label: '入党宣誓'
        }, {
          value: 21,
          label: '继续教育考察'
        }, {
          value: 22,
          label: '提出转正申请'
        }, {
          value: 23,
          label: '支部讨论大会'
        }, {
          value: 24,
          label: '上级党委审批'
        }, {
          value: 25,
          label: '材料归档'
        }
      ],
      developmentPhaseOptions:[
        {
          value: 1,
          label: '入党申请'
        }, {
          value: 2,
          label: '入党积极分子'
        }, {
          value: 3,
          label: '发展对象'
        }, {
          value: 4,
          label: '预备党员'
        }, {
          value: 5,
          label: '正式党员'
        }
      ],
      form: {
        name: "",
        birthday: [],
        work_flow: "",
        sex: "",
        way: "",
        state: "",
      },
    };
  },
  mounted() {
  },
  methods: {

    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm(type) {
      this.form.name = "";
      this.form.birthday = [];
      this.form.sex = "";
      this.form.way = "";
      this.form.work_flow = "";
      this.form.state = "";
      this.onSubmit();
      if(type == 'reset') {
        setTimeout(() => {
          this.$message({ message: "重置成功", type: "success" });
        }, 50);
      }
      
    },
    // 添加编辑
    addBut() {
      this.$emit("on-add", 'add');
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit('open-setting-page-event')
    },
    // 刷新列表
    refreshTableList() {
      this.resetForm();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 50);
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

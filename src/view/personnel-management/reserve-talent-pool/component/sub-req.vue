<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-input v-model="form.user_name" placeholder="员工姓名" clearable>
          </el-input>
        </el-form-item>
        <el-form-item>
          <get-department-select
            ref="tree"
            v-model="form.department_bases"
            :isContainEmp="isContainEmp"
            :placeholder="'请选择部门'"
          ></get-department-select>
        </el-form-item>

        <el-form-item>
         <get-position-list v-model="form.position_ids" :multiple="true"></get-position-list>
        </el-form-item>
        <el-form-item>
          <el-input v-model="form.top_education" placeholder="请输入学历" clearable>
          </el-input>
          <!-- <el-select v-model="form.top_education" clearable placeholder="学历">
            <el-option
              v-for="item in educationOptions"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button  @click="Reset" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
       
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >添加人员</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="onBtn('import')" icon="el-icon-upload2" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item> -->
         <el-form-item>
           <el-popconfirm
            @confirm="deleteInfo()"
            title="确定删除勾选的记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="primary" icon="el-icon-delete" >删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-download" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>
        <div style="float: right; height: 47px; display: flex">
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
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getPositionList from "@/components/base/formModel/select/get-position-list";
export default {
  components: { getDepartmentSelect, getPositionList},
  data() {
    return {
      isContainEmp: false, //是否显示部门下的人员
      educationOptions:[ //状态
        { value: "小学", name: "小学" },
        { value: "初中", name: "初中" },
        { value: "高中", name: "高中" },
        { value: "中专", name: "中专" },
        { value: "大专", name: "大专" },
        { value: '本科', name: "本科" },
        { value: "硕士", name: "硕士" },
        { value: "博士", name: "博士" },
      ],
      form: {
        user_name:"",
        department_bases: [],
        position_ids: [],
        top_education: "",
      },
    };
  },
  mounted() {
  },
  methods: {
    
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    Reset(){
      Object.assign(this.$data, this.$options.data());
      // 清空部门选中
      this.$refs.tree.onClear()
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 删除
    deleteInfo() {
      this.$emit("on-delete");
    },
    onBtn(com) {
      this.$emit("on-" + com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="驾驶员:">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_ids"
            :width="'220'"
            :isShowCheckbox="true"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="true"
            clearable>
          </get-driver-select-tree>
        </el-form-item> 
        <el-form-item label="星级">
          <el-select v-model="form.now_stars" collapse-tags multiple clearable placeholder="请选择星级">
            <el-option
              v-for="item in starsData"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button v-for="(item, index) in deptData" :key="index" type="primary" plain @click="onSubmit(item.id)">{{item.name}}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit(false)">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="Reset" icon="el-icon-refresh-left">重置</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from "@/components/base/formModel/tree/get-driver-select-tree";
export default {
  components: { 
    getDriverSelectTree,
  },
  data() {
    return {
      form: {
        driver_ids: [],
        now_stars: []
      },
      deptData: [],
      starsData: [
        {
          label:'一星级',
          value: 1
        },
        {
          label:'二星级',
          value: 2
        },
        {
          label:'三星级',
          value: 3
        },
        {
          label:'四星级',
          value: 4
        },
        {
          label:'五星级',
          value: 5
        },
      ],
    };
  },
  created() {
    // 获取部门数据
    // this.getDeptList();
  },
  mounted() {
    this.onSubmit();
  },
  methods: {
    onSubmit(id) {
      this.$emit("on-ok", this.form, id);
    },
    // 重置
    Reset() {
      Object.assign(this.$data.form, this.$options.data().form);
      this.$refs.driverTree.onClear();
      this.onSubmit();
    },
    getDeptList() {
      this.$client
        .GetAllOperationDept({})
        .then(res => {
          if (res.head.result == '200') {
            this.deptData = res.context;
          } 
        })
    }
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped></style>

<template>
  <el-dialog
    :visible="dialogBool"
    :title="dialogTitle"
    width="520px"
    :before-close="dialogClose">
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="100px" size="mini">
        <el-form-item label="驾驶员" prop="driver_id">
          <get-driver-select-tree
            ref="driverTree"
            v-model="form.driver_id"
            :isShowCheckbox="false"
            :disabled="curSelectedType === 'detail'"
            :placeholder="'请选择驾驶员'"
            :isExportMultiple="false"
            @on-change="onSelectDriverChange"
          ></get-driver-select-tree>
        </el-form-item>
        <!-- <el-form-item label="工号:" prop="work_id">
          <el-input v-model="form.work_id" disabled></el-input>
        </el-form-item> -->
        <el-form-item label="所属组织" prop="dept_id">
          <get-department-select-tree
            ref="deptTree"
            v-model="form.dept_id"
            :isShowCheckbox="false"
            :placeholder="'请选择所属组织'"
            :isExportMultiple="false" 
            :isCheckStrictly="true"
            :disabled="true"
          ></get-department-select-tree>
        </el-form-item>
        <el-form-item label="评选单位" prop="evaluate_unit">
          <el-select v-model="form.evaluate_unit" style="width: 100%;" :disabled="curSelectedType === 'detail'" placeholder="请选择评选单位">
            <el-option label="嘉通交运集团" :value="1"></el-option>
            <el-option label="嘉通集团" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="评定年份" prop="year">
          <el-date-picker
            v-model="form.year"
            type="year"
            :disabled="curSelectedType === 'detail'"
            style="width: 100%;"
            placeholder="请选择评定年份"
            value-format="yyyy"
            format="yyyy">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="公示日期" prop="publish_date">
          <el-date-picker
            v-model="form.publish_date"
            type="date"
            :disabled="curSelectedType === 'detail'"
            style="width: 100%;"
            placeholder="请选择公示日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button size="mini" @click="dialogClose">取 消</el-button>
      <el-button size="mini" type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDriverSelectTree from '@/components/base/formModel/tree/get-driver-select-tree'
import getDepartmentSelectTree from '@/components/base/formModel/tree/get-department-select-tree'
export default {
  components: {getDriverSelectTree, getDepartmentSelectTree},
  props: {
    dialogBool: Boolean,
    dialogTitle: String,
    curSelectedType: String,
  },
  mounted() {
  },
  data() {
    return {
      driver_name: '',
      form: {
        id: "",
        driver_id: '',
        work_id: '', // 工号
        dept_id: '', // 所属组织
        evaluate_unit: '', // 评选单位
        year: (new Date().getFullYear() - 1).toString(), // 评定年份
        publish_date: '', // 公示日期
      },
      basicRules: {
        driver_id: [
          { required: true, message: "请选择驾驶员", trigger: "change" },
        ],
        evaluate_unit: [
          { required: true, message: "请输入评选单位", trigger: "change" },
        ],
        year: [
          { required: true, message: "请选择评定年份", trigger: "change" },
        ],
        // publish_date: [
        //   { required: true, message: "请选择公示日期", trigger: "change" },
        // ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data.form, this.$options.data().form);
        this.$refs.driverTree.onClear();
        this.$refs.deptTree.onClear();
      }
    },
  },
  methods: {
    setData(info) {
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(info, key)) {
          this.form[key] = info[key];
        }
      }
      if (this.form.year) {
        this.form.year = this.form.year.toString();
      }
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    onSelectDriverChange(drivers, nodes) {
      if (nodes && nodes.length > 0) {
        this.form.dept_id = nodes[0].parent_id
      }
      // let params = {
      //   id: drivers[0]
      // }
      // this.$client.getDriverInfo(params).then(res => {
      //   if(res.head.result == '200') {
      //     let info = res.context;
      //     console.log(info);
          
      //   }else{
      //     this.$message({
      //       showClose: true,
      //       message: res.head.describle,
      //       type: "error",
      //     });
      //   }
      // })
    },
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("on-save", info);
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


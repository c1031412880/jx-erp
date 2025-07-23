<template>
  <el-dialog
    :visible="dialogBool"
    title="编辑驾驶员星级"
    :before-close="dialogClose"
    width="600px"
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="驾驶员:" prop="driver_name">
          <el-input v-model="driver_name" disabled></el-input>
        </el-form-item>
        <el-form-item label="当前星级:" prop="now_star">
          <el-rate v-model="form.now_star" :max="5" :colors="['#F56C6C','#F56C6C','#F56C6C']"></el-rate>
        </el-form-item>
        <el-form-item label="评定季度:">
          <get-quarter-select v-if="dialogBool" ref="getQuarterSelect" :defaultValue="defaultValue" @on-change="funcQuarter"></get-quarter-select>
        </el-form-item>
        <el-form-item label="持续季度:" prop="quarter_count">
          <el-input-number v-model="form.quarter_count" :min="1" ></el-input-number>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getQuarterSelect from "@/components/base/formModel/select/get-quarter-select";
export default {
  components: {getQuarterSelect},
  props: {
    dialogBool: Boolean,
  },
  mounted() {
  },
  data() {
    return {
      driver_name: '',
      form: {
        id: "",
        driver_id: '',
        year_quarter: '',
        now_star: 0,
        quarter_count: 0,
      },
      defaultValue: '',
      basicRules: {
        now_star: [
          { required: true, message: "请选择当前星级", trigger: "change" },
        ],
        quarter_count: [
          { required: true, message: "请选择持续季度", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
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
      this.driver_name = info.driver_name
      if(info.year_quarter) {
        setTimeout(() => {
          this.$refs.getQuarterSelect.year = info.year_quarter.slice(0, 4)
          let quarter = info.year_quarter.slice(6, 7)
          let num = quarter === '一' ? 0 : quarter === '二' ? 1 : quarter === '三' ? 2 : 3
          this.$refs.getQuarterSelect.selectSeason(num)
        }, 50)
      }
    },
    funcQuarter(val) {
      // console.log(val);
      this.form.year_quarter = val
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("on-edit", info);
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


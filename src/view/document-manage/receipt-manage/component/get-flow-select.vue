<template>
  <el-select
    :disabled="disabled"
    clearable
    v-loading="loading"
    v-model="id"
    :placeholder="placeholder"
    filterable
    @change="change"
  >
    <el-option
      v-for="(item,index) in data"
      :key="index"
      :label="item.flow_name"
      :value="item.flow_id"
    >
    </el-option>
  </el-select>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    value: {},
    placeholder: {
      type: String,
      default: "请选择审核流程",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  watch: {
    value(newVal) {
      this.id = newVal;
    },
  },
  data() {
    return {
      id: "",
      data: [],
      loading: false,
    };
  },
  created() {
    this.loadData();
  },
  mounted() {
    if (this.value) {
      this.id = this.value;
    }
  },
  methods: {
    // 初始化数据
    loadData() {
      let parmas = {};
      this.loading = true;
      this.$client.getAllFlowFormManager(parmas)
        .then(res => {
          // console.log(res)
          if (res.head.result == "200") {
            this.data = res.context.list;
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
          this.loading = false;
        })
        .catch((err) => {
          this.loading = false;
          this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    change(val) {
      this.$emit("input", val);
      this.data.forEach((item) => {
        if (item.i_id === val) {
          this.$emit("change", item);
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>

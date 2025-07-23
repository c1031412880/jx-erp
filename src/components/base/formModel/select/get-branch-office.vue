<template>
  <el-select
    :multiple="multiple"
    clearable
    v-loading="loading"
    v-model="id"
    :placeholder="placeholder"
    filterable
    @change="change"
  >
    <el-option
      v-for="item in data"
      :key="item.id"
      :label="item.name"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    value: {},
    placeholder: {
      type: String,
      default: "请选择分公司",
    },
    multiple: {
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
      this.loading = true;
      this.$client.GetDeptInfoCaches()
        .then((res) => {
          console.log(res)
          if (res.head.result == "200") {
              this.data = res.context
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
            this.data = [];
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
        if (item.id === val) {
          this.$emit("change", item);
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>

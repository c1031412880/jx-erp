<template>
  <el-select
    :disabled="disabled"
    clearable
    v-loading="loading"
    v-model="id"
    :placeholder="placeholder"
    filterable
    :style="{'width': width}"
    @change="change"
  >
    <el-option
      v-for="(item) in data"
      :key="item.id"
      :label="item.name"
      :value="item.id"
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
      default: "请选择外修单位",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    width: '',
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
      this.$client.getRepairUnit()
        .then((res) => {
          if (res.head.result == "200") {
            console.log(res);
            this.data = res.context;
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

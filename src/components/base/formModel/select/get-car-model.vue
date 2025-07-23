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
      :label="item"
      :value="item"
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
      default: "请选择车辆型号",
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
      let parmas = {
        type: 1,
      };
      this.loading = true;
      this.$client.getVehicleModeCMData(parmas)
        .then((res) => {
          if (res.head.result == "200") {
              this.data = res.content.list;
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
        if (item.I_ID === val) {
          this.$emit("change", item);
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>

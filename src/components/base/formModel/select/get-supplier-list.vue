<template>
  <el-select
    :disabled="disabled"
    clearable
    v-loading="loading"
    v-model="id"
    :placeholder="placeholder"
    filterable
    remote
    @change="change"
    :remote-method="filterFun"
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
      default: "请选择供应商",
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
      allData: [],
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
      let params = {
        context: {
          page_index: 1,
          page_size: 999
        }
      };
      this.$client.GetProviderPage(params)
        .then(res => {
          if (res.head.result == "200") {
            this.allData = res.context.list
            this.data = res.context.list
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
    filterFun(a) {
      // console.log(a,this.data)
      // 通过mnemonic_code name code 字段进行过滤这些字段可能为null
      if (a !== '') {
        this.data = this.allData.filter(
          (item) =>{
            console.log(item.name, item.mnemonic_code, item.code)
            return (item.name ? item.name.indexOf(a) > -1 : false) ||
              (item.mnemonic_code ? item.mnemonic_code.indexOf(a) > -1 : false) ||
              (item.code ? item.code.indexOf(a) > -1 : false)
          }
        );
      } else {
        this.data = this.allData;
      }

    },
    change(val) {
      this.$emit("input", val);
      this.allData.forEach((item) => {
        if (item.id === val) {
          this.$emit("change", item);
        }
      });
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>

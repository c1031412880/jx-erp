<template>
  <el-select
    :disabled="disabled"
    clearable
    v-loading="loading"
    v-model="id"
    :placeholder="placeholder"
    filterable
    :multiple="multiple"
    collapse-tags
    @change="change"
  >
    <el-option
      v-for="(item,index) in data"
      :key="index"
      :label="item.c_name"
      :value="item.i_id"
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
      default: "请选择岗位",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    dept_id: {
      type: String,
      default: "",
    }
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
        dept_id: this.dept_id
      };
      this.loading = true;
      this.$client.getSysPositionList(parmas)
        .then(res => {
          console.log(res)
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
            this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        });
    },
    change(val) {
      this.$emit("input", val);
      if (this.multiple) {
        let list = []
        this.data.forEach((item) => {
          if (val.indexOf(item.i_id) !== -1) {
            list.push(item)
          }
        });
        this.$emit("change", list);
      } else {
        this.data.forEach((item) => {
          if (item.i_id === val) {
            this.$emit("change", item);
          }
        });
      }
      
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>

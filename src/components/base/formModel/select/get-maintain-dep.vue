<template>
  <el-select
    :disabled="disabled"
    clearable
    v-loading="loading"
    v-model="id"
    :placeholder="placeholder"
    :style="{'width': width}"
    filterable
    @change="change"
  >
    <el-option
      v-for="(item,index) in data"
      :key="index"
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
      default: "",
    },
    width: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    init: {
      type: Boolean,
      default: true
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
      this.$client.getMaintainDep()
        .then((res) => {
          console.log(res)
          if (res.head.result == "200") {
              this.data = res.context
              if(this.init) {
                this.id = res.context[0].id
                this.change(res.context[0].id)
              }
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
      console.log('维修车间改变了',val);
      this.$emit("input", val);
      this.data.forEach((item) => {
        if (item.id == val) {
          this.$emit("on-change", item);
        }
      });
    },
    // 报修用(选择车辆后根据部门赋值)
    setAttributeNode(val) {
      let info = this.data.filter((item) => item.name.includes(val))
      console.log(info);
      
      if(info.length) {
        this.$emit("input", info[0].id)
        this.change(info[0].id)
      }
    }
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus"></style>

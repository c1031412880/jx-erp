<template>
  <el-select
    v-model="selectValue"
    :placeholder="placeholder"
    :multiple="multiple"
    :filterable="filterable"
    :clearable="clearable"
    :collapse-tags="collapseTags"
    v-loading="loading"
    @change="selectChange"
  >
    <el-option v-for="item in data" :key="item.id" :label="item.name" :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  components: {},
  props: {
    value: {},
    placeholder: {
      type: String,
      default: '请选择车型'
    },
    clearable: {
      type: Boolean,
      default: true
    },
    multiple: {
      type: Boolean,
      default: true
    },
    filterable: {
      type: Boolean,
      default: true
    },
    collapseTags: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      selectValue: null,
      data: [],
      loading: false
    }
  },
  watch: {
    value() {
      this.selectValue = this.value
    }
  },
  created() {
    this.selectValue = this.value ? this.value : null
    this.loadData()
  },
  mounted() {},
  methods: {
    loadData() {
      this.loading = true
      this.$client
        .GetCarModelVehicleManager({})
        .then(res => {
          this.loading = false
          if (res.head.result === '200') {
            this.data = res.context.list
          } else {
            this.data = []
          }
        })
        .catch(err => {
          this.loading = false
          this.data = []
          console.log(err)
        })
    },
    selectChange(val) {
      this.$emit('input', val)
      this.$emit('change', val)
    },
    reset() {
      this.selectValue = []
    }
  },
  beforeDestroy() {}
}
</script>

<style lang="scss" scoped>
.el-select {
  /deep/ .el-tag {
    max-width: 60%;
  }
}
</style>

<template>
  <el-select
    :disabled="disabled"
    clearable
    v-loading="loading"
    v-model="id"
    :placeholder="placeholder"
    filterable
    :multiple="multiple"
    :collapse-tags="collapseTags"
    @change="change"
  >
    <el-option-group :key="`i${i}`" :label="group.c_name" v-for="(group, i) in data">
      <el-option
        :value="item.i_id"
        :label="item.c_name"
        v-for="(item, j) in group.children"
        :key="`j${j}`"
      >
        <el-popover
          placement="right"
          width="200"
          trigger="hover"
          :content="item.c_name"
          :disabled="item.c_name.length <= 15"
        >
          <div slot="reference" class="text">{{ item.c_name }}</div>
        </el-popover>
      </el-option>
    </el-option-group>
  </el-select>
</template>

<script>
export default {
  props: {
    value: {},
    placeholder: {
      type: String,
      default: '请选择处罚依据'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    multiple: {
      type: Boolean,
      default: false
    },
    collapseTags: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    value(newVal) {
      this.id = newVal
    }
  },
  data() {
    return {
      id: '',
      data: [],
      loading: false
    }
  },
  created() {
    this.loadData()
  },
  mounted() {
    if (this.value) {
      this.id = this.value
    }
  },
  methods: {
    // 初始化数据
    loadData() {
      this.loading = true
      this.$client
        .GetItemsTreeRewardPunish({ type: 1 })
        .then(res => {
          this.loading = false
          if (res.head.result === '200') {
            this.data = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: 'error'
            })
          }
        })
        .catch(err => {
          this.loading = false
          this.$message({
            showClose: true,
            message: err.body.message,
            type: 'error'
          })
        })
    },
    change(val) {
      this.$emit('input', val)
      if (this.multiple) {
        const arr = []
        this.data.forEach(group => {
          group.children.forEach(item => {
            if (val.includes(item.i_id)) {
              arr.push(item)
            }
          })
        })
        this.$emit('on-change', arr)
      } else {
        this.data.forEach(group => {
          group.children.forEach(item => {
            if (item.i_id === val) {
              this.$emit('on-change', item)
            }
          })
        })
      }
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
.text{
  max-width: 270px
  overflow: hidden
  text-overflow: ellipsis
  white-space: nowrap
}
</style>

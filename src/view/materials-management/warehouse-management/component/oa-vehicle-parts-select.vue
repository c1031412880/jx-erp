<template>
  <el-select
    :disabled="disabled"
    clearable
    v-loading="loading"
    v-model="id"
    :autofocus="true"
    :placeholder="placeholder"
    filterable
    :multiple="true"
    remote
    @change="change"
  >
    <el-option
      v-for="item in data"
      :key="item.id"
      :label="`${item.vehicle_code}(${item.flow_code})`"
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
      default: '请选择物资名称'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tableData: {
      type: Array,
    },
    vehicle_id: {
      type: Number,
      default: 0
    }
  },
  watch: {
    value(newVal) {
      this.id = newVal
    },
    vehicle_id(val) {
      this.loadData()
    }
  },
  data() {
    return {
      id: '',
      // data:[],
      loading: false,
      // tableData:[],
      data: []
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
      // 获取最近30天
      let now = new Date();
      let startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      let endDate = new Date();
      let startDateStr =
        startDate.getFullYear() +
        "-" +
        (startDate.getMonth() + 1) +
        "-" +
        startDate.getDate();
      let endDateStr =
        endDate.getFullYear() +
        "-" +
        (endDate.getMonth() + 1) +
        "-" +
        endDate.getDate();

      let context = {
        vehicle_id: this.vehicle_id,
        state: 2,
        page_index: 1,
        page_size: 999,
        start_date: startDateStr,
        end_date: endDateStr,
        time_config: 3
      }
      this.$client.GetByPage1OaVehiclePartsReceive({context: context}).then((req) => {
        if (req.head.result === "200") {
          this.data = req.context.list
        } else {
          // this.$message({ type: "error", message: "获取失败" });
        }
      });
    },
    change(val) {
      this.$emit('input', val)
      this.$emit('on-set')
      this.data.forEach(item => {
        if(item.material_id===val) {
          this.$emit('change', item)
        }
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">

</style>

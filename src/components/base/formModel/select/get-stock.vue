<template>
  <el-select
    :disabled="disabled"
    clearable
    v-loading="loading"
    v-model="id"
    :autofocus="true"
    :remote-method="remoteMethod"
    :placeholder="placeholder"
    filterable
    remote
   >
    <el-option
      v-for="item in wuziOptions"
      :key="item.wuziOptions"
      :label="item.groupgo"
      :value="item.groupgo">
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
      }
    },
    watch: {
      value(newVal) {
        this.id = newVal
      },
      i_warehourse_id(val) {
        this.loadData()
      }
    },
    data() {
      return {
        id: '',
        // data:[],
        loading: false,
        // tableData:[],
        wuziOptions: [],
        wuziOptionAllMap: {},
        wuziOptionMap: {},
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
       remoteMethod(query) {
      if (query !== "") {
        this.loading = true;
        // let Options = []
        setTimeout(() => {
          this.loading = false;
          this.wuziOptions = Object.values(this.wuziOptionAllMap).filter(
            (item) => {
              return (
                item.groupgo.toLowerCase().indexOf(query.toLowerCase()) > -1
              );
            }
          );
          // this.wuziOptions=this.wuziOptions.concat( Options)
          // this.wuziOptions= this.unique(this.wuziOptions);
        }, 200);
      } else {
        this.wuziOptions = [];
      }
    },
      // 初始化数据
      loadData() {
      this.$client.getMaterialPage({ usable: 1 }).then((req) => {
        if (req.head.result === "200") {
          let ids = [];
          this.wuziOptionMap = {};
          this.wuziOptionAllMap = {};
          this.tableData.forEach((obj) => {
            ids.push(obj.material_id);
          });
          let length = req.context.list.length;
          let allList = req.context.list;
          for (var i = 0; i < length; i++) {
            let item = allList[i];
            if (item.specification == null) {
              item.groupgo = item.name + "(" + item.code + ")";
            } else {
              item.groupgo =
                item.name + item.specification + "(" + item.code + ")";
            }
            this.wuziOptionAllMap[item.id] = item;
            if (i < 99) {
              this.wuziOptionMap[item.id] = item;
            }
          }
          ids.forEach((key) => {
            this.wuziOptionMap[key] = this.wuziOptionAllMap[key];
          });
          this.wuziOptions = Object.values(this.wuziOptionMap);
          console.log(this.wuziOptionAllMap, this.wuziOptionMap, ids)
        } else {
          this.$message({ type: "error", message: "获取失败" });
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

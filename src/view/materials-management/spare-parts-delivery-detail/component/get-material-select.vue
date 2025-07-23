<template>
  <el-select
    :value="value"
    @change="materialChange"
    size="mini"
    :remote-method="remoteMethod"
    filterable
    remote
    placeholder="请选择">
    <el-option
      v-for="item in MaterialList"
      :key="item.id"
      :label="item.groupgo"
      :value="item.id">
    </el-option>
  </el-select>
</template>

<script type="text/ecmascript-6">
export default {
  name: "get-material-select",
  props: {
    warehouse_id: {
      type: Number,
      default: 0
    },
    value: {},
    allList:[Array]
  },
  watch: {
    warehouse_id(val) {
      this.getMaterial(val)
    },
    allList() {
      this.bulidData()
    }
  },
  mounted() {
    this.getMaterial()
  },
  data() {
    //这里存放数据",
    return {
      MaterialList: [],
      MaterialListAll: [],
      MaterialListMap: {}
    }
  },
  //方法集合",
  methods: {
    materialChange(id) {
      this.$emit('input', id)
      this.$emit('change', this.MaterialListMap[id])
    },
    // 物料编码筛选
    remoteMethod(query) {
      if (query) {
        this.MaterialList = this.MaterialListAll.filter(
          (item) => {
            return (
              item.groupgo.toLowerCase().indexOf(query.toLowerCase()) > -1 && this.MaterialList.length < 31
            );
          }
        );
      } else {
        this.MaterialList = []
        let length = this.MaterialListAll.length
        for(let i = 0;i < length; i++) {
          if (i < 30) {
            this.MaterialList.push(this.MaterialListAll[i])
          } else {
            break
          }
        }
      }
    },
    //获取物资
    getMaterial(warehouse_id = 0) {
      let form = {
        usable: 1
      }
      if (warehouse_id) {
        form.warehouse_id = warehouse_id
      }
      this.$client.getMaterialPage(form).then((req) => {
        if (req.head.result === "200") {
          this.MaterialList = [];
          this.MaterialListAll = [];
          this.MaterialListMap = {}
          let length = req.context.list.length;
          let allList = req.context.list;
          for (let i = 0; i < length; i++) {
            let item = allList[i];
            if (item.specification == null) {
              item.groupgo = item.name + "(" + item.code + ")";
            } else {
              item.groupgo = item.name + item.specification + "(" + item.code + ")";
            }
            this.MaterialListAll.push(item)
            this.MaterialListMap[item.id] = item
            if (i < 30) {
              this.MaterialList.push(item)
            }
          }
        }
      });
    },
    bulidData() {
      this.MaterialList = [];
      this.MaterialListAll = [];
      this.MaterialListMap = {}
      let length = this.allList.length;
      for (let i = 0; i < length; i++) {
        let item = this.allList[i];
        if (item.specification == null) {
          item.groupgo = item.name + "(" + item.code + ")";
        } else {
          item.groupgo = item.name + item.specification + "(" + item.code + ")";
        }
        this.MaterialListAll.push(item)
        this.MaterialListMap[item.id] = item
        if (i < 30) {
          this.MaterialList.push(item)
        }
      }
    }
  },
}
</script>

<style lang="scss" scoped>

</style>

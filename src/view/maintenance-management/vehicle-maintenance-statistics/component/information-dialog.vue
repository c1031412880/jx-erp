<template>
  <el-dialog
    :visible="dialogBool"
    title="派工详情"
    :before-close="dialogClose"
    width="60%"
    
    append-to-body>
    <div class="el-dialog-div">
      <tr-table
        :selectionShow="false"
        :data="data"
        :tableHeaderList="customSettingList"
        :isShowBottomOptions="false"
        :TableHeight="TableHeight"
        :loading="loading">
      </tr-table>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: { },
  props: {
    dialogBool: Boolean,
    data: {
      type: Array,
      default: () => []
    }
  },
  mounted() {
  },
  data() {
    return {
      loading: false,
      TableHeight: 400,
      customSettingList: [
          {
            id: 1,
            label: "维修项目",
            prop: "item_name",
            width: "160",
            align: "center",
            signIndex: 0,
            sortable: true,
          },
          {
            id: 2,
            label: "维修分类",
            prop: "group_name",
            width: "120",
            align: "center",
            signIndex: 1,
            sortable: true,
          },
          {
            id: 3,
            label: "项目编号",
            prop: "code",
            width: "120",
            align: "center",
            signIndex: 2,
            sortable: true,
          },
          {
            id: 4,
            label: "标准工时",
            prop: "hours",
            width: "120",
            align: "center",
            signIndex: 3,
            sortable: true,
          },
          {
            id: 5,
            label: "标准费用",
            prop: "price",
            width: "120",
            align: "center",
            signIndex: 4,
            sortable: true,
          }, 
          {
            id: 6,
            label: "维修车间",
            prop: "maint_dept_name",
            width: "130",
            align: "center",
            signIndex: 5,
            sortable: false,
          },
          {
            id: 7,
            label: "维修班组",
            prop: "shop_name",
            width: "120",
            align: "center",
            signIndex: 6,
            sortable: false,
            
          },
          {
            id: 8,
            label: "维修人员",
            prop: "person_name",
            width: "120",
            align: "center",
            signIndex: 7,
            sortable: false,
            
          },
            {
            id: 9,
            label: "数量",
            prop: "count",
            width: "160",
            align: "center",
            signIndex: 8,
            sortable: false,
            
          },
          {
            id: 10,
            label: "实际工时",
            prop: "actual_hours",
            width: "160",
            align: "center",
            signIndex: 9,
            sortable: false,
            
          },
          {
            id: 11,
            label: "实际费用",
            prop: "actual_fee",
            width: "160",
            align: "center",
            signIndex: 10,
            sortable: false,
            
          },
        ]
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    
  },
}
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>


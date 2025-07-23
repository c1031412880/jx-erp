<template>
  <el-dialog
    
    title="关联审批单" 
    :visible="dialogBool" 
    :before-close="dialogClose"
    append-to-body>
    <el-tabs v-model="activeName">
      <el-tab-pane v-for="item in page" :key="item.name" :label="item.label" :name="item.name">
        <el-form :model="form" :inline="true">
          <el-form-item>
            <el-input v-model="form.text" placeholder="发起人/编号/标题/申请内容"></el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="form.type" placeholder="请选择">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <tr-table
          :indexShow="false"
          :TableHeight="500"
          :selectionShow="false"
          :isShowBottomOptions="false"
          :isFixedEmptyPlaceholder="false"
          :data="data"
          :tableHeaderList="tableHeaderData">

        </tr-table>
      </el-tab-pane>
    </el-tabs>
    <div slot="footer" class="dialog-footer">
      <el-button size="small" @click="dialogClose">取 消</el-button>
      <el-button type="primary" size="small">确 定</el-button>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      activeName: 'first', 
      data: [], 
      form: {
        text: '',
        type: 1,
      },
      page: [
        {label: '我处理的', name: 'first'},
        {label: '我发起的', name: 'second'},
        {label: '抄送我的', name: 'third'},
      ],
      options: [
        {label: '全部', value: 1},
        {label: '审批中', value: 2},
        {label: '审批通过', value: 3},
        {label: '审批拒绝', value: 4},
        {label: '已撤销', value: 5},
      ],
      tableHeaderData: [
        {
          id: 1,
          label: "申请事由",
          prop: "c_accident_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable:false
        },
        {
          id: 2,
          label: "申请日期",
          prop: "vehicle_number",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable:false
        },
        {
          id: 3,
          label: "申请内容",
          prop: "lincense_plate_number",
          width: "120",
          align: "center",
          signIndex: 2,
          sortable:false
        },
        {
          id: 4,
          label: "抄送部门",
          prop: "department_name",
          width: "160",
          align: "center",
          signIndex: 3,
          sortable:false
        },
        {
          id: 5,
          label: "申请人",
          prop: "line",
          width: "120",
          align: "center",
          signIndex: 4,
          sortable:false
        },
        {
          id: 6,
          label: "申请部门",
          prop: "d_accident_date",
          width: "145",
          align: "center",
          signIndex: 5,
          sortable:false
        },
        {
          id: 7,
          label: "审批编号",
          prop: "driver_name",
          width: "120",
          align: "center",
          signIndex: 6,
          sortable:false
        },
        {
          id: 8,
          label: "标题",
          prop: "accident_reason",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable:false
        },
        {
          id: 9,
          label: "流程状态",
          prop: "c_accident_address",
          width: "100",
          align: "center",
          signIndex: 8,
          sortable:false
        },
        {
          id: 10,
          label: "发起时间",
          prop: "accident_address_type",
          width: "150",
          align: "center",
          signIndex: 9,
          sortable:false
        },
        {
          id: 11,
          label: "完成时间",
          prop: "accident_type",
          width: "100",
          align: "center",
          signIndex: 10,
          sortable:false
        },
        {
          id: 12,
          label: "操作",
          prop: "operation",
          width: "135",
          align: "center",
          signIndex: 11,
          sortable:false
        }
      ],
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
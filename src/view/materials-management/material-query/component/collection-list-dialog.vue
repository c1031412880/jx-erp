<template>
  <el-dialog
    :visible="dialogBool"
    title="领料单"
    :before-close="dialogClose"
    append-to-body
    width="1050px">
    <div class="collection-list-dialog-content">
      <el-form inline :model="form" size="mini">
        <el-row :gutter="24">
          <el-col :span="8">
            <el-form-item label="领料单号:">
              <el-input v-model="form.code" disabled></el-input>
              <!-- <span>{{ form.code }}</span> -->
            </el-form-item>
            <el-form-item label="关联工单:">
              <el-input v-model="form.work_code" disabled></el-input>
              <!-- <span>{{ form.work_code }}</span> -->
            </el-form-item>
            <el-form-item label="领料人:">
              <el-input v-model="form.pick_user_name" disabled></el-input>
              <!-- <span>{{ form.pick_user_name }}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料日期:">
              <el-input v-model="form.pick_date" disabled></el-input>
              <!-- <span>{{ form.pick_date }}</span> -->
            </el-form-item>
            <el-form-item label="车辆:">
              <el-input v-model="form.lp_num" disabled></el-input>
              <!-- <span>{{ form.lp_num }}</span> -->
            </el-form-item>
            <el-form-item label="备注:">
              <el-input type="textarea" v-model="form.remark" disabled></el-input>
              <!-- <span>{{ form.remark }}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="领料仓库:">
              <el-input v-model="form.warenhouse_name" disabled></el-input>
              <!-- <span>{{ form.warenhouse_name }}</span> -->
            </el-form-item>
            <el-form-item label="自编号:">
              <el-input v-model="form.lp_self_number" disabled></el-input>
              <!-- <span>{{ form.warenhouse_name }}</span> -->
            </el-form-item>
            <el-form-item label="关联出库单:">
              <span>{{ outCode }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="table">
        <tr-table
          :tableHeaderList="tableHead"
          :isShowSummary="true"
          :data="tableData"
          :sumTotal="sumTotal"
          :sumColumnIndex="[5]"
        ></tr-table>
      </div>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    dialogBool: Boolean,
    tableData: {
      tyep: Array,
      default: []
    }
  },
  data () {
    return {
      form: {
        code: '',
        work_code: '',
        remark: '',
        pick_date: '',
        lp_num: '',
        out_code: '',
        warenhouse_name: '',
        pick_user_name: ''
      },
      tableHead: [{
        id: 1,
        label: "物料编码",
        prop: "material_code",
        align: "center",
        signIndex:0
      }, {
        id: 2,
        label: "物料名称",
        prop: "material_name",
        align: "center",
        signIndex:1
      }, {
        id: 3,
        label: "规格型号",
        prop: "specification",
        align: "center",
        signIndex:2
      }, {
        id: 4,
        label: "单位",
        prop: "measure_unit_name",
        align: "center",
        signIndex: 3
      }, {
        id: 5,
        label: "领料类型",
        prop: "pick_type_name",
        align: "center",
        signIndex: 4
      }, {
        id: 5,
        label: "领取数量",
        prop: "count",
        align: "center",
        signIndex: 4
      }]
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false)
    },
  },
  computed: {
    outCode () {
      return !!this.form.out_code ? this.form.out_code + '(' + this.form.lp_num + ')' : '未关联'
    },
    sumTotal () {
      let sumArr = this.tableData.map(item => item.count)
      return {
        5: sumArr.reduce((a, b) => a + b, 0)
      }
    }
  }
}
</script>
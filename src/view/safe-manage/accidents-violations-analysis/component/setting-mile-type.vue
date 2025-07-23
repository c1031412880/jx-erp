<template>
  <el-dialog
    :visible="dialogBool"
    title="设置月公里数"
    :before-close="dialogClose"
    width="780px"
  >
    <div class="el-dialog-div" ref="maintenanceProjectManage">
      <el-form :inline="true" size="mini">
        <el-form-item label="月份">
          <el-date-picker
            v-model="form.month"
            type="month"
            :clearable="false"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button size="mini" type="primary" @click="loadData">查询</el-button>
        </el-form-item>
        <!-- <el-form-item>
          <el-button size="mini" type="primary" @click="add">添加</el-button>
        </el-form-item> -->
      </el-form>
      <tr-table
        ref="trTable"
        :data="data"
        :tableHeaderList="canRendererTableHeader"
        :loading="loading"
        :TableHeight="500"
      >
        <template slot-scope="scope" slot="dept_id">
          <!-- <get-department-select
            ref="personalTree"
            v-model="scope.data.dept_id"
            :isShowCheckbox="false"
            :placeholder="'请选择责任部门'"
            :isContainEmp="false"
            :show_all="true"
            :isExportMultiple="false"
          ></get-department-select> -->
          <el-select v-model="scope.data.dept_id" placeholder="请选择" disabled>
            <el-option
              v-for="item in branchOffice"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </template>
        <template slot-scope="scope" slot="month">
          <!-- <el-date-picker
            v-model="scope.data.month"
            type="month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            placeholder="选择月">
          </el-date-picker> -->
          <div>{{scope.data.month.slice(0, 7)}}</div>
        </template>
        <template slot-scope="scope" slot="total_mile">
          <el-input
            placeholder="请输入"
            v-model="scope.data.total_mile"
            oninput="value=value.replace(/[^\d.-]/g,'')"
            @blur="scope.data.total_mile = $event.target.value"
            size="mini"
            clearable
          ></el-input>
        </template>
        <template slot-scope="scope" slot="operation">
          <el-button size="mini" type="danger" @click="del(scope.index)">删除</el-button>
        </template>
      </tr-table>
    </div>
    <span class="show-flex-box-r show-flex-center" style="margin-top: 10px;">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" @click="updatePlaybill()"
        >保 存</el-button
      >
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelect
  },
  props: {
    dialogBool: Boolean,
    month: {
      type: String,
      default: '',
    }
  },
  data() {
    return {
      data: [], //项目列表
      loading: false,
      form: {
        month: '',
      },
      branchOffice: [],
      canRendererTableHeader: [
        {
          id: 1,
          label: "分公司",
          prop: "dept_id",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false
        },
        {
          id: 2,
          label: "月份",
          prop: "month",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false
        },
        {
          id: 3,
          label: "总里程",
          prop: "total_mile",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false
        },
        // {
        //   id: 4,
        //   label: "操作",
        //   prop: "operation",
        //   width: "80",
        //   align: "center",
        //   signIndex: 3,
        //   sortable: false,
        // },
      ],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.GetDeptInfoCaches()
        this.form.month = this.month.slice(0,7)
        this.loadData()
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    GetDeptInfoCaches() {
      this.$client.GetDeptInfoCaches({}).then(res => {
        if (res.head.result === '200') {
          this.branchOffice = res.context 
        }
      })
    },
    loadData() {
      let params = {
        month: this.form.month
      }
      this.loading = true
      this.$client.GetDeptMonthMiles(params)
        .then(res => {
          this.loading = false
          if (res.head.result == "200") {
            this.data = res.context
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
          this.loading = false
        })
    },
    // 保存 
    updatePlaybill() {
      this.$client.AddOrUpdateMile({context:this.data})
      .then(res => {
        if (res.head.result == "200") {
          this.$message({
            showClose: true,
            message: '保存成功',
            type: "success"
          });
          this.dialogClose()
          this.$parent.loadData()
          this.$parent.onRadio()
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error"
          });
        }
      })
    },
    // 添加 
    add() {
      this.data.push({
        dept_id: '',
        month: this.form.month,
        total_mile: 0,
      })
    },
    del(index) {
      this.data.splice(index,1)
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  width: 100%;
  height: 100%;
}

</style>


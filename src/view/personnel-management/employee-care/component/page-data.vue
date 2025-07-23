<template>
  <div class="page-data">
    <el-form ref="head" :inline="true" size="mini">
      <el-form-item prop="contain_dimission">
        <span>
          {{ month }} 月{{ thing }}的员工(共 {{ num }} 人)
        </span>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="form.year_month"
          type="month"
          format="yyyy-MM"
          value-format="yyyy-MM"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <get-department-select-tree
          ref="deptTree"
          v-model="form.depts_id"
          :isShowCheckbox="true"
          :placeholder="'请选择部门'"
          :isContainEmp="false"
          :isExportMultiple="true"
          :isCheckStrictly="false"
        ></get-department-select-tree>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button @click="resetForm" type="primary" icon="el-icon-refresh-right">重置</el-button>
      </el-form-item>
      <!-- <el-form-item>
        <el-button type="primary" icon="el-icon-download" v-if="$isPowerShow('export')" @click="onExport()" >导出</el-button>
      </el-form-item> -->
    </el-form>
    <tr-table
      :data="data"
      :loading="loading"
      :selectionShow="false"
      :TableHeight="TableHeight"
      :isShowBottomOptions="false"
      :frontFixedNum="frontFixedNum"
      :tableHeaderList="canRendererTableHeader"
      :backFixedNum="backFixedNum">
      <!-- <template slot-scope="scope" slot="operation">
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'edit')" v-if="$isPowerShow('edit')">编辑</el-button>
          <el-button type="primary" size="mini" @click="editRowInfo(scope.data,'detail')">详情</el-button>
          <el-popconfirm
            @confirm="deleteRowInfo(scope.data)"
            title="确定删除此条记录吗？"
            v-if="$isPowerShow('del')">
            <el-button slot="reference" type="danger" size="mini">删除</el-button>
          </el-popconfirm>
      </template> -->
    </tr-table>
  </div>
</template>

<script>
import getDepartmentSelectTree from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getDepartmentSelectTree,
  },
  props: {
    activeName: {
      type: String,
      default() {
        return 'first'
      }
    },
    thing: {
      type: String,
      default() {
        return '过生日'
      }
    },
  },
  data() {
    return {
      month: 0,
      num: 0,
      form: { 
        year_month: '', 
        depts_id: [], 
      },
      data: [],
      loading: false,
      TableHeight: 500,
      frontFixedNum: 1, //前几行固定
      backFixedNum: 1, //后几行固定
      canRendererTableHeader: null,
      customSettingListOne: [
        {
          id: 1,
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "所在单位（部门）",
          prop: "dept_name",
          width: "150",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "现任岗位",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "状态",
          prop: "employee_status",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "生日时间",
          prop: "birthday_date",
          width: "160",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "系统祝福",
          prop: "birthday_remind_enable",
          width: "160",
          align: "center",
          signIndex: 5,
          sortable: false,
        }
      ],
      customSettingListTwo: [
        {
          id: 1,
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "性别",
          prop: "sex",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所在单位（部门）",
          prop: "dept_name",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "现任岗位",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "状态",
          prop: "employee_status",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "年龄",
          prop: "age",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "预计退休时间",
          prop: "retire_date",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "入职时间",
          prop: "join_date",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
      customSettingListThree: [
        {
          id: 1,
          label: "姓名",
          prop: "user_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "性别",
          prop: "sex",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "所在单位（部门）",
          prop: "dept_name",
          width: "150",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "现任岗位",
          prop: "position_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "状态",
          prop: "employee_status",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "合同类型",
          prop: "school",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "合同开始时间",
          prop: "contract_start_date",
          width: "160",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "合同结束时间",
          prop: "contract_retire_date",
          width: "160",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
      ],
    };
  },
  mounted() {
    this.setDateTime()
    this.$nextTick(() => {
      this.setHead('initialize');
      this.loadData()
      window.eventOn.$on('view-resize' + this.$route.fullPath, () => {
        this.setHead()
      })
    });
  },
  methods: {
    setDateTime() {
      let year = new Date().getFullYear()
      let month = new Date().getMonth() + 1 > 9 ? new Date().getMonth() + 1 : '0' + (new Date().getMonth() + 1)
      this.month = month * 1
      this.form.year_month = year + '-' + month
    },
    onSubmit() {
      this.month = this.form.year_month ? this.form.year_month.slice(5, 7) : 0
      this.num = 0
      this.loadData()
    },
    loadData() {
      let params = {
        context: {}
      }
      this.loading = true;
      params.context = Object.assign({}, this.form)
      params.context.menu_code = 3200000
      params.context.query_type = this.activeName === 'first' ? 1 : this.activeName === 'second' ? 2 : 3
      this.$client.GetByPageErpUserCare(params)
        .then(res => {
          if (res.head.result == "200") {
            this.loading = false;
            this.data = res.context
            this.num = res.context.length
          } else {
            this.loading = false;
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        }).catch(err => {
           this.$message({
            showClose: true,
            message: err.body.message,
            type: "error",
          });
        })
    },
    resetForm() {
      Object.assign(this.$data.form, this.$options.data().form)
      this.setDateTime()
      this.onSubmit()
    },
    onExport() {
      this.$message({type: 'error', message: '功能开发中，敬请期待。'})
      return
      let params = {
        context: {}
      }
      params.context = Object.assign({}, this.form)
      params.query_type = this.activeName === 'first' ? 1 : this.activeName === 'second' ? 2 : 3
      this.$client.ExportErpUserCare(params)
      .then(res => {
        if(res.head.result == '200') {
          window.location.href = res.context
          this.$message({type: 'success', message: '导出成功'})
        }else{
          this.$message({type: 'error', message: '导出失败'})
        }
      })
    },
    // 计算表格高度 和初始化表头
    setHead(type) {
      if(type == 'initialize') {
        switch (this.activeName) {
          case 'first':
          this.canRendererTableHeader = this.customSettingListOne
            break;
          case 'second':
          this.canRendererTableHeader = this.customSettingListTwo
            break;
          case 'third':
          this.canRendererTableHeader = this.customSettingListThree
            break;
          default:
            break;
        }
      }
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        let th = this.$refs.head.$el.offsetHeight;
        // let ph = this.$refs.paginationH.$el.offsetHeight;
        this.TableHeight = maxh - th ;
      }, 60);
    },
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
.page-data {
  height: 100%;
  width: 100%;
}
</style>
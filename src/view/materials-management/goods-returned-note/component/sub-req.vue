<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="退货日期:">
          <el-date-picker
            size="mini"
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="退货单号:">
          <el-input
            clearable
            v-model="form.return_order"
            placeholder="请输入入库单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select placeholder="全部" v-model="form.status" clearable>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格型号:">
          <el-input
            clearable
            v-model="form.specification"
            placeholder="请输入规格型号"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商:">
          <el-select placeholder="请选择供应商" v-model="form.supplier_id" clearable>
            <el-option
              v-for="item in gongysOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物料编号:">
          <el-input
            clearable
            v-model="form.material_code"
            placeholder="请输入物料编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="物料名称:">
          <el-input
            clearable
            v-model="form.material_name"
            placeholder="请输入物料名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="" icon="el-icon-refresh-right"
            >重置</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('add')" v-if="$isPowerShow('add')" type="primary">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm @confirm="onBtn('del')" v-if="$isPowerShow('del')" title="确定删除此条记录吗？">
            <el-button slot="reference" type="primary" size="mini">删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('check', '2')" v-if="$isPowerShow('audit')" type="primary">审核</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('recheck', '1')" v-if="$isPowerShow('auditee')" type="primary">反审核</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('import')" v-if="$isPowerShow('import')" type="primary">导入</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" v-if="$isPowerShow('export')" type="primary">导出</el-button>
        </el-form-item>
        <!-- <el-form-item style="float:right">
          <el-button type="text" @click="AdvancedSet">高级筛选</el-button>
        </el-form-item> -->
        <!-- <el-dropdown>
          <el-button size="mini" class="btn">
            更多操作
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item class="text">打印入库单</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown> -->
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { getDate } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
export default {
  components: {
    getVehicleSelectTree,
  },
  data() {
    return {
      wuziOptions: [],
      date: [],
      form: {
        return_date_start: "",
        return_date_end: "",
        return_order: "",
        status: "",
        specification: "",
        supplier_id: "",
        material_code: "",
        material_name: "",
      },
      stateOptions: [
        { value: "2", label: "已审核" },
        { value: "1", label: "未审核" },
      ],
      gongysOptions: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getGinsang()
      this.onSetTime()
      this.onSubmit()
    })
  },
  methods: {
    changeDate(date){
      if(date==null||date==[]){
        this.form.return_date_start = ''
        this.form.return_date_end = ''
        }else{
        this.form.return_date_start = date[0]
        this.form.return_date_end = `${date[1]} 23:59:59`
      }
    },
    onSetTime(type = 'lastOneWeek') {
      let timeObj = getDate('lastOneWeek')
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.return_date_start = this.date[0]
      this.form.return_date_end = this.date[1]
    },
    getGinsang() {
      this.$client.GetProviderPage().then((req) => {
        if (req.head.result === "200") {
          this.gongysOptions = req.context.list;
        } else {
        }
      });
    },
    // 查询
    onSubmit() {
      let info = {};
      for (let i in this.form) {
        if (this.form[i]) {
          info[i] = this.form[i];
        }
      }
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.onSetTime()
      Object.assign(this.$data.form, this.$options.data().form)
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 50);
    },
    // 按钮事件
    onBtn(com, type) {
      this.$emit("on-" + com, type);
    },
    // 打开高级筛选
    AdvancedSet() {
      this.$parent.openAdvancedFilterPage();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

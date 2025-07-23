<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="调拨日期:">
          <el-date-picker
            size="mini"
            style="width: 200px"
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="调出仓库:">
          <el-select v-model="form.before_house_id" clearable multiple collapse-tags placeholder="出库仓库">
            <el-option
              v-for="item in stoneOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调出仓位:">
          <el-input
            style="width: 110px"
            clearable
            v-model="form.before_position_name"
            placeholder="请输入调出仓位"
          ></el-input>
        </el-form-item>
        <el-form-item label="调入仓库:">
          <el-select v-model="form.after_house_id" clearable multiple collapse-tags placeholder="出库仓库">
            <el-option
                v-for="item in stoneOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入调仓位:">
          <el-input
              style="width: 110px"
              clearable
              v-model="form.after_position_name"
              placeholder="请输入调出仓位"
          ></el-input>
        </el-form-item>
        <el-form-item label="物料编码/名称/型号:">
          <el-input
            style="width: 110px"
            clearable
            v-model="form.material_code"
            placeholder="请输入物料编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="调拨单号:">
          <el-input
            style="width: 110px"
            clearable
            v-model="form.trans_num"
            placeholder="请输入调拨单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="审核状态:">
          <el-select placeholder="全部" v-model="form.state" clearable>
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
          >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-right"
          >重置</el-button
          >
        </el-form-item>
        <el-form-item>
<!--          <el-button @click="onAdd()" v-if="$isPowerShow('add')" type="primary">添加</el-button>-->
          <el-button @click="onAdd()" type="primary">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-popconfirm @confirm="deleteSelect()" v-if="$isPowerShow('del')" title="确定删除此条记录吗？">
            <el-button slot="reference" type="primary" size="mini"
            >删除</el-button>
          </el-popconfirm>
        </el-form-item>
        <el-form-item>
          <el-button @click="isCheck('2')" type="primary">审核</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="isCheck('3')" type="primary">反审核</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-if="$isPowerShow('export')"  @click="onBtn('export')" type="primary">导出</el-button>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button-group>
            <el-button type="text" style="margin-right: 15px" icon="el-icon-refresh" @click="refreshTableList"></el-button>
            <el-button type="text" style="margin-right: 15px" icon="el-icon-s-tools" @click="openSettingPage"></el-button>
            <el-button type="text" @click="AdvancedSet">高级筛选</el-button>
          </el-button-group>
        </el-form-item>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import {getDate} from "@/utils/index";

export default {
  data() {
    return {
      wuziOptions: [],
      date: [],
      checked: false,
      stoneOptions: [],
      form: {
        begin_time: '',
        end_time: '',
        material_code: "",
        material_name: "",
        specification: "",
        before_house_id: '',
        after_house_id: '',
        before_position_name: '',
        after_position_name: '',
        trans_num: ''
      },
      tyreModelOptions: [],
      stateOptions: [
        {value: "0", label: "全部"},
        {value: "1", label: "未审核"},
        {value: "2", label: "已审核"},
        {value: "3", label: "取消审核"},
      ],
    };
  },
  watch: {
  },
  mounted() {
    this.onSetTime()
    this.onSubmit()
    this.getWarehouse()
    document.addEventListener("keydown", event => {
      if (event.code === 'Enter') {
        this.onSubmit()
      }
    })
  },
  methods: {
    changeDate(date) {
      if (date == null || date == []) {
        this.form.begin_time = ''
        this.form.end_time = ''
      } else {
        this.form.begin_time = date[0]
        this.form.end_time = `${date[1]} 23:59:59`
      }
    },
    //获取仓库
    getWarehouse() {
      let params = {
        usable: 1 //1 启用， 2 未启用
      }
      this.$client.getRecord1Warehouse(params).then((req) => {
        if (req.head.result === "200") {
          this.stoneOptions = req.context;
        }
      });
    },
    onSetTime(type = 'lastOneWeek') {
      let timeObj = getDate('lastOneWeek')
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.begin_time = this.date[0]
      this.form.end_time = this.date[1]
    },
    getwuzi() {
      this.$client.getMaterialPage({usable: 1}).then((req) => {
        if (req.head.result === "200") {
          this.wuziOptions = req.context.list;
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
      if (info.material_code) {
        info.material_code = info.material_code.trim();
        info.material_name = info.material_code.trim();
        info.specification = info.material_code.trim();
      }
      this.$emit("on-ok", info);
    },
    refreshTableList() {
      this.resetForm()
    },
    // 重置
    resetForm() {
      this.onSetTime()
      this.form.before_house_id = "";
      this.form.after_house_id = "";
      this.form.after_house_name = "";
      this.form.before_house_name = "";
      this.form.trans_num = "";
      this.form.material_code = "";
      this.form.material_name = "";
      this.form.specification = "";
      this.form.state = "";
      this.onSubmit()
      setTimeout(() => {
        this.$message({message: "重置成功", type: "success"});
      }, 50);
    },
    // 添加编辑
    onAdd() {
      this.$emit("on-add", "add");
    },
    deleteSelect() {
      this.$emit("delete-select");
    },
    isCheck(type) {
      this.$emit("is-check", type);
    },
    onBtn(type) {
      this.$emit(`on-btn-${type}`);
    },
    // 打开高级筛选
    AdvancedSet() {
      this.$parent.openAdvancedFilterPage();
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$parent.openSettingPageEvent();
    },
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
&.btn {
  color: #999;
}

.el-dropdown-menu {
  width: 100px;
  padding: 0 5px;

  .text {
    font-size: 10px;
    text-align: center;
    padding: 0;
  }
}
</style>

<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item label="出库日期:">
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
        <el-form-item label="物料编号/名称:">
          <el-input
            style="width: 110px"
            clearable
            v-model="form.material_code"
            placeholder="请输入物料编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="出库单号:">
          <el-input
            style="width: 110px"
            clearable
            v-model="form.leave_num"
            placeholder="请输入出库单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="出库方式:">
          <el-select placeholder="全部" v-model="form.leave_type" clearable>
            <el-option
              v-for="item in Modeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :style="item.isRed ? 'color: #f56c6c; font-weight: bold;' : ''"
            >
              <span :style="item.isRed ? 'color: #f56c6c; font-weight: bold;' : ''">{{item.label}}</span>
            </el-option>
          </el-select>
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
        <el-form-item label="规格型号:">
          <el-input
            style="width: 110px"
            clearable
            v-model="form.specification"
            placeholder="请输入规格型号"
          ></el-input>
        </el-form-item>
        <el-form-item label="供应商:">
          <el-select
            v-model="form.provider_ids"
            style="width: 140px"
            filterable
            clearable
            multiple
            collapse-tags
            placeholder="请选择供应商">
            <el-option
              v-for="item in gongysOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="车辆型号:">
          <el-input style="width: 110px" v-model="form.vehicle_mode" placeholder="请输入车辆型号"></el-input>
        </el-form-item>
        <el-form-item label="按质保期过滤:">
          <el-select v-model="form.is_key_size" style="width: 120px" clearable placeholder="请选择">
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="checked" @change="form.vehicle_ids = []">外部车辆</el-checkbox>
        </el-form-item>
        <el-form-item  v-show="checked == true">
          <el-input style="width: 110px" v-model="form.lp_num" placeholder="请输入车辆"></el-input>
        </el-form-item>
        <el-form-item  v-show="checked == false">
          <get-vehicle-select-tree
            ref="vehicleTree"
            width="250"
            :placeholder="'选择车辆'"
            :isShowCheckbox="true"
            v-model="form.vehicle_ids"
            :codeAndName="true"
          >
          </get-vehicle-select-tree>
        </el-form-item>
        <el-form-item label="出库仓库:">
          <el-select v-model="form.house_ids" clearable multiple collapse-tags placeholder="出库仓库">
            <el-option
              v-for="item in stoneOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工具领用人:">
          <get-user-select
            ref="receiverSelect"
            v-model="form.receiver_ids"
            :width="200"
            :isShowCheckbox="true"
            :isExportMultiple="true"
            :placeholder="'请选择工具领用人'"
            @on-change="receiverChange"
            :func_type="3"
          ></get-user-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="" icon="el-icon-refresh-right"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onAdd()" v-if="$isPowerShow('add')" type="primary">添加</el-button>
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
import { getDate } from "@/utils/index";
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import getUserSelect from "@/components/base/formModel/tree/get-user-select";
export default {
  components: {
    getVehicleSelectTree,
    getUserSelect,
  },
  data() {
    return {
      wuziOptions: [],
      date: [],
      checked: false,
       carOptions: [
        { value: "1", label: "车牌号" },
        { value: "2", label: "自编号" },
      ],
      stoneOptions: [],
      form: {
        car_type: "1",
        leave_num: "",
        enter_type: "",
        relate_num: "",
        material_code: "",
        material_name: "",
        specification: "",
        state: "",
        leave_date_start: "",
        leave_date_end: "",
        vehicle_ids:[],
        house_ids:[],
        receiver_ids:[], // 工具领用人ID数组
        provider_ids: [],
        vehicle_mode: '',
        is_key_size: ''
      },
      tyreModelOptions: [],
      Modeoptions: [
        { value: "", label: "全部" },
        { value: "YBCK", label: "一般出库" },
        { value: "WXCK", label: "维修出库" },
        { value: "DBCK", label: "调拨出库" },
        { value: "PKCK", label: "盘亏出库" },
        { value: "HCCK", label: "红冲出库" },
        { value: "CKTL", label: "出库退料", isRed: true },
      ],
      stateOptions: [
        { value: "0", label: "全部" },
        { value: "1", label: "未审核" },
        { value: "2", label: "已审核" },
        { value: "3", label: "取消审核" },
      ],
      gongysOptions: []
    };
  },
  mounted() {
    this.getGinsang()
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
    changeDate(date){
      if(date==null||date==[]){
        this.form.leave_date_start = ''
        this.form.leave_date_end = ''
        }else{
        this.form.leave_date_start = date[0]
        this.form.leave_date_end = `${date[1]} 23:59:59`
      }
    },
    //获取仓库
    getWarehouse() {
      let params ={
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
      this.form.leave_date_start = this.date[0]
      this.form.leave_date_end = this.date[1]
      console.log(this.date)
    },
    getwuzi() {
      this.$client.getMaterialPage({usable:1}).then((req) => {
        if (req.head.result === "200") {
          this.wuziOptions = req.context.list;
        } else {
        }
      });
    },
    getGinsang() {
      this.$client.GetProviderSymple().then((req) => {
        this.gongysOptions = req;
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
        info.mnemonic_code = info.material_code.trim();
      }
      this.$emit("on-ok", info);
    },
    refreshTableList() {
      this.resetForm()
    },
    // 重置
    resetForm() {
      Object.assign(this.form, this.$options.data().form)
      console.log('重置后的',this.form)
      this.onSetTime()
      
      // 手动清空工具领用人选择组件
      this.$nextTick(() => {
        if (this.$refs.receiverSelect) {
          this.$refs.receiverSelect.onClear()
        }
      })
      
      this.onSubmit()
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
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
    /**
     * 处理工具领用人选择变更
     * @param {Array} ids - 选中的人员ID数组
     * @param {Array} nodes - 选中的人员节点数组
     */
    receiverChange(ids, nodes) {
      console.log('选中的工具领用人IDs:', ids);
      console.log('选中的工具领用人信息:', nodes);
      // 可以在这里添加额外的业务逻辑
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

// 红色选项样式 - 使用更强的选择器
/deep/ .el-select-dropdown.el-popper .el-select-dropdown__item.red-option {
  color: #f56c6c !important;
  font-weight: bold !important;
}

/deep/ .el-select-dropdown.el-popper .el-select-dropdown__item.red-option:hover {
  color: #f56c6c !important;
  background-color: #fef0f0 !important;
  font-weight: bold !important;
}

/deep/ .el-select-dropdown.el-popper .el-select-dropdown__item.red-option.selected {
  color: #f56c6c !important;
  background-color: #fef0f0 !important;
  font-weight: bold !important;
}

/deep/ .el-select-dropdown.el-popper .el-select-dropdown__item.red-option.is-disabled {
  color: #f56c6c !important;
  opacity: 0.6 !important;
}

// 备用样式 - 使用更通用的选择器
/deep/ .el-popper[x-placement] .el-select-dropdown__item.red-option {
  color: #f56c6c !important;
  font-weight: bold !important;
}

/deep/ .el-popper[x-placement] .el-select-dropdown__item.red-option:hover {
  color: #f56c6c !important;
  background-color: #fef0f0 !important;
}
</style>

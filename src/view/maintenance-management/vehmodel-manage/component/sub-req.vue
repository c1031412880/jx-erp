<template>
  <div>
    <el-form :inline="true" size="mini">
      <el-row>
        <el-form-item>
          <el-select v-model="form.name" clearable filterable placeholder="车辆型号">
            <el-option
              v-for="item in carNameOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="form.factory" clearable placeholder="生产厂家">
            <el-option
              v-for="item in carFactoryOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <!-- <el-select v-model="form.kind" clearable placeholder="车辆类型">
            <el-option
              v-for="item in carTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
          <get-select-dictionaries v-model="form.kind" :classKey="'车型信息管理车辆类型'" :placeholder="'车辆类型'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item>
          <get-select-dictionaries v-model="form.fuel" :classKey="'燃料类别'" :placeholder="'请选择燃料类型'"></get-select-dictionaries>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" @click="onSubmit"
            >查询</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" icon="el-icon-refresh-left"
            >重置</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="onBtn('AdvancedSet')">高级筛选</el-button>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button type="primary" @click="onBtn('add')" icon="el-icon-plus" v-if="$isPowerShow('add')"
            >添加车型</el-button
          >
        </el-form-item>
        <!-- <el-form-item>
          <el-button @click="onBtn('edit')" icon="el-icon-edit"
            >修改车型</el-button
          >
        </el-form-item> -->
        <el-form-item> 
          <el-button @click="onBtn('import')" icon="el-icon-download" v-if="$isPowerShow('import')"
            >导入</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-button @click="onBtn('export')" icon="el-icon-upload2" v-if="$isPowerShow('export')"
            >导出</el-button
          >
        </el-form-item>

        <div style="float: right; height: 47px; display: flex">
          <i
            class="el-icon-refresh"
            style="margin-right: 15px; cursor: pointer"
            @click="refreshTableList()"
          ></i>
          <i
            class="el-icon-s-tools"
            style="cursor: pointer"
            @click="openSettingPage()"
          ></i>
        </div>
      </el-row>
    </el-form>
  </div>
</template>

<script type="text/ecmascript-6">
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
export default {
  components: { getSelectDictionaries },
  data() {
    return {
      carTypeOptions: [
        {
          value: "大客车",
          label: "大客车",
        },
        {
          value: "混动大客",
          label: "混动大客",
        },
        {
          value: "双层大客",
          label: "双层大客",
        },
        {
          value: "中客",
          label: "中客",
        },
        {
          value: "小客",
          label: "小客",
        },
      ],
      fuelTypeOptions: [
        {
          value: "柴油",
          label: "柴油",
        },
        {
          value: "LNG",
          label: "LNG",
        },
        {
          value: "插电式混合动力",
          label: "插电式混合动力",
        },
        {
          value: "纯电/快充",
          label: "纯电/快充",
        },
        {
          value: "纯电/慢充",
          label: "纯电/慢充",
        },
      ],
      carNameOptions:[],
      carFactoryOptions:[],
      form: {
        name: "",
        factory: "",
        kind: "",
        fuel: "",
      },
    };
  },
  mounted() {
    // 获取车辆型号信息
    this.reqCmDataInfo('1');
    // 获取生产厂家
    this.reqCmDataInfo('2');
  },
  methods: {
    reqCmDataInfo(type) {
      let context = {
        type: type
      };
      this.$client.GetCMDataVehicleManager(context)
      .then(res =>  {
        if(res.head.result == '200') {
          let dataList = res.context;
          if(type == '1') {
            this.carNameOptions = this.bulidOptions(dataList)
          }else if(type == '2') {
            this.carFactoryOptions = this.bulidOptions(dataList)
          }
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    bulidOptions(list) {
      let bulidList = [];
      list.forEach(item => {
        let obj = {
          value: item,
          label: item
        }
        bulidList.push(obj)
      });

      return bulidList
    },
    // 查询
    onSubmit() {
      let info = this.$outFormData(this.form)
      this.$emit("on-ok", info);
    },
    // 重置
    resetForm() {
      this.form.name = "";
      this.form.factory = "";
      this.form.kind = "";
      this.form.fuel = "";
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "重置成功", type: "success" });
      }, 300);
    },
    // 添加编辑
    onBtn(com) {
      this.$emit("on-add", com);
    },
    // 打开自定义表头设置
    openSettingPage() {
      this.$emit("open-settingpage-event");
    },
    // 刷新列表
    refreshTableList() {
      this.form.name = "";
      this.form.factory = "";
      this.form.kind = "";
      this.form.fuel = "";
      this.onSubmit();
      setTimeout(() => {
        this.$message({ message: "刷新成功", type: "success" });
      }, 300);
    },
    // 
  },
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>

</style>

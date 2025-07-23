<template>
  <tr-dialog
    :visible="dialogBool"
    title="批量检验"
    @before-close="dialogClose"
    width="880px"
    @change-full="fullSwitch"
  >
    <div class="el-dialog-div">
      <el-form :inline="true" size="mini">
        <el-row :gutter="20">
          <el-form-item label="自编号(车牌号):" prop="vehicle_id">
            <get-vehicle-select-tree
              ref="vehicleTree"
              :placeholder="'选择车辆'"
              :isShowCheckbox="true"
              :oilType="1"
              v-model="form.vehicle_ids"
              :isExportMultiple="true"
            ></get-vehicle-select-tree>
          </el-form-item>
          <el-form-item label="制造编号:" prop="manufacturing_number">
            <el-input v-model="form.manufacturing_number" clearable placeholder="请输入"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" @click="onSubmit">查询</el-button>
          </el-form-item>
          <!-- <el-form-item>
            <el-button @click="resetForm()" icon="el-icon-refresh-right">重置</el-button>
          </el-form-item> -->
          <el-form-item>
            <el-button type="primary" @click="onExport()">下载模板</el-button>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onImport()">导入</el-button>
          </el-form-item>
        </el-row>
      </el-form>
      <tr-table
        :data="data"
        :TableHeight="TableHeight"
        :tableHeaderList="customSettingList"
      >
      <template slot-scope="scope" slot="check_date">
        <el-date-picker
          v-model="scope.data.check_date"
          type="date"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          placeholder="年-月-日"
          @change="changeDate($event,scope.data)"
        >
        </el-date-picker>
      </template>
      <template slot-scope="scope" slot="check_code">
        <el-input v-model="scope.data.check_code" clearable @change="changeCode($event,scope.data)"></el-input>
      </template>
      </tr-table>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">保 存</el-button>
    </span>

    <file-dialog
      :dialogBool.sync="filedialogVisible"
      :fileData="FileData"
      :isShowDownload="false"
      :isShowImportState="false"
      typeMessage ="气瓶检验"
      @on-submit-excel ="importExcel"
    ></file-dialog>
  </tr-dialog>
</template>

<script type="text/ecmascript-6">
import getVehicleSelectTree from "@/components/base/formModel/tree/get-vehicle-select-tree";
import fileDialog from '@/components/fileDialog/file-dialog'
import { deepCopy } from '@/utils/index'
export default {
  components: {
    getVehicleSelectTree,
    fileDialog
  },
  props: {
    dialogBool: Boolean,
  },
  data() {
    return {
      form: {
        vehicle_ids: "",
        manufacturing_number: "",
      },
      old_data: [],
      data: [],
      TableHeight: 300,
      filedialogVisible: false,
      FileData: {
        url: window.newHttpConfig.URL_EASYMOCK +  "/Files/TempFiles/人员记录模板.xlsx",
      },
      customSettingList: [
        {
          id: 1,
          label: "自编号",
          prop: "vehicle_number",
          width: "100",
          align: "center",
          signIndex: 0,
        },
        {
          id: 2,
          label: "车牌号",
          prop: "vehicle_code",
          width: "100",
          align: "center",
          signIndex: 1,
        },
        {
          id: 3,
          label: "组织",
          prop: "vehicle_dept",
          width: "100",
          align: "center",
          signIndex: 2,
        },
        {
          id: 4,
          label: "制造单位",
          prop: "manufacturer_name",
          width: "150",
          align: "center",
          signIndex: 3,
        },
        {
          id: 5,
          label: "制造编号",
          prop: "manufacturing_number",
          width: "150",
          align: "center",
          signIndex: 4,
        },
        {
          id: 6,
          label: "* 本次检查日期",
          prop: "check_date",
          width: "150",
          align: "center",
          signIndex: 5,
        },
        {
          id: 7,
          label: "* 检验报告编号",
          prop: "check_code",
          width: "150",
          align: "center",
          signIndex: 6,
        },
      ],
      ids: [],
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      } else {
      }
    },
  },
  methods: {
    setData(list) {
      this.old_data = deepCopy(list).filter(item => {
        return !item.discontinued_record
      })
      this.ids = []
      this.old_data.forEach(item => {
        this.ids.push(item.id)
      })
      this.data = deepCopy(this.old_data)

      console.log('=====',JSON.parse(JSON.stringify(this.old_data)));
    },
    fullSwitch(bool) {
      if (bool) {
        this.setHead()
      } else {
        this.TableHeight = 300
      }
    },
    // 查询  
    onSubmit() {
      let data = deepCopy(this.old_data)
      if (this.form.vehicle_ids.length > 0) {
        data = data.filter(item => {
          return this.form.vehicle_ids.includes(item.vehicle_id)
        })
      }

      if (this.form.manufacturing_number) {
        data = data.filter(item => {
          return item.manufacturing_number.includes(this.form.manufacturing_number)
        })
      }

      this.data = data
    },
    changeDate(e,row) {
      this.old_data.forEach(item => {
        if (item.id == row.id) {
          item.check_date = e
        }
      })
    },
    changeCode(e,row) {
      this.old_data.forEach(item => {
        if (item.id == row.id) {
          item.check_code = e
        }
      })
    },
    resetForm() {
      this.$refs.vehicleTree.onClear()
      Object.assign(this.$data, this.$options.data());
      this.onSubmit()
    },
    onImport() {
      this.filedialogVisible = true
    },
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 导出模板 
    onExport() {
      let params = {
        ids: this.ids
      }
      this.$client.CheckExportGasManage({context:params}).then((res) => {
        if(res.head) {
          if (res.head.result == "200") {
            window.location.href = res.context;
            this.$message({ type: "success", message: "导出成功" });
          } else {
            this.$message({ type: "error", message: "导出失败" });
          }
        }else{
          this.$message({ type: "warning", message: "暂无可导出内容" });
        }
      });
    },
    // 导入 
    importExcel(val){
      let formData = new FormData();
      formData.append("file", val.file);
      let params = formData;
      this.$client.CheckImportGasManage(params)
      .then(res => {
        if(res.head.result == "200") {
          this.filedialogVisible = false;
          let list = res.context
          this.old_data.forEach(item=> {
            list.forEach(child => {
              if (item.manufacturing_number == child.manufacturing_number) {
                item.check_date = child.check_date
                item.check_code = child.check_code
              }
            })
          })
          this.onSubmit()
          this.$message({ message: res.head.describle, type: "success" });
        }else{
          this.filedialogVisible = false;
          let errorData = [];
          const h = this.$createElement;
          errorData.push(h('p',null,res.head.describle));
          this.$msgbox({
            title: '提示',
            message: h('div',null, errorData),
            confirmButtonText: '确定',
          })
        }
      })
    },
    updatePlaybill() {
      let list = this.old_data.filter(item => {
        return !item.check_date || !item.check_code
      })
      if (list.length > 0) {
        this.$message({
          type: "warning", 
          message: "请填写检查日期和检查报告编号" 
        });
        return
      }
      this.$emit("on-save",this.old_data);
    },
    setHead() {
      setTimeout(() => {
        let maxh = this.$el.offsetHeight;
        this.TableHeight = maxh - 200;
      }, 60);
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>


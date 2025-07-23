<template>
  <el-dialog
    :title="showTitle"
    width="760px"
    
    :before-close="dialogClose"
    :visible="dialogBool">
    <div class="content-box">
      <el-tabs v-model="activeName">
        <el-tab-pane label="基础信息" name="first">
          <el-form
            :validate-on-rule-change="false"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="120px"
            class="demo-ruleForm"
            :label-position="'right'"
            size="mini">
            <div class="content-box-t">
              <div class="show-flex-box-r">
                <el-form-item label="资产编码:" prop="material_code">
                  <el-input 
                    v-model="ruleForm.material_code" 
                    clearable 
                    :disabled="curSelectType === 'borrow' || curSelectType === 'back' || curSelectType === 'detail'" 
                    placeholder="请输入资产编码"></el-input>
                </el-form-item>
                <el-form-item label="资产名称:" prop="material_name">
                  <el-input 
                    v-model="ruleForm.material_name" 
                    clearable 
                    :disabled="curSelectType === 'borrow' || curSelectType === 'back' || curSelectType === 'detail'" 
                    placeholder="请输入资产名称"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="所属分组:" prop="group_id">
                  <get-assets-select 
                    ref="driverTree1"
                    v-model="ruleForm.group_id"
                    :width="'220'"
                    :disabled="curSelectType === 'borrow' || curSelectType === 'back' ||  curSelectType === 'detail'"
                    :isShowCheckbox="false"
                     clearable
                    :placeholder="'请选择分组'"
                    :isExportMultiple="false"
                  ></get-assets-select>
                </el-form-item>
                <el-form-item label="规格型号:" prop="specifications">
                  <el-input 
                    v-model="ruleForm.specifications" 
                    clearable
                    :disabled="curSelectType === 'borrow' || curSelectType === 'back' ||  curSelectType === 'detail'" 
                    placeholder="请输入规格型号"></el-input>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="计量单位:" prop="unit">
                  <get-select-dictionaries 
                    v-model="ruleForm.unit" 
                    clearable 
                    :disabled="curSelectType === 'borrow' || curSelectType === 'back' ||  curSelectType === 'detail'"
                    :classKey="'计量单位'" 
                    :placeholder="'请选择计量单位'"></get-select-dictionaries>
                </el-form-item>
                <el-form-item label="购入日期:" prop="buy_date">
                  <el-date-picker
                    v-model="ruleForm.buy_date"
                    clearable
                    :disabled="curSelectType === 'borrow' || curSelectType === 'back' ||  curSelectType === 'detail'"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                  </el-date-picker>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="金额:" prop="fee">
                  <el-input 
                    v-model="ruleForm.fee" 
                    clearable 
                    :disabled="curSelectType === 'borrow' || curSelectType === 'back' ||  curSelectType === 'detail'"
                    placeholder="请输入金额"></el-input>
                </el-form-item>
                <el-form-item label="来源:" prop="source">
                  <el-select 
                    v-model="ruleForm.source"
                    :disabled="curSelectType === 'borrow' || curSelectType === 'back' ||  curSelectType === 'detail'" 
                    clearable 
                    placeholder="请选择来源" >
                    <el-option
                      v-for="item in sourceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item label="备注:" prop="remark">
                  <el-input 
                    type="textarea" 
                    :disabled="curSelectType === 'borrow' || curSelectType === 'back' ||  curSelectType === 'detail'"
                    v-model="ruleForm.remark" 
                    style="width: 560px"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="content-box-b" v-show="curSelectType === 'borrow' || curSelectType === 'back' || curSelectType === 'detail'">
              <p style="font-size:250%;margin-left:15px;margin-bottom:15px;color:#409EFF;font-size:14px;font-weight:bold;margin-top:10px">当前使用信息</p>
              <div class="show-flex-box-r">
                <el-form-item :label="curSelectType === 'back' ? '归还部门' : '领用部门'" prop="dept_id">
                  <get-department-select
                    ref="departmenTree"
                    v-model="ruleForm.dept_id"
                    :isShowCheckbox="false"
                    placeholder="请选择部门"
                    :isContainEmp="false"
                    :isExportMultiple="false"
                    clearable
                    :disabled=" curSelectType === 'back' ||  curSelectType === 'detail'"
                    @on-change="onSelectChange"
                  ></get-department-select>
                </el-form-item>
                <el-form-item :label="curSelectType === 'back' ? '归还人' : '领用人'" prop="user_id">
                  <el-select 
                    v-model="ruleForm.user_id" 
                    clearable 
                    :disabled=" curSelectType === 'back' ||  curSelectType === 'detail'"
                    placeholder="请选择人员">
                    <el-option
                      v-for="item in personOptions"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
              </div>
              <div class="show-flex-box-r">
                <el-form-item :label="curSelectType === 'back' ? '归还时间' : '领用时间'">
                  <el-date-picker
                    v-model="ruleForm.date"
                    clearable
                    :disabled="curSelectType === 'detail'"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"
                    placeholder="请选择日期">
                  </el-date-picker>
                </el-form-item>
              </div>
            </div>
          </el-form> 
          <el-row type="flex" justify="end"  class="row-bg">
            <el-button @click="dialogClose" size="mini">取 消</el-button>
            <el-button type="primary" @click="updatePlaybill('ruleForm')" size="mini" :disabled="curSelectType === 'detail'">保 存</el-button>
          </el-row>
        </el-tab-pane>
        <el-tab-pane label="使用记录" name="second" ref="mainBox" v-if="curSelectType === 'detail'">
          <div class="container-box">
            <el-form :inline="true" size="mini" :model="form" ref="form">
              <el-form-item label="日期范围：">
                <el-date-picker
                  v-model="date"
                  type="daterange"
                  clearable
                  range-separator="至"
                  start-placeholder="开始日期"
                  format="yyyy-MM-dd"
                  value-format="yyyy-MM-dd"
                  end-placeholder="结束日期"
                  @change="selectedTime">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="类型：">
              <el-select style="width: 140px" v-model="form.type" clearable placeholder="请选择类型">
                  <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
              </el-form-item>
            </el-form>

            <el-table
              :data="tableData"
              height="399"
              border
              highlight-current-row
              v-loading="loading"
              :header-cell-style="{background:'#E0F3FF',color:'#333333',fontSize:'16px',padding: '2px 0px',fontWeight: '700'}"
              :cell-style="{fontSize: '13px', padding: '2px 0px'}"
              style="width: 100%">
              <el-table-column
                prop="dept_name"
                align="center"
                label="使用部门"
                width="180">
              </el-table-column>
              <el-table-column
                prop="user_name"
                align="center"
                label="使用人"
                width="180">
              </el-table-column>
              <el-table-column
                prop="borrow_back_date"
                align="center"
                label="领用/归还日期">
                <template slot-scope="scope">
                  <span>{{scope.row.borrow_back_date | setDateTime}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="type"
                align="center"
                label="类型">
                <template slot-scope="scope">
                  <span>{{scope.row.type == 1 ? '领用' : '归还'}}</span>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import { getDate, formatDateTime } from '@/utils/index'
import getAssetsSelect from 'components/base/formModel/tree/get-assets-select-tree'
import getSelectDictionaries from "@/components/base/formModel/select/get-select-dictionaries";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
export default {
  components: {
    getAssetsSelect, 
    getSelectDictionaries,
    getDepartmentSelect
  },
  props: {
    dialogBool: {
      type: Boolean,
      default: true
    },
    curSelectType: { 
      type: String,
      default: 'add'
    },
  },
  data() {
    return {
      activeName: 'first',
      showTitle: '资产入库',
      sourceOptions: [
        {value: 1,label: '采购'}, 
        {value: 2,label: '赠送'}, 
        {value: 3,label: '调入'}
      ],
      typeList: [
        {value: 0,label: '全部'},
        {value: 1,label: '领用'},
        {value: 2,label: '归还'}
      ],
      personOptions: [],
      ruleForm: {
        material_code: '',
        material_name: '',
        group_id: '',
        specifications: '',
        unit: '',
        buy_date: formatDateTime(new Date()),
        fee: '',
        source: '',
        remark: '',
        user_id: '',
        dept_id: '',
        date: ''
      },
      date: '',
      form: {
        assets_id: '',
        type: 0,
      },
      tableData: [],
      loading: false,
      rules: {
        material_code: [
          { required: true, message: "请输入物料编号", trigger: "change" },
        ],
        material_name: [
          { required: true, message: "请输入物料名称", trigger: "change" },
        ],
        group_id: [
          { required: true, message: "请选择所属分组", trigger: "change" },
        ],
        buy_date: [
          { required: true, message: "请选择购入日期", trigger: "change" },
        ],
      },
      rulesBorrow: {
        dept_id: [
          { required: true, message: "请选择使用部门", trigger: "change" },
        ],
        user_id: [
          { required: true, message: "请选择使用人员", trigger: "change" },
        ]
      },
    }
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        this.$refs.driverTree1.onClear()
        this.$refs.departmenTree.onClear()
        this.$refs.ruleForm.resetFields();
        this.$refs.ruleForm.clearValidate();
        Object.assign(this.$data, this.$options.data());
      } else {
        this.configTitle();
        this.$nextTick(() => {
          // this.$refs.ruleForm.resetFields();
          this.$refs.ruleForm.clearValidate();
        });
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 设置dialog标题
    configTitle() {
      switch (this.curSelectType) {
        case "detail":
          this.showTitle = '资产查看'
          this.rules = Object.assign({},this.ruleForm, this.rulesBorrow)
          break;
        case "borrow":
          this.showTitle = '领用'
          this.rules = Object.assign({},this.ruleForm, this.rulesBorrow)
          break;
        case "back":
          this.showTitle = '归还'
          this.rules = Object.assign({},this.ruleForm, this.rulesBorrow)
          break;
        default:
          this.showTitle = '资产入库'
          break;
      }
    },
    // 回显
    setData(data) {
      console.log(data);
      setTimeout(() => {
        this.ruleForm.material_code = data.material_code ? data.material_code : ''
        this.ruleForm.material_name = data.material_name ? data.material_name : ''
        this.ruleForm.group_id = data.group_id ? data.group_id : ''
        this.ruleForm.specifications = data.specifications ? data.specifications : ''
        this.ruleForm.unit = data.unit ? data.unit : ''
        this.ruleForm.buy_date = data.buy_date ? data.buy_date : ''
        this.ruleForm.fee = data.fee ? data.fee : ''
        this.ruleForm.source = data.source ? data.source : ''
        this.ruleForm.remark = data.remark ? data.remark : ''
        this.ruleForm.id = data.id ? data.id : ''
        if(this.curSelectType === 'back' || this.curSelectType === 'borrow' || this.curSelectType === 'detail') {
          // this.rules = Object.assign({},this.ruleForm, this.rulesBorrow)
          this.ruleForm.assets_id = data.id ? data.id : ''
          this.ruleForm.dept_id = data.dept_id ? data.dept_id : ''
          this.ruleForm.user_id = data.user_id ? data.user_id : ''
          this.ruleForm.date = formatDateTime(new Date())
        }
        if(this.curSelectType === 'detail') {
          this.ruleForm.date = data.borrow_date ?  data.borrow_date : ''
          this.form.assets_id = data.id ? data.id : ''
          this.onSetTime()
          this.onSubmit()
        }
      }, 100);
    },
    // 查询表单
    onSubmit() {
      this.loading = true
      let params =  Object.assign({}, this.form)
      this.$client.GetUseHistoryAssetsInfo(params)
      .then(res => {
        if (res.head.result == "200") {       
          this.tableData = res.context;
          this.loading = false
          } else {
            this.loading = false
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => { this.loading = false })
    },
    // 设置表单查询初始时间
    onSetTime(type = 'lastOneYear') {
      let timeObj = getDate(type)
      this.date = this.$addTime([timeObj.startTime, timeObj.endTime])
      this.form.date_start = this.date[0] + ' 00:00:00'
      this.form.date_end = this.date[1]
    },
    // 修改表单查询时间
    selectedTime(val) {
      this.form.date_start = !!val ? val[0] + ' 00:00:00' : ''
      this.form.date_end = !!val ? val[1] + ' 23:59:59' : ''
    },
    // 选择部门
    onSelectChange(vehs, nodes) {
      // console.log(vehs);
      this.personOptions = []
      if(this.curSelectType === 'borrow') {
        this.ruleForm.user_id = ''
      }
      if(!vehs[0]) {
        return false
      }
      let params = { dept_id: vehs[0]}
      this.$client.getDeptPerson(params)
      .then(res => {
        if (res.head.result == "200") {       
          this.personOptions = res.context;
          // console.log(this.personOptions, this.ruleForm.user_id);
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
      }).catch(err => {})
    },
    
    updatePlaybill(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = {};
          for (let i in this.ruleForm) {
            if (this.ruleForm[i]) {
              info[i] = this.ruleForm[i];
            }
          }
          switch (this.curSelectType) {
            case "add":
              this.$emit('save-add-edit', info);
              break;
            case "edit":
              this.$emit('save-add-edit', info);
              break;
            case "borrow":
              info.state = 1
              info.borrow_date = this.ruleForm.date
              this.$emit('save-borrow-row', info)
              break;
            case "back":
              info.state = 0
              info.back_date = this.ruleForm.date
              this.$emit('save-back-row', info)
              break;
          }
        } else {
          return false;
        }
      });
    },
  },
  filters: {
    setDateTime: function(value) {
      // console.log(value);
      let time = value.replace('T', ' ')
      return time
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.content-box {
  height: 500px;

  /deep/ .el-tabs__content {
    height: 445px;
  }

  /deep/ .el-tab-pane {
    height: 445px;
  }

  .content-box-t /deep/ .el-input__inner {
    width: 220px;
  }

  .content-box-b /deep/ .el-input__inner {
    width: 220px;
  }

  .row-bg {
    width: 100%;
    position: absolute;
    bottom: 0;
    right: 40px;
  }

}
</style>

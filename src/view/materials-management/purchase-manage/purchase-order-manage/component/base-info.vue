<template>
  <div class="base-info">
    <el-form ref="form" size="mini" :model="form" :rules="rules" label-width="120px">
      <el-row>
        <el-col :span="8">
          <el-form-item label="采购日期" prop="purchase_date">
            <el-date-picker
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.purchase_date"
              style="width: 100%;"></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购人员" prop="purchase_user">
            <!-- <el-input v-model="form.reason" placeholder="请输入申请人"></el-input> -->
            <get-department-select
              ref="personalTree"
              v-model="form.purchase_user"
              :width="'220'"
              :show_all="true"
              :isShowCheckbox="false"
              :placeholder="'请选择申请人'"
              :isContainEmp="true"
              :isExportMultiple="false"
              @on-change="selectedUser"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购组织" prop="purchase_dept">
            <get-department-select
              ref="departmentlTree"
              v-model="form.purchase_dept"
              :width="'220'"
              :isShowCheckbox="false"
              :placeholder="'请选择申请部门'"
              :isContainEmp="false"
              :isExportMultiple="false"
            ></get-department-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="采购方式" prop="type" :span="8">
            <el-select v-model="form.type" placeholder="选择采购类型">
              <el-option v-for="item in typeOptions" :key="item.value" v-bind="item"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="供应商" prop="supplier_name" >
            <!-- <el-input v-model="form.supplier_name" placeholder="请输入内容"></el-input> -->
            <el-select
                v-model="form.supplier"
                filterable
                clearable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gongysOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="应急采购" prop="reason" :span="8">
            <el-checkbox v-model="form.is_emergency" :true-label="1" :false-label="0">应急采购</el-checkbox>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="存放仓库:" prop="house_ids">
            <el-select
              v-model="form.house_id"
              filterable
              clearable
              placeholder="请选择">
              <el-option
                v-for="item in houseOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="form.remark" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="上传附件" prop="files">
        <!-- <el-input v-model="form.reason"></el-input> -->
        <multiple-files-upload :filesList="form.files" :acceptType="'.doc,.docx,.pdf,.xls,.xlsx'" :isPreviewable="false" :maxUpLoadSize="100" @upload-update-success="uploadUpdateSuccess"></multiple-files-upload>
        <el-alert
          title="支持格式：.rar .zip .doc .docx .pdf ，.jpg .jpeg .png等，单个文件不能超过100MB，最多只能保存3个文件"
          type="info"
          :center="false">
        </el-alert>
      </el-form-item>
      <el-form-item label="采购明细:">
        <el-button type="primary" size="mini" @click="addData()">添加</el-button>
        <el-button type="primary" size="mini" @click="delAll()">删除</el-button>
      </el-form-item>
    </el-form>
    <tr-table
      ref="table"
      @on-select-change-row="tableSelectChange"
      :selectionShow="true"
      :data="data"
      :tableHeaderList="canRendererTableHeader"
      :isShowSummary="true"
      :omitColumnIndex="[
        1,2,3,4,5,10
      ]"
      :TableHeight="300"
      :frontFixedNum="1"
      :backFixedNum="1"
      :isFixedEmptyPlaceholder="false">
      <template slot-scope="scope" slot="operation">
        <el-popconfirm
          @confirm="delTable(scope.index)"
          title="确定移除当前记录吗？">
          <el-button slot="reference" type="primary" size="mini">移除</el-button>
        </el-popconfirm>
      </template>
      <template slot-scope="scope" slot="count">
        <el-input-number style="width: 100px" size="mini" @change="setFee(scope.index)" v-model="data[scope.index].count" :controls="false"></el-input-number>
      </template>
      <template slot-scope="scope" slot="price">
        <el-input-number style="width: 100px" size="mini" @change="setFee(scope.index)" v-model="data[scope.index].price" :controls="false"></el-input-number>
      </template>
      <template slot-scope="scope" slot="fee">
        <el-input-number style="width: 100px" size="mini" v-model="data[scope.index].fee" :controls="false"></el-input-number>
      </template>
      <template slot-scope="scope" slot="remark">
        <el-input style="width: 100px" size="mini" v-model="data[scope.index].remark" type="textarea"></el-input>
      </template>
      <template slot-scope="scope" slot="code">
        <el-select
          style="width: 140px"
          v-model="data[scope.index].material_id"
          @change="materialChange($event, scope.index)"
          size="mini"
          :remote-method="remoteMethod"
          filterable
          remote
          placeholder="请选择">
          <el-option
            v-for="item in MaterialList"
            :key="item.id"
            :label="item.groupgo"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </tr-table>
  </div>

</template>

<script type="text/ecmascript-6">
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import multipleFilesUpload from "@/components/multiple-files-upload";
import dataConfig from "./dataConfig";
export default {
  components: {
    getDepartmentSelect,
    multipleFilesUpload
  },
  props:{
    dialogBool:{
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      typeOptions: [
        {label: '预定', value: 1},
        {label: '到场提货', value: 2},
      ],
      modelOptions: [
        {label: '现金', value: 1},
        {label: '汇款', value: 2},
        {label: '支付宝,微信', value: 3},
      ],
      form: {
        id: 0,
        purchase_date: '',
        purchase_user: '',
        purchase_dept: '',
        type: 1,
        supplier: '',
        house_id: '',
        is_emergency: 0,
        remark: '',
        files: [],
        details:[]
      },
      data: [],
      step_data: [], // 流程节点
      rules: {
        purchase_user: [
          {
            required: true,
            message: "请选择采购员",
            trigger: "change",
          },
        ],
        purchase_dept: [
          {
            required: true,
            message: "请选择采购组织",
            trigger: "change",
          },
        ],
        type: [
          {
            required: true,
            message: "选择采购类型",
            trigger: "change",
          },
        ],
        purchase_date: [
          {
            required: true,
            message: "请选择采购时间",
            trigger: "change",
          },
        ],
        supplier: [
          {
            required: true,
            message: "请输入供应商",
            trigger: "change",
          },
        ],
      },
      MaterialList: [],
      houseOptions: [],
      canRendererTableHeader: dataConfig.detailsHead,
      MaterialListMap: {},
      gongysOptions: [],
    }
  },
  mounted() {
    this.getWarehouse()
    this.getMaterial()
    this.getGinsang()
  },
  methods: {
    //供应商
    getGinsang() {
      this.$client.GetProviderPage().then((req) => {
        if (req.head.result === "200") {
          this.gongysOptions = req.context.list;
        } else {
          this.$message({ type: "error", message: "获取失败" });
        }
      });
    },
    // 计算总金额
    setFee(index) {
      this.data[index].fee = this.data[index].price * this.data[index].count
    },
    // 选择人员后获取部门信息
    selectedUser(userIds, nodes,parentNode) {
      if(userIds.length > 0 && !!parentNode) {
        this.form.purchase_dept = parentNode.i_id
      }else{
        this.form.purchase_dept = ''
      }
    },
    // 获取人员组织部门信息
    reqEmpInfo(id) {
      let parmas = {
        id: id
      }
      this.$client.getDriverInfo(parmas).then(res => {
        if(res.head.result == '200') {
          let info = res.context;
          // this.form.dept_id = info.c_name
        }else{
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        }
      })
    },
    // 表格选中
    tableSelectChange(row) {
      this.selectList = []
      row.forEach(item => {
        this.selectList.push(item.material_id)
      })
    },
    // 批量移除
    delAll() {
      let data = []
      this.data.forEach(item => {
        if (this.selectList.indexOf(item.material_id) < 0) {
          data.push(item)
        }
      })
      this.data = [...data]
    },
    // 移除明细
    delTable(idx) {
      this.data.splice(idx, 1)
    },
    // 选中变化
    materialChange(id, index) {

      let item = this.MaterialListMap[id]
      this.data[index].name = item.name
      this.data[index].specification = item.specification
      this.data[index].unit = item.measure_unit_name
      this.data[index].brand = item.brand
      this.data[index].price = item.price
    },
    // 添加
    addData() {
      this.data.push({...dataConfig.formModel})
    },
    deleteDetail(index){
      this.form.details.splice(index,1)
    },
    // 上传文件
    uploadUpdateSuccess(filesList) {
      this.form.files = filesList;
    },
    //获取仓库
    getWarehouse() {
      this.$client.getRecord1Warehouse().then((req) => {
        if (req.head.result === "200") {
          this.houseOptions = req.context;
          // if (req.context.length > 0) {
          //   this.form.warehouse_id = req.context[0].id;
          // }
        }
      });
    },
    // 物料编码筛选
    remoteMethod(query) {
      if (query) {
        this.MaterialList = this.MaterialListAll.filter(
          (item) => {
            return (
              item.groupgo.toLowerCase().indexOf(query.toLowerCase()) > -1 && this.MaterialList.length < 31
            );
          }
        );
      } else {
        this.MaterialList = this.MaterialListAll.filter((item, i) => {
          return i < 30
        })
      }
    },
    //获取物资
    getMaterial(warehouse_id = 0) {
      let form = {
        usable: 1
      }
      if (warehouse_id) {
        form.warehouse_id = warehouse_id
      }
      this.$client.getMaterialPage(form).then((req) => {
        if (req.head.result === "200") {
          this.MaterialList = [];
          this.MaterialListAll = [];
          let length = req.context.list.length;
          let allList = req.context.list;
          for (let i = 0; i < length; i++) {
            let item = allList[i];
            if (item.specification == null) {
              item.groupgo = item.name + "(" + item.code + ")";
            } else {
              item.groupgo = item.name + item.specification + "(" + item.code + ")";
            }
            this.MaterialListAll.push(item)
            this.MaterialListMap[item.id] = item
            if (i < 30) {
              this.MaterialList.push(item)
            }
          }
        }
      });
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.form.details = this.data
        if(!this.form.details.length) {
          reject({
            msg: '请填写要采购的物品明细'
          });
          return false;
        }
        this.$refs.form.validate((valid) => {
          if (valid) {
            try {
              this.form.details.forEach(element => {
                if(!element.material_id || !element.count) {
                  throw new Error('end')
                }
              });
            } catch (error) {
              reject({
                msg: '选择物料或填写数量'
              });
              return false;
            }
            resolve({
              form: this.form
            });
          } else {
            reject({
              msg: '获取失败,带星号的为必填项'
            });
            return false;
          }
        });
      });
    },
  },
  watch: {
    dialogBool() {
      if(!this.dialogBool) {
        Object.assign(this.$data.form, this.$options.data().form);
        this.data = []
      }
    },
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.base-info{
  width: 100%;
}
</style>

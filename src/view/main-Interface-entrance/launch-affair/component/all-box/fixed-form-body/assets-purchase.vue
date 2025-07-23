<template>
  <el-form ref="form" size="mini" :model="form" :rules="rules" label-suffix=":">
    <el-row :gutter="20">
      <el-col :span="12">
        <el-form-item label="申请人" prop="user_id">
          <get-department-select
            ref="personalTree"
            v-model="form.user_id"
            :isShowCheckbox="false"
            :placeholder="'请选择申请人'"
            :isContainEmp="true"
            :show_all="true"
            :isExportMultiple="false"
            :disabled="isShowSelectUser || isAgain"
            @on-change="selectedUser"
            :clearable="false"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请部门" prop="dept_id">
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%"  @change="dateChange" placeholder="请选择申请部门">
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="期望交付日期" prop="delivery_date">
          <el-date-picker
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择日期"
            v-model="form.delivery_date"
            style="width: 100%;">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item label="采购类型" prop="types">
          <el-select v-model="form.types" style="width: 100%;" @change="changeSelectType" multiple placeholder="请选择采购类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
      <el-col :span="12">
        <el-form-item label="采购总费用" prop="total_fee">
          <el-input-number style="width: 100%;" :min="0" :precision="2" :controls="false" v-model="form.total_fee"></el-input-number>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="申请事由" prop="resaon">
          <el-input type="textarea" v-model="form.resaon" :rows="4" placeholder="请输入申请事由" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="申请事由补充" prop="resaon_append ">
          <el-input type="textarea" v-model="form.resaon_append " :rows="4" placeholder="请输入申请事由补充" clearable></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="24">
        <el-form-item label="关联审批单">
          <el-tag
          style="margin-right: 5px"
          size="small"
          closable
          v-for="(item,index) in form.relevances"
          :key="item.work_deal_id"
          @close="delSelectApply(index)">{{item.code}}</el-tag>
          <el-button type="primary" size="mini" @click="approvalFormVisible = true">+</el-button>
        </el-form-item>
        </el-col>
    </el-row>
    <el-row>
      <el-tabs v-model="activeName" style="margin-bottom: 22px">
        <el-tab-pane label="固定资产明细" name="first" v-if="form.types.indexOf(1) != -1">
          <div style="margin-bottom: 10px;">
            <!-- <span style="align-items: center; margin-right: 10px; color:#999999;">固定资产明细</span> -->
            <el-button size="mini" type="primary" @click="assetsVisible = true">添加资产</el-button>
            <el-button size="mini" type="danger" @click="deleteAssets">移除</el-button>
          </div>
          <tr-table
            ref="assetsTable"
            :data="form.purchase_assets"
            :loading="loading"
            :selectionShow="true"
            :TableHeight="TableHeight"
            :isShowBottomOptions="false"
            :tableHeaderList="assetsCanRendererTableHeader"
            :frontFixedNum="1"
            @on-select-change-row="selectedAssetsList">
            <template slot-scope="scope" slot="price">
              <el-input-number style="width: 100%;" :min="0" :precision="2" :controls="false" v-model="scope.data.price" @change="assetsTotalCost(scope.index)"></el-input-number>
            </template>
            <template slot-scope="scope" slot="count">
              <el-input-number style="width: 100%;" :min="0" :controls="false" v-model="scope.data.count" @change="assetsTotalCost(scope.index)"></el-input-number>
            </template>
            <template slot-scope="scope" slot="fee">
              <el-input-number style="width: 100%;" :min="0" :precision="2" :controls="false" v-model="scope.data.fee" @change="TotalCost"></el-input-number>
            </template>
            <template slot-scope="scope" slot="remark">
              <el-input v-model="scope.data.remark" placeholder="请输入备注" clearable></el-input>
            </template>
            <template slot-scope="scope" slot="need_dept">
              <el-cascader
                v-model="scope.data.need_dept"
                :options="departmentTree"
                :show-all-levels="false"
                :props="{ 
                  checkStrictly: true,
                  value: 'i_id',
                  label: 'c_name', 
                  emitPath: false 
                }"
                clearable>
              </el-cascader>
            </template>
            <template slot-scope="scope" slot="supplier_name">
              <get-supplier-list 
                style="width:100%"
                v-model="scope.data.supplier_id"
                :placeholder="'请选择供应商'">
              </get-supplier-list>
            </template>
          </tr-table>
        </el-tab-pane>
        <el-tab-pane label="物品明细" name="second" v-if="form.types.indexOf(2) != -1">
          <div style="margin-bottom: 10px;">
            <!-- <span style="align-items: center; margin-right: 10px; color:#999999;">物品明细</span> -->
            <el-button size="mini" type="primary" @click="goodsVisible = true">添加物品</el-button>
            <el-button size="mini" type="danger" @click="deleteGoods">移除</el-button>
          </div>
          <tr-table
            ref="goodsTable"
            :data="form.purchase_goods"
            :loading="loading"
            :selectionShow="true"
            :TableHeight="TableHeight"
            :isShowBottomOptions="false"
            :tableHeaderList="goodsCanRendererTableHeader"
            :frontFixedNum="1"
            @on-select-change-row="selectedGoodsList">
            <template slot-scope="scope" slot="price">
              <el-input-number style="width: 100%;" :min="0" :precision="2" :controls="false" v-model="scope.data.price" @change="goodsTotalCost(scope.index)"></el-input-number>
            </template>
            <template slot-scope="scope" slot="count">
              <el-input-number style="width: 100%;" :min="0" :controls="false" v-model="scope.data.count" @change="goodsTotalCost(scope.index)"></el-input-number>
            </template>
            <template slot-scope="scope" slot="fee">
              <el-input-number style="width: 100%;" :min="0" :precision="2" :controls="false" v-model="scope.data.fee" @change="TotalCost"></el-input-number>
            </template>
            <template slot-scope="scope" slot="remark">
              <el-input v-model="scope.data.remark" placeholder="请输入备注" clearable></el-input>
            </template>
            <template slot-scope="scope" slot="need_dept">
              <el-cascader
                v-model="scope.data.need_dept"
                :options="departmentTree"
                :show-all-levels="false"
                :props="{ 
                  checkStrictly: true,
                  value: 'i_id',
                  label: 'c_name',
                  emitPath: false 
                }"
                clearable>
              </el-cascader>
            </template>
            <template slot-scope="scope" slot="supplier_name">
              <get-supplier-list 
                style="width:100%"
                v-model="scope.data.supplier_id" 
                :placeholder="'请选择供应商'">
              </get-supplier-list>
            </template>
          </tr-table>
        </el-tab-pane>
      </el-tabs>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload
          :images="form.thumbnail_imgs"
          :files="form.file_list"
          :isEdit="true"
          @files-update-success="filesUpdateSuccess"
          @images-update-success="imagesUpdateSuccess"></image-file-upload>
      </el-col>
    </el-row>
    <el-dialog
      center
      title="选择资产"
      fullscreen
      :visible.sync="assetsVisible"
      append-to-body>
      <assets-classification @set-info="setAssetsInfo"></assets-classification>
    </el-dialog>
    <el-dialog
      center
      title="选择物品"
      fullscreen
      :visible.sync="goodsVisible"
      append-to-body>
      <goods-classification @set-info="setGoodsInfo"></goods-classification>
    </el-dialog>
    <el-dialog
      center
      title="关联审批单"
      fullscreen
      :visible.sync="approvalFormVisible"
      append-to-body>
      <associated-approval-form
        :key="key"
        :relevances="form.relevances"
        :approvalFormVisible="approvalFormVisible"
        @on-out="onSelectRowList"
        @on-close="approvalFormVisible = false"></associated-approval-form>

    </el-dialog>
  </el-form>
</template>

<script type="text/ecmascript-6">
import imageFileUpload from "@/components/imageFileUpload/index";
import assetsClassification from "./component/assets-form/index"
import goodsClassification from "./component/goods-form/index"
import associatedApprovalForm from "./component/all-form/index"
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';
import common from './common/index'
export default {
  name: "assets-purchase",
  components: {
    imageFileUpload,
    assetsClassification,
    goodsClassification,
    getDepartmentSelect,
    associatedApprovalForm,
    getSupplierList
  },
  mixins: [common],
  props: {
    dialogBool:{
      type: Boolean,
      default: false
    },
    isShowSelectUser: {
      type: Boolean,
      default: true
    },
    isAgain: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      loading: false,
      TableHeight: 400,
      assetsVisible: false,
      goodsVisible: false,
      selectedAssetsIds: [], //选中的资产id
      selectedGoodsIds: [], //选中的物品id
      approvalFormVisible: false,
      form: {
        id: null,
        user_id:null,
        dept_id:null,
        delivery_date: '',
        types: [2],
        total_fee: 0,
        resaon: '',
        resaon_append: '',
        purchase_assets: [],
        purchase_goods: [],
        relevances: [],
        img_list: [],
        files_list: [],
        thumbnail_imgs: [],
      },
      rules: {
        user_id: [
          {
            required: true,
            message: "请选择申请人",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择申请部门",
            trigger: "change",
          },
        ],
        types: [
          {
            required: true,
            message: "请选择采购类型",
            trigger: "change",
          },
        ],
        total_fee: [
          {
            required: true,
            message: "请输入采购总费用",
            trigger: "change",
          },
        ],
        resaon: [
          {
            required: true,
            message: "请输入申请事由",
            trigger: "change",
          },
        ],
      },
      typeList: [
        {label: "固定资产", value: 1},
        {label: "物品", value: 2}
      ],
      assetsCanRendererTableHeader: [
         {
          id: 1,
          label: "资产名称",
          prop: "assets_name",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "规格型号",
          prop: "model",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "计量单位",
          prop: "unit_name",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 9,
          label: "品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 4,
          label: "供应商",
          prop: "supplier_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "预估单价(元)",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "申请采购数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "合计费用",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "需要部门",
          prop: "need_dept",
          width: "150",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "备注",
          prop: "remark",
          width: "170",
          align: "center",
          signIndex: 8,
          sortable: false,
        }
      ],
      goodsCanRendererTableHeader: [
         {
          id: 1,
          label: "物品编号",
          prop: "goods_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "物品名称",
          prop: "goods_name",
          width: "130",
          align: "center",
          signIndex: 1,
          sortable: false,
        },
        {
          id: 3,
          label: "规格型号",
          prop: "model",
          width: "130",
          align: "center",
          signIndex: 2,
          sortable: false,
        },
        {
          id: 4,
          label: "计量单位",
          prop: "unit_name",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "供应商",
          prop: "supplier_name",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "预估单价(元)",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "申请采购数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "费用合计",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "需要部门",
          prop: "need_dept",
          width: "150",
          align: "center",
          signIndex: 8,
          sortable: false,
        },
        {
          id: 10,
          label: "备注",
          prop: "remark",
          width: "170",
          align: "center",
          signIndex: 9,
          sortable: false,
        }
      ],
      key: null,

      oldForm: null,
      dept_id: null,
      changeNum: 0,
      deptList:[],
      activeName: 'second',

      departmentTree: []
    }
  },
  watch:{
    dialogBool() {
      if(!this.dialogBool) {
        this.$refs.personalTree.onClear();
        // this.$refs.departmentlTree.onClear();
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs["form"].resetFields();
        })
      }
    }
  },
  methods: {
    // 初始化数据
    initSet(info){
      this.getDepartment()
      if (!!info) {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key) && key != 'dept_id') {
            this.form[key] = info[key];
          }
        }
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
        if (this.form.purchase_assets.length > 0) {
          this.activeName = "first"
          this.form.purchase_assets.forEach((item,index) => {
            item.uuid = item.id + index.toString()
          })
        } else if (this.form.purchase_goods.length > 0) {
          this.activeName = "second"
          this.form.purchase_goods.forEach((item,index) => {
            item.uuid = item.id + index.toString()
          })
        }
      } else {
        this.form.delivery_date = formatTime(new Date())
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    // 获取部门
    getDepartment() {
      let params = {
        is_contain_emp: false,
        show_all: false
      };
      this.$client.getUserEmps(params).then((res) => {
        if (res.head.result === "200") {
          this.departmentTree = res.context
        }
      }).catch((err) => {
        this.loading = false;
      });
    },
    // 添加资产
    setAssetsInfo(info) {
      // 给后续添加的数据 赋值上一份数据的  需要部门信息
      let need_dept = ''
      if (this.form.purchase_assets.length > 0) {
        need_dept = this.form.purchase_assets[this.form.purchase_assets.length -1].need_dept
      }
      let arr = JSON.parse(JSON.stringify(info))
      arr.forEach(item => {
        item.need_dept = need_dept
      })
      this.form.purchase_assets = [...this.form.purchase_assets, ...arr]
      // 生产唯一id 
      this.form.purchase_assets.forEach((item,index) => {
        item.uuid = item.id + index.toString()
      })
      this.assetsVisible = false
    },
    // 添加物品
    setGoodsInfo(info) {
      // 给后续添加的数据 赋值上一份数据的  需要部门信息
      let need_dept = ''
      if (this.form.purchase_goods.length > 0) {
        need_dept = this.form.purchase_goods[this.form.purchase_goods.length -1].need_dept
      }
      let arr = JSON.parse(JSON.stringify(info))
      arr.forEach(item => {
        item.need_dept = need_dept
      })
      this.form.purchase_goods = [...this.form.purchase_goods, ...arr]
      // 生产唯一id 
      this.form.purchase_goods.forEach((item,index) => {
        item.uuid = item.id + index.toString()
      })

      this.goodsVisible = false
    },
    // 计算资产合计费用
    assetsTotalCost(index) {
      this.form.purchase_assets[index].fee = this.form.purchase_assets[index].price * this.form.purchase_assets[index].count
      this.TotalCost()
    },
    // 计算物品合计费用
    goodsTotalCost(index) {
      this.form.purchase_goods[index].fee = this.form.purchase_goods[index].price * this.form.purchase_goods[index].count
      this.TotalCost()
    },
    // 计算总费用
    TotalCost() {
      let info = [...this.form.purchase_assets, ...this.form.purchase_goods]
      this.form.total_fee = info.reduce((pre, item) => {
        return pre + Number(item.fee)
      }, 0)
    },
    // 选中资产
    selectedAssetsList(list) {
      this.selectedAssetsIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedAssetsIds.push(item.uuid)
        });
      }
    },
    // 移除选中资产
    deleteAssets() {
      if(!this.selectedAssetsIds.length) {
        this.$message({
          showClose: true,
          message: '请选中要移除的资产',
          type: "error",
        });
        return
      }
      let arrData = []
      this.form.purchase_assets.forEach(item => {
        if(this.selectedAssetsIds.indexOf(item.uuid) == -1) {
          arrData.push(item)
        }
      })
      this.form.purchase_assets = arrData
    },
    // 选中物品
    selectedGoodsList(list) {
      this.selectedGoodsIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedGoodsIds.push(item.uuid)
        });
      }
    },
    // 移除选中物品
    deleteGoods() {
      if(!this.selectedGoodsIds.length) {
        this.$message({
          showClose: true,
          message: '请选中要移除的物品',
          type: "error",
        });
        return
      }
      let arrData = []
      this.form.purchase_goods.forEach(item => {
        if(this.selectedGoodsIds.indexOf(item.uuid) == -1) {
          arrData.push(item)
        }
      })
      this.form.purchase_goods = arrData
    },
    // 采购类型选择
    changeSelectType(val) {
      if( this.form.types.indexOf(1) === -1) {
        this.form.purchase_assets = []
        this.activeName = 'second'
      }
      if( this.form.types.indexOf(2) === -1) {
        this.form.purchase_goods = []
        this.activeName = 'first'
      }
      this.TotalCost()
      // console.log('采购类型改变' + val, typeof(val), this.form.types, this.form);
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          let isAssets = false, isGoods = false
          this.form.purchase_assets.forEach(item => {
            if(!item.count) isAssets = true
          })
          this.form.purchase_goods.forEach(item => {
            if(!item.count) isAssets = true
          })
          
          if (valid && !isAssets && !isGoods) {
            resolve({
              form: this.form
            });
          } else {
            reject({
              msg: '获取失败,带星号的及采购数量为必填项'
            });
            return false;
          }
        });
      });
    },
    onSelectRowList(val) {
      this.form.relevances = []
      val.forEach(item => {
        this.form.relevances.push({
          work_deal_id: item.detail_id ? item.detail_id : item.work_deal_id,
          code: item.code,
          object_id: item.object_id,
          active_name: item.active_name,
          object_name: item.object_name
        })
      })
      this.approvalFormVisible = false
    },
    // 移除关联表单
    delSelectApply(index) {
      this.form.relevances.splice(index,1)
      this.key = new Date().getTime()
      this.approvalFormVisible = false
    },
    // 选择人员后获取部门信息
    async selectedUser(userIds, nodes,parentNode) {
      if(!nodes) {
        this.form.dept_id = ''
        return false
      }
      let dept_id = null
      this.changeNum ++ 
      if (this.changeNum > 1) {
        if(userIds.length > 0 && !!parentNode) {
          dept_id = parentNode.i_id
        }
      } else {
      // 若有草稿  则部门为草稿中部门   若无草稿 则为主部门
        dept_id = this.dept_id
      }
      this.deptList = await this.GetUserDept(this.form.user_id)
      this.form.dept_id = dept_id

      // 保存一下初始化数据 作为保存草稿时的比对数据
      if (this.changeNum <= 1) {
        this.oldForm = deepCopy(this.form)
      }
      this.dateChange()
    },
     GetUserDept(user_id) {
      return this.$client.GetUserDept({user_id}).then(res => res.context)
    },
  },
   
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

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
            @on-change="selectedPersonal"
            :clearable="false"
          ></get-department-select>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="申请部门" prop="dept_id">
          <el-select v-model="form.dept_id" :disabled="!deptList.length" style="width:100%" @change="changeDept" placeholder="请选择申请部门">
            <el-option
              v-for="item in deptList"
              :key="item.dept_id"
              :label="item.dept_name"
              :value="item.dept_id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <!-- <el-col :span="12">
        <el-form-item label="领用类型" prop="types">
          <el-select v-model="form.types" style="width: 100%;" @change="changeSelectType" multiple placeholder="请选择领用类型">
            <el-option
              v-for="item in typeList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-col> -->
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-form-item label="申请事由" prop="reason">
          <el-input type="textarea" v-model="form.reason" :rows="4" placeholder="请输入申请事由" clearable></el-input>
        </el-form-item>
      </el-col>
      <div style="margin-bottom: 20px;" v-if="form.types.indexOf(1) != -1">
        <div style="margin-bottom: 10px;">
          <span style="align-items: center; margin-right: 10px; color:#999999;">固定资产明细</span>
          <el-button size="mini" type="primary" @click="assetsVisible = true">添加资产</el-button>
          <el-button size="mini" type="danger" @click="deleteAssets">移除</el-button>
        </div>
        <tr-table
          ref="assetsTable"
          :data="form.assets"
          :loading="loading"
          :selectionShow="true"
          :TableHeight="TableHeight1"
          :isShowBottomOptions="false"
          :tableHeaderList="assetsCanRendererTableHeader"
          @on-select-change-row="selectedAssetsList">
          <template slot-scope="scope" slot="user_id">
            <!-- <el-input v-model="scope.data.user_id" placeholder="请输入备注" clearable></el-input> -->
            <el-select v-model="scope.data.user_id" placeholder="请选择使用人" clearable>
              <el-option
                v-for="item in departmentUserList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </template>
        </tr-table>
      </div>
      <div style="margin-bottom: 20px;" v-if="form.types.indexOf(2) != -1">
        <div style="margin-bottom: 10px;">
          <span style="align-items: center; margin-right: 10px; color:#999999;">物品明细</span>
          <el-button size="mini" type="primary" @click="goodsVisible = true">添加物品</el-button>
          <el-button size="mini" type="danger" @click="deleteGoods">移除</el-button>
        </div>
        <tr-table
          ref="goodsTable"
          :data="form.goods"
          :loading="loading"
          :selectionShow="true"
          :TableHeight="TableHeight2"
          :isShowBottomOptions="false"
          :tableHeaderList="goodsCanRendererTableHeader"
          @on-select-change-row="selectedGoodsList">
          <template slot-scope="scope" slot="use_count">
            <el-input-number style="width: 100%;" :min="0" :precision="0" :controls="false" v-model="scope.data.use_count" @change="assetsTotalCost(scope.index)"></el-input-number>
          </template>
          <template slot-scope="scope" slot="total_fee">
            <el-input-number style="width: 100%;" disabled :min="0" :precision="2" :controls="false" v-model="scope.data.total_fee"></el-input-number>
          </template>
        </tr-table>
      </div>
      <el-col :span="24" style="margin-bottom: 20px">
        <image-file-upload
          :images="form.thumbnail_imgs"
          :files="form.files_list"
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
      <assets-classification :curType="true" @set-info="setAssetsInfo"></assets-classification>
    </el-dialog>
    <el-dialog
      center
      title="选择物品"
      fullscreen
      :visible.sync="goodsVisible"
      append-to-body>
      <goods-classification @set-info="setGoodsInfo"></goods-classification>
    </el-dialog>
  </el-form>
</template>

<script type="text/ecmascript-6">
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';
import imageFileUpload from "@/components/imageFileUpload/index";
import assetsClassification from "./component/assets-form/index"
import goodsClassification from "./component/goods-form/index"
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import common from './common/index'
export default {
  name: 'assets-borrow',
  components: {
    imageFileUpload,
    assetsClassification,
    goodsClassification,
    getDepartmentSelect
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
      TableHeight1: 200,
      TableHeight2: 200,
      assetsVisible: false,
      goodsVisible: false,
      selectedAssetsIds: [], //选中的资产id
      selectedGoodsIds: [], //选中的物品id
      departmentUserList: [],
      form: {
        id: null,
        user_id: null,
        dept_id: null,
        types: [2],
        type: 1,
        reason: '',
        assets: [],
        goods: [],
        img_list: [],
        files_list: [],
        thumbnail_imgs: [],
      },
      typeList: [
        {label: "固定资产", value: 1},
        {label: "物品", value: 2}
      ],
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
        reason: [
          {
            required: true,
            message: "请输入申请事由",
            trigger: "change",
          },
        ],
      },
      assetsCanRendererTableHeader: [
        {
          id: 1,
          label: "资产编号",
          prop: "assets_code",
          width: "130",
          align: "center",
          signIndex: 0,
          sortable: false,
        },
        {
          id: 2,
          label: "资产名称",
          prop: "assets_name",
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
          id: 8,
          label: "品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 7,
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
          label: "存放地点",
          prop: "address",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "资产单价",
          prop: "price",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "使用人",
          prop: "user_id",
          width: "170",
          align: "center",
          signIndex: 6,
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
          id: 10,
          label: "品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 9,
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
          label: "存放地点",
          prop: "address",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "平均单价",
          prop: "price",
          width: "150",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "库存数量",
          prop: "total_count",
          width: "170",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "领用数量",
          prop: "use_count",
          width: "170",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 9,
          label: "总价值",
          prop: "total_fee",
          width: "170",
          align: "center",
          signIndex: 8,
          sortable: false,
        }
      ],

      oldForm: null,
      dept_id: null,
      changeNum: 0,
      deptList: []
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
      if (!!info) {
        for (const key in this.form) {
          if (Object.hasOwnProperty.call(info, key) && key != 'dept_id') {
            this.form[key] = info[key];
          }
        }
        this.dept_id = JSON.parse(JSON.stringify(info.dept_id))
      } else {
        if (getUser()) {
          let userInfo = JSON.parse(getUser());
          this.form.user_id = Number(userInfo.user_id);
          this.dept_id = Number(userInfo.department_id);
        }
      }
    },
    // 添加资产
    setAssetsInfo(info) {
      let isTrue = false
      info.forEach(item => {
        // console.log(item.state)
        if(!!item.state) {
          isTrue = true
          return
        }
      })
      if(isTrue) {
        this.$message({
          showClose: true,
          message: '您选中的资产不是闲置状态,请检查。',
          type: "error",
        });
        return
      }
      let arr = JSON.parse(JSON.stringify(info))
      let ids = this.form.assets.map(item => {return item.assets_id || item.id})
      let form = []
      arr.forEach(zItem => {
        if(ids.indexOf(zItem.id) == -1) {
          zItem.assets_id = zItem.id
          zItem.price = zItem.fee
          form.push(zItem)
        }
      })
      this.form.assets = [...this.form.assets, ...form]
      this.assetsVisible = false
      this.countHeight1()
    },
    // 添加物品
    setGoodsInfo(info) {
      let isTrue = false
      info.forEach(item => {
        // console.log(item.state)
        if(!item.surplus_count) {
          isTrue = true
          return
        }
      })
      if(isTrue) {
        this.$message({
          showClose: true,
          message: '您选中的物品已没有库存,请检查。',
          type: "error",
        });
        return
      }
      let arr = JSON.parse(JSON.stringify(info))
      let ids = this.form.goods.map(item => {return item.goods_id || item.id})
      let form = []
      arr.forEach(zItem => {
        if(ids.indexOf(zItem.id) == -1) {
          zItem.goods_id = zItem.id
          zItem.total_count = zItem.surplus_count
          zItem.use_count = zItem.surplus_count
          zItem.total_fee = zItem.total_price
          form.push(zItem)
        }
      })
      this.form.goods = [...this.form.goods, ...form]
      this.goodsVisible = false
      this.countHeight2()
    },
    // 计算表格高度
    countHeight1() {
      if (this.form.assets.length === 0) {
        this.TableHeight1 = 200
      } else {
        this.TableHeight1 = this.form.assets.length * 50 + 100
      }
    },
    // 计算表格高度
    countHeight2() {
      if (this.form.goods.length === 0) {
        this.TableHeight2 = 200
      } else {
        this.TableHeight2 = this.form.goods.length * 50 + 100
      }
    },
    // 选中资产
    selectedAssetsList(list) {
      this.selectedAssetsIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedAssetsIds.push(item.id)
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
      this.form.assets.forEach(item => {
        if(this.selectedAssetsIds.indexOf(item.id) == -1) {
          arrData.push(item)
        }
      })
      this.form.assets = arrData
      this.countHeight1()
    },
    // 选中物品
    selectedGoodsList(list) {
      this.selectedGoodsIds = [];
      if(list && list.length > 0) {
        list.forEach((item,index) => {
          this.selectedGoodsIds.push(item.id)
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
      this.form.goods.forEach(item => {
        if(this.selectedGoodsIds.indexOf(item.id) == -1) {
          arrData.push(item)
        }
      })
      this.form.goods = arrData
      this.countHeight2()
    },
    // 选中人员
    async selectedPersonal(userIds,node, parentNode) {
      if(!node) {
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
      this.selectedPersonalList()
      // 保存一下初始化数据 作为保存草稿时的比对数据
      if (this.changeNum <= 1) {
        this.oldForm = deepCopy(this.form)
      }
      this.dateChange()
    },
    GetUserDept(user_id) {
      return this.$client.GetUserDept({user_id}).then(res => res.context)
    },
    // 获取部门下的人员
    selectedPersonalList() {
      if(this.form.dept_id) {
        let params = {
          dept_id: this.form.dept_id
        }
        this.$client.getDeptPerson(params).then(res => {
          if (res.head.result == "200") {
            this.departmentUserList = res.context;
          }
        })
      }else {
        this.departmentUserList = []
      }
    },
    changeDept() {
      this.selectedPersonalList()

      if (this.form.assets.length > 0) {
        this.form.assets.forEach(item => {
          item.user_id = ''
        })
      }
      this.dateChange()
    },
    // 计算总价值
    assetsTotalCost(index) {
      this.form.goods[index].total_fee = this.form.goods[index].price * this.form.goods[index].use_count
    },
    // 采购类型选择
    changeSelectType(val) {
      if( this.form.types.indexOf(1) === -1) this.form.assets = []
      if( this.form.types.indexOf(2) === -1) this.form.goods = []
    },
    // 合并表单值
    outData() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          let isAssets = false, isGoods = false
          this.form.goods.forEach(item => {
            if(!item.use_count) isAssets = true
          })
          if (valid && !isAssets && !isGoods) {
           resolve({
              form: this.form
            });
          } else {
            reject({
              msg: '获取失败,带星号的及物品领用数量为必填项'
            });
            return false;
          }
        });
      });
    },
  },
  
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>

<template>
  <div class="assets-purchase-audit" v-loading="loading">
    <div class="head-image">
      <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 2" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 4" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 3" alt="">
    </div>
    <title-box-new :title="formData.created_name + '提交的资产采购申请单'">
      <div class="head-content">
        <p style="color: #BBBBBB;">审批编号:{{formData.flow_code}}</p>
        <p :style="{'color': outColor(formData.state)}">
          {{formData.state === 0  ? '发起审批' : formData.state_name}}
        </p>
      </div>
    </title-box-new>
    <item-box-new title="基本信息">
      <el-row :gutter="20">
        <el-col :span="12">
          <p>申请人</p>
          <em>{{formData.user_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>申请部门</p>
          <em>{{formData.dept_name}}</em>
        </el-col>
        <el-col :span="12">
          <p>期望交付日期</p>
          <em>{{formData.delivery_date}}</em>
        </el-col>
        <el-col :span="12">
          <p>采购类型</p>
          <em>{{ formData.type_name }}</em>
        </el-col>
        <el-col :span="12">
          <p>采购总费用</p>
          <el-input-number @change="upDateAudit" style="width: 100%;" :min="0" :precision="2" :controls="false" v-model="formData.total_fee" v-if="formData.state == 1 && formData.user_ids.includes(userId)" size="mini"></el-input-number>
          <em v-else>{{ formData.total_fee }}</em>
        </el-col>
        <el-col :span="24">
          <p>申请事由</p>
          <!-- <em>{{formData.resaon}}</em> -->
          <el-input v-model="formData.resaon" autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
        <el-col :span="24">
          <p>申请事由补充</p>
          <el-input v-model="formData.resaon_append " autosize type="textarea" class="richText" disabled ></el-input>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <el-tabs v-model="activeName" style="margin-bottom: 22px">
          <el-tab-pane label="固定资产明细" name="first" v-if="formData.types.indexOf(1) != -1">
            <div style="margin-bottom: 10px;">
              <!-- <span style="align-items: center; margin-right: 10px; color:#999999;">固定资产明细</span> -->
              <el-button size="mini" type="primary" @click="assetsVisible = true" v-if="formData.state == 1 && formData.user_ids.includes(userId)">添加资产</el-button>
              <el-button size="mini" type="danger" @click="deleteAssets" v-if="formData.state == 1 && formData.user_ids.includes(userId)">移除</el-button>
            </div>
            <tr-table
              ref="assetsTable"
              :data="formData.purchase_assets"
              :loading="tableLoading"
              :selectionShow="true"
              :TableHeight="TableHeight"
              :isShowBottomOptions="false"
              :tableHeaderList="assetsCanRendererTableHeader"
              @on-select-change-row="selectedAssetsList">
              <template slot-scope="scope" slot="price">
                <el-input-number
                  style="width: 100%;"
                  :min="0"
                  :precision="2"
                  :controls="false"
                  v-model="scope.data.price"
                  v-if="formData.state == 1 && formData.user_ids.includes(userId)"
                  @change="assetsTotalCost(scope.index)"></el-input-number>
                  <span v-else>{{ scope.data.price }}</span>
              </template>
              <template slot-scope="scope" slot="count">
                <el-input-number
                  style="width: 100%;"
                  :min="0"
                  :controls="false"
                  v-model="scope.data.count"
                  v-if="formData.state == 1 && formData.user_ids.includes(userId)"
                  @change="assetsTotalCost(scope.index)"></el-input-number>
                  <span v-else>{{ scope.data.count }}</span>
              </template>
              <template slot-scope="scope" slot="fee">
                <el-input-number style="width: 100%;" disabled :min="0" :precision="2" :controls="false" v-model="scope.data.fee" @change="TotalCost"></el-input-number>
              </template>
              <template slot-scope="scope" slot="remark">
                <el-input v-model="scope.data.remark" placeholder="请输入备注" clearable v-if="formData.state == 1 && formData.user_ids.includes(userId)"></el-input>
                <span v-else>{{ scope.data.remark }}</span>
              </template>
              <template slot-scope="scope" slot="need_dept">
                <el-cascader
                  v-if="formData.state == 1 && formData.user_ids.includes(userId)"
                  v-model="scope.data.need_dept"
                  @change="upDateAudit"
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
                <span v-else>{{ scope.data.need_dept_name }}</span>
              </template>
              <template slot-scope="scope" slot="supplier_name">
                <get-supplier-list 
                  v-if="formData.state == 1 && formData.user_ids.includes(userId)"
                  style="width:100%"
                  @change="upDateAudit"
                  v-model="scope.data.supplier_id" 
                  :placeholder="'请选择供应商'">
                </get-supplier-list>
                <span v-else>{{ scope.data.supplier_name }}</span>
              </template>
            </tr-table>
          </el-tab-pane>
          <el-tab-pane label="物品明细" name="second" v-if="formData.types.indexOf(2) != -1">
            <div>
              <!-- <span style="align-items: center; margin-right: 10px; color:#999999;">物品明细</span> -->
              <el-button size="mini" type="primary" @click="goodsVisible = true" v-if="formData.state == 1 && formData.user_ids.includes(userId)">添加物品</el-button>
              <el-button size="mini" type="danger" @click="deleteGoods" v-if="formData.state == 1 && formData.user_ids.includes(userId)">移除</el-button>
            </div>
            <tr-table
              ref="goodsTable"
              :data="formData.purchase_goods"
              :loading="loading"
              :selectionShow="false"
              :TableHeight="TableHeight"
              :isShowBottomOptions="false"
              :tableHeaderList="goodsCanRendererTableHeader"
              @on-select-change-row="selectedGoodsList">
              <template slot-scope="scope" slot="price">
                <el-input-number
                  style="width: 100%;"
                  :min="0" :precision="2"
                  :controls="false"
                  v-model="scope.data.price"
                  v-if="formData.state == 1 && formData.user_ids.includes(userId)"
                  @change="goodsTotalCost(scope.index)"></el-input-number>
                  <span v-else>{{ scope.data.price }}</span>
              </template>
              <template slot-scope="scope" slot="count">
                <el-input-number
                  style="width: 100%;"
                  :min="0"
                  :controls="false"
                  v-model="scope.data.count"
                  v-if="formData.state == 1 && formData.user_ids.includes(userId)"
                  @change="goodsTotalCost(scope.index)"></el-input-number>
                  <span v-else>{{ scope.data.count }}</span>
              </template>
              <template slot-scope="scope" slot="fee">
                <el-input-number
                style="width: 100%;" disabled :min="0" :precision="2" :controls="false" v-model="scope.data.fee" @change="TotalCost"></el-input-number>
              </template>
              <template slot-scope="scope" slot="remark">
                <el-input v-model="scope.data.remark" placeholder="请输入备注" clearable v-if="formData.state == 1 && formData.user_ids.includes(userId)"></el-input>
                <span v-else>{{ scope.data.remark }}</span>
              </template>
              <template slot-scope="scope" slot="need_dept">
                <el-cascader
                  v-if="formData.state == 1 && formData.user_ids.includes(userId)"
                  v-model="scope.data.need_dept"
                  @change="upDateAudit"
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
                <span v-else>{{ scope.data.need_dept_name }}</span>
              </template>
              <template slot-scope="scope" slot="supplier_name">
                <get-supplier-list 
                  v-if="formData.state == 1 && formData.user_ids.includes(userId)"
                  style="width:100%"
                  @change="upDateAudit"
                  v-model="scope.data.supplier_id" 
                  :placeholder="'请选择供应商'">
                </get-supplier-list>
                <span v-else>{{ scope.data.supplier_name }}</span>
              </template>
            </tr-table>
          </el-tab-pane>
        </el-tabs>
        <el-col :span="24" v-if="!!formData.relevances.length">
          <p style="font-size:12px;font-weight: 400;color: #999999;">关联审批单</p>
          <el-tag style="margin-right: 5px; cursor: pointer;"
              size="small"  @click="openWorkApply(item)" v-for="item in formData.relevances" :key="item.code" type="text">{{item.code}}</el-tag>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <image-file-upload
          :images="formData.thumbnail_imgs"
          :files="formData.files_list"
          :isEdit="formData.user_ids.indexOf(userId) === -1 ? false : true"
          :isShowBox="false"></image-file-upload>
      </el-row>
    </item-box-new>
      
    <el-dialog
      center
      title="选择资产"
      fullscreen
      :visible.sync="assetsVisible"
      append-to-body>
      <assets-classification @set-info="setAssetsInfo"></assets-classification>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span> -->
    </el-dialog>
    <el-dialog
      center
      title="选择物品"
      fullscreen
      :visible.sync="goodsVisible"
      append-to-body>
      <goods-classification @set-info="setGoodsInfo"></goods-classification>
      <!-- <span slot="footer" class="dialog-footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import itemBoxNew from "../component/item-box-new";
import titleBoxNew from "../component/title-box-new";
import imageFileUpload from "@/components/imageFileUpload/index";
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import assetsClassification from "../../launch-affair/component/all-box/fixed-form-body/component/assets-form/index"
import goodsClassification from "../../launch-affair/component/all-box/fixed-form-body/component/goods-form/index"
export default {
  name: "assets-purchase-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
    getDepartmentSelect,
    assetsClassification,
    goodsClassification,
    getSupplierList
  },
  data() {
    return {
      tableLoading: false,
      TableHeight: 500,
      assetsVisible: false,
      goodsVisible: false,
      selectedAssetsIds: [], //选中的资产id
      selectedGoodsIds: [], //选中的物品id
      formData: {
        flow_id:0,
        types: [],
        user_ids: [],
        purchase_assets: [],
        purchase_goods: [],
        relevances: [],
        img_list: [],
        files_list: [],
        thumbnail_imgs: [],
      },
      typeList: [
        {label: "固定资产", value: 1},
        {label: "物品", value: 2}
      ],

      activeName: 'second',
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
          width: "90",
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
          width: "90",
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

      departmentTree: []
    }
  },
  props: {
    userId: '',
    loading:{
      type: Boolean,
      default: false
    },
  },
  computed:{
    activeName2(){
      return this.formData.types.indexOf(1) != -1 ? 'first' : 'second'
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 处理数据
    setData() {
      if (this.formData.purchase_assets.length > 0) {
        this.activeName = "first"
        this.formData.purchase_assets.forEach((item,index) => {
          item.uuid = item.id + index.toString()
        })
      } else if (this.formData.purchase_goods.length > 0) {
        this.activeName = "second"
        this.formData.purchase_goods.forEach((item,index) => {
          item.uuid = item.id + index.toString()
        })
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
    outColor(state) {
      switch (state) {
        case 0:
          return '#00ccff'
          break;
        case 1:
          return '#F58A40'
          break;
        case 2:
          return '#0CB780'
          break;
        case 3:
          return '#F2260E'
          break;
        case 4:
          return '#999999'
          break;
      }
    },
    // 计算资产合计费用
    assetsTotalCost(index) {
      this.formData.purchase_assets[index].fee = this.formData.purchase_assets[index].price * this.formData.purchase_assets[index].count
      this.TotalCost()
    },
    // 计算物品合计费用
    goodsTotalCost(index) {
      this.formData.purchase_goods[index].fee = this.formData.purchase_goods[index].price * this.formData.purchase_goods[index].count
      this.TotalCost()
    },
    // 计算总费用
    TotalCost() {
      let info = [...this.formData.purchase_assets, ...this.formData.purchase_goods]
      this.formData.total_fee = info.reduce((pre, item) => {
        return pre + Number(item.fee)
      }, 0)
      this.upDateAudit()
    },
    // 添加资产
    setAssetsInfo(info) {
      // 给后续添加的数据 赋值上一份数据的  需要部门信息
      let need_dept = ''
      if (this.formData.purchase_assets.length > 0) {
        need_dept = this.formData.purchase_assets[this.formData.purchase_assets.length -1].need_dept
      }
      let arr = JSON.parse(JSON.stringify(info))
      arr.forEach(item => {
        item.need_dept = need_dept
      })
      // let arr = JSON.parse(JSON.stringify(info))
      // let ids = this.formData.purchase_assets.map(item => {return item.assets_type_id || item.id})
      // let formData = []
      // arr.forEach(zItem => {
      //   if(ids.indexOf(zItem.id) == -1) {
      //     formData.push(zItem)
      //   }
      // })
      this.formData.purchase_assets = [...this.formData.purchase_assets, ...arr]
      // 生产唯一id 
      this.formData.purchase_assets.forEach((item,index) => {
        item.uuid = item.id + index.toString()
      })
      this.assetsVisible = false
      this.upDateAudit()
    },
    // 添加物品
    setGoodsInfo(info) {
      // 给后续添加的数据 赋值上一份数据的  需要部门信息
      let need_dept = ''
      if (this.formData.purchase_goods.length > 0) {
        need_dept = this.formData.purchase_goods[this.formData.purchase_goods.length -1].need_dept
      }
      let arr = JSON.parse(JSON.stringify(info))
      arr.forEach(item => {
        item.need_dept = need_dept
      })
      // let arr = JSON.parse(JSON.stringify(info))
      // let ids = this.formData.purchase_goods.map(item => {return item.goods_id || item.id})
      // let formData = []
      // arr.forEach(zItem => {
      //   if(ids.indexOf(zItem.id) == -1) {
      //     formData.push(zItem)
      //   }
      // })
      this.formData.purchase_goods = [...this.formData.purchase_goods, ...arr]
      // 生产唯一id 
      this.formData.purchase_goods.forEach((item,index) => {
        item.uuid = item.id + index.toString()
      })
      this.goodsVisible = false
      this.upDateAudit()
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
      this.formData.purchase_assets.forEach(item => {
        if(this.selectedAssetsIds.indexOf(item.uuid) == -1) {
          arrData.push(item)
        }
      })
      this.formData.purchase_assets = arrData
      this.TotalCost()
      // this.upDateAudit()
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
      this.formData.purchase_goods.forEach(item => {
        if(this.selectedGoodsIds.indexOf(item.uuid) == -1) {
          arrData.push(item)
        }
      })
      this.formData.purchase_goods = arrData
      this.TotalCost()
      // this.upDateAudit()
    },
    // 采购类型选择
    changeSelectType(val) {
      if( this.formData.types.indexOf(1) === -1) this.formDataData.purchase_assets = []
      if( this.formData.types.indexOf(2) === -1) this.formData.purchase_goods = []
      this.TotalCost()
      this.upDateAudit()
    },
    // 更新信息
    upDateAudit() {
      if(this.formData.state == 1 && this.formData.user_ids.includes(this.userId)) {
        let params = {
          context: {
            form_data: {},
            step_data: null
          },
        }
        console.log('--------',JSON.parse(JSON.stringify(this.formData)));
        return
        params.context.form_data = Object.assign({}, this.formData)
        this.$client.EditRecordPurchase(params).then((req) => {})
      }
    },
    // 关联审批单跳转
    openWorkApply(item) {
      this.$router.push({
        path: `/news-details/${item.work_deal_id}/待办事项:${item.object_name}/${item.object_id}`
      })
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.assets-purchase-audit {
  .head-image {
    position: absolute
    top: 32px;
    right: 38px;
    img {
      height: 98px;
      width: 98px
    }
  }
  .head-content {
    position: relative
    width: 100%;
    p {
      font-size: 12px;
      font-weight: 400;
      margin-top: 15px
    }
  }
  .el-col {
    margin-bottom: 22px;
    p {
      font-family: Source Han Sans SC-Medium, Source Han Sans SC;
      font-size: 12px;
      font-weight: 400;
      color: #999999;
      margin-bottom: 6px
    }
    em, /deep/ .el-textarea__inner {
      font-size: 14px;
      font-weight: 500;
      color: #333333;
    }
  }
  .el-tabs{
    /deep/ .el-tabs__header{
      margin: 0;
    }

  }
  .richText {
    width: 100%;
    /deep/ {
      .el-textarea__inner {
        background-color: #fff; 
        border: none;
        cursor: auto;
        padding: 0;
      }
    }
  }
}
</style>

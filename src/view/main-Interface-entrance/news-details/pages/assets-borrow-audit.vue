<template>
  <div class="assets-borrow-audit" v-loading="loading">
    <div class="head-image">
      <img :src="require('../../launch-affair/component/tableData/img/zhang1.png')" v-if="formData.state === 2" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang2.png')" v-if="formData.state === 4" alt="">
      <img :src="require('../../launch-affair/component/tableData/img/zhang3.png')" v-if="formData.state === 3" alt="">
    </div>
    <title-box-new :title="formData.title">
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
          <p>领用类型</p>
          <em>{{formData.type_name}}</em>
        </el-col>
        <el-col :span="24">
          <p>申请事由</p>
          <!-- <em>{{formData.reason}}</em> -->
          <el-input autosize type="textarea" class="richText" disabled v-model="formData.reason"></el-input>
        </el-col>
      </el-row>
      <el-row class="image-box">
        <el-col :span="24" v-if="formData.types.indexOf(1) != -1">
          <div style="margin-bottom: 10px;">
            <span style="align-items: center; margin-right: 10px; color:#999999;">固定资产明细</span>
            <el-button size="mini" type="primary" @click="assetsVisible = true" v-if="false">添加资产</el-button>
            <el-button size="mini" type="danger" @click="deleteAssets" v-if="false">移除</el-button>
          </div>
          <tr-table
            ref="assetsTable"
            :data="formData.assets"
            :loading="tableLoading"
            :selectionShow="true"
            :TableHeight="TableHeight1"
            :isShowBottomOptions="false"
            :tableHeaderList="assetsCanRendererTableHeader"
            @on-select-change-row="selectedAssetsList">
            <template slot-scope="scope" slot="user_id">
              <el-select v-model="scope.data.user_id" placeholder="请选择使用人" clearable :disabled="true">
                <el-option
                  v-for="item in departmentUserList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </template>
          </tr-table>
        </el-col>
        <el-col :span="24" v-if="formData.types.indexOf(2) != -1">
          <div style="margin-bottom: 10px;">
            <span style="align-items: center; margin-right: 10px; color:#999999;">物品明细</span>
            <el-button size="mini" type="primary" @click="goodsVisible = true" v-if="false">添加物品</el-button>
            <el-button size="mini" type="danger" @click="deleteGoods" v-if="false">移除</el-button>
          </div>
          <tr-table
            ref="goodsTable"
            :data="formData.goods"
            :loading="loading"
            :selectionShow="true"
            :TableHeight="TableHeight2"
            :isShowBottomOptions="false"
            :tableHeaderList="goodsCanRendererTableHeader"
            @on-select-change-row="selectedGoodsList">
            <template slot-scope="scope" slot="use_count">
              <el-input-number style="width: 100%;" :min="0" :precision="0" :controls="false" v-model="scope.data.use_count" @change="assetsTotalCost(scope.index)" :disabled="true"></el-input-number>
            </template>
            <template slot-scope="scope" slot="total_fee">
              <el-input-number style="width: 100%;" disabled :min="0" :precision="2" :controls="false" v-model="scope.data.total_fee"></el-input-number>
            </template>
          </tr-table>
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
      
    <!-- 资产选择 -->
    <el-dialog
      center
      title="选择资产"
      fullscreen
      :visible.sync="assetsVisible"
      append-to-body>
      <assets-classification :curType="true" @set-info="setAssetsInfo"></assets-classification>
    
    </el-dialog>
    <!-- 物品选择 -->
    <el-dialog
      center
      title="选择物品"
      fullscreen
      :visible.sync="goodsVisible"
      append-to-body>
      <goods-classification @set-info="setGoodsInfo"></goods-classification>
    </el-dialog>
  </div>
</template>

<script type="text/ecmascript-6">
import titleBoxNew from "../component/title-box-new";
import itemBoxNew from "../component/item-box-new";
import imageFileUpload from "@/components/imageFileUpload/index";
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import assetsClassification from "../../launch-affair/component/all-box/fixed-form-body/component/assets-form/index"
import goodsClassification from "../../launch-affair/component/all-box/fixed-form-body/component/goods-form/index"

export default {
  name: "assets-borrow-audit",
  components: {
    itemBoxNew,
    titleBoxNew,
    imageFileUpload,
    assetsClassification,
    goodsClassification,
    getDepartmentSelect,
  },
  data() {
    return {
      tableLoading: false,
      TableHeight1: 200,
      TableHeight2: 200,
      assetsVisible: false,
      goodsVisible: false,
      selectedAssetsIds: [], //选中的资产id
      selectedGoodsIds: [], //选中的物品id
      departmentUserList: [],
      formData: {
        flow_id:0,
        types: [],
        user_ids: [],
        assets: [],
        img_list: [],
        files_list: [],
        thumbnail_imgs: [],
        goods: [],
        type: 1
      },
      typeList: [
        {label: "固定资产", value: 1},
        {label: "物品", value: 2}
      ],
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
          prop: "user_name",
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
    }
  },
  props: {
    userId: '',
    loading:{
      type: Boolean,
      default: false
    },
  },
  created() {
    // 监听审批详情审批后的消息
    eventOn.$on('update-upcoming-matter', () => {
      this.countHeight1()
      this.countHeight2()
    })
  },
  methods: {
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
      let ids = this.formData.assets.map(item => {return item.assets_id || item.id})
      let form = []
      arr.forEach(zItem => {
        if(ids.indexOf(zItem.id) == -1) {
          zItem.assets_id = zItem.id
          zItem.price = zItem.fee
          form.push(zItem)
        }
      })
      this.formData.assets = [...this.formData.assets, ...form]
      this.assetsVisible = false
      this.upDateAudit()
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
      let ids = this.formData.goods.map(item => {return item.goods_id || item.id})
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
      this.formData.goods = [...this.formData.goods, ...form]
      this.goodsVisible = false
      this.upDateAudit()
      this.countHeight2()
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
      this.formData.assets.forEach(item => {
        if(this.selectedAssetsIds.indexOf(item.id) == -1) {
          arrData.push(item)
        }
      })
      this.formData.assets = arrData
      this.upDateAudit()
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
      this.formData.goods.forEach(item => {
        if(this.selectedGoodsIds.indexOf(item.id) == -1) {
          arrData.push(item)
        }
      })
      this.formData.goods = arrData
      this.upDateAudit()
      this.countHeight2()
    },
    // 计算总价值
    assetsTotalCost(index) {
      this.formData.goods[index].total_fee = this.formData.goods[index].price * this.formData.goods[index].use_count
    },
    // 采购类型选择
    changeSelectType(val) {
      if( this.form.types.indexOf(1) === -1) this.formData.assets = []
      if( this.form.types.indexOf(2) === -1) this.formData.goods = []
      // console.log('采购类型改变' + val, typeof(val), this.form.types, this.form);
    },
    // 更新信息
    upDateAudit() {
      if(this.formData.state == 1 && this.formData.user_ids.includes(this.userId)) {
        let params = {
          context: {},
        }
        params.context= Object.assign({}, this.formData)
        this.$client.UpdateErpReceive(params).then((req) => {})
      }
    },
    // 计算表格高度
    countHeight1() {
      if (this.formData.assets.length === 0) {
        this.TableHeight1 = 200
      } else {
        this.TableHeight1 = this.formData.assets.length * 32 + 100
      }
    },
    // 计算表格高度
    countHeight2() {
      if (this.formData.goods.length === 0) {
        this.TableHeight2 = 200
      } else {
        this.TableHeight2 = this.formData.goods.length * 32 + 100
      }
    },
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.assets-borrow-audit {
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

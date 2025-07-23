<template>
  <el-dialog
    :title="title"
    top="10px"
    width="930px"
    :visible="dialogBool"
    :before-close="dialogClose">
    <div class="dialog-div">
      <el-form :model="form" :rules="basicRules" label-width="100px" ref="form" size="mini">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="入库方式:" prop="type">
              <el-select v-model="form.type" :disabled="curEventType == 'check'" placeholder="请选择入库方式">
                <el-option
                  v-for="item in stoOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库操作人:" prop="user_id">
              <get-department-select
                ref="personalTree"
                v-model="form.user_id"
                :isShowCheckbox="false"
                :placeholder="'请选择入库操作人'"
                :isContainEmp="true"
                :show_all="true"
                :isExportMultiple="false"
                :disabled="true"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作人部门:" prop="dept_id">
              <get-department-select
                ref="departmentlTree"
                v-model="form.dept_id"
                :width="'220'"
                :isShowCheckbox="false"
                :placeholder="'请选择操作人部门'"
                :isContainEmp="false"
                :isExportMultiple="false"
                :disabled="true"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="入库日期:" prop="enter_date">
              <el-date-picker
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="选择日期"
              v-model="form.enter_date"
              :disabled="curEventType == 'check'"
              style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="关联采购单:" prop="purchase_id">
              <el-select v-model="form.purchase_id" filterable placeholder="请选择采购申请单" :disabled="curEventType == 'check'" @change="setApplicantInfo">
                <el-option
                  v-for="item in purOptions"
                  :key="item.id"
                  :label="item.flow_code"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购申请人:" prop="purchase_user">
              <get-department-select
                ref="personalsTree"
                v-model="form.purchase_user"
                :isShowCheckbox="false"
                :placeholder="'请选择采购申请人'"
                :isContainEmp="true"
                :show_all="true"
                :isExportMultiple="false"
                :disabled="true"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="采购申请部门:" prop="purchase_dept">
              <get-department-select
                ref="departmentlsTree"
                v-model="form.purchase_dept"
                :width="'220'"
                :isShowCheckbox="false"
                :placeholder="'请选择采购申请部门'"
                :isContainEmp="false"
                :isExportMultiple="false"
                :disabled="true"
              ></get-department-select>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="备注:" prop="name">
              <el-input v-model="form.remark" placeholder="请输入备注" clearable :disabled="curEventType == 'check'"></el-input>
            </el-form-item>
          </el-col>
          <div>
            <div style="margin-bottom: 10px;">
              <span style="align-items: center; margin-right: 10px; color:#999999;">固定资产明细</span>
              <el-button size="mini" type="primary" @click="assetsVisible = true"  v-if="curEventType != 'check'">添加资产</el-button>
              <el-button size="mini" type="danger" @click="deleteAssets"  v-if="curEventType != 'check'">移除</el-button>
            </div>
            <tr-table
              ref="assetsTable"
              :data="form.assets_Create"
              :loading="loading"
              :selectionShow="true"
              :TableHeight="TableHeight"
              :isShowBottomOptions="false"
              :tableHeaderList="assetsCanRendererTableHeader"
              on-select-change-row="selectedAssetsList"
              @on-select-change-row="selectedAssetsList">
              <template slot-scope="scope" slot="price">
                <el-input-number style="width: 100%;" :min="0" :precision="2" :controls="false" v-model="scope.data.price" :disabled="curEventType == 'check'" @change="assetsTotalCost(scope.index)"></el-input-number>
              </template>
              <template slot-scope="scope" slot="count">
                <el-input-number style="width: 100%;" :min="0" :controls="false" v-model="scope.data.count" :disabled="curEventType == 'check'" @change="assetsTotalCost(scope.index)"></el-input-number>
              </template>
              <template slot-scope="scope" slot="fee">
                <el-input-number style="width: 100%;" :min="0" :precision="2" :disabled="curEventType == 'check'" :controls="false" v-model="scope.data.fee"></el-input-number>
              </template>
              <template slot-scope="scope" slot="address">
                <el-input v-model="scope.data.address" :disabled="curEventType == 'check'" placeholder="请输入存放位置" clearable></el-input>
              </template>
              <template slot-scope="scope" slot="remark">
                <el-input v-model="scope.data.remark" :disabled="curEventType == 'check'" placeholder="请输入备注" clearable></el-input>
              </template>
              <template slot-scope="scope" slot="supplier_name">
                <get-supplier-list 
                  :disabled="curEventType == 'check'"
                  style="width:100%"
                  v-model="scope.data.supplier_id" 
                  :placeholder="'请选择供应商'">
                </get-supplier-list>
              </template>
            </tr-table>
            <!-- <el-pagination
              style="margin: 5px 0;display:flex; justify-content: flex-end;"
              ref="paginationH"
              :current-page="assetsInfo.assetsIndex"
              :page-sizes="[10, 20, 30, 40, 50, 100]"
              :page-size="assetsInfo.assetsSize"
              layout="total,sizes, prev, pager, next, jumper"
              :total="assetsInfo.assetsCount">
            </el-pagination> -->
          </div>
          <div>
            <div style="margin: 10px 0;">
              <span style="align-items: center; margin-right: 10px; color:#999999;">物品明细</span>
              <el-button size="mini" type="primary" @click="goodsVisible = true"  v-if="curEventType != 'check'">添加物品</el-button>
              <el-button size="mini" type="danger" @click="deleteGoods"  v-if="curEventType != 'check'">移除</el-button>
            </div>
            <tr-table
              ref="assetsTable"
              :data="form.goods_Create"
              :loading="loading"
              :selectionShow="true"
              :TableHeight="TableHeight"
              :isShowBottomOptions="false"
              :tableHeaderList="goodsCanRendererTableHeader"
              @on-select-change-row="selectedGoodsList">
              <template slot-scope="scope" slot="price">
                <el-input-number style="width: 100%;" :disabled="curEventType == 'check'" :min="0" :precision="2" :controls="false" v-model="scope.data.price" @change="goodsTotalCost(scope.index)"></el-input-number>
              </template>
              <template slot-scope="scope" slot="count">
                <el-input-number style="width: 100%;" :disabled="curEventType == 'check'" :min="0" :controls="false" v-model="scope.data.count" @change="goodsTotalCost(scope.index)"></el-input-number>
              </template>
              <template slot-scope="scope" slot="fee">
                <el-input-number style="width: 100%;" :disabled="curEventType == 'check'" :min="0" :precision="2" :controls="false" v-model="scope.data.fee"></el-input-number>
              </template>
              <!-- <template slot-scope="scope" slot="address">
                <el-input v-model="scope.data.address" :disabled="curEventType == 'check'" placeholder="请输入存放位置" clearable></el-input>
              </template> -->
              <template slot-scope="scope" slot="remark">
                <el-input v-model="scope.data.remark" :disabled="curEventType == 'check'" placeholder="请输入备注" clearable></el-input>
              </template>
              <template slot-scope="scope" slot="supplier_name">
                <get-supplier-list 
                  :disabled="curEventType == 'check'"
                  style="width:100%"
                  v-model="scope.data.supplier_id" 
                  :placeholder="'请选择供应商'">
                </get-supplier-list>
              </template>
            </tr-table>
            <!-- <el-pagination
              style="margin: 5px 0;display:flex; justify-content: flex-end;"
              ref="paginationH"
              :current-page="goodsInfo.goodsIndex"
              :page-sizes="[10, 20, 30, 40, 50, 100]"
              :page-size="goodsInfo.goodsSize"
              layout="total,sizes, prev, pager, next, jumper"
              :total="goodsInfo.goodsCount">
            </el-pagination> -->
          </div>
        </el-row>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose" size="mini">取 消</el-button>
      <el-button type="primary" size="mini" v-if="curEventType!='check'" @click="saveOnSubmit">保 存</el-button>
    </span>
    <div class="dialog-box">
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
  </el-dialog>
</template>

<script type="text/ecmascript-6">
import assetsClassification from "./assets-form/index"
import goodsClassification from "./goods-form/index"
import getDepartmentSelect from "@/components/base/formModel/tree/get-department-select-tree";
import getSupplierList from "@/components/base/formModel/select/get-supplier-list";
import { getUser } from '@/utils/auth';
import { formatTime, deepCopy } from '@/utils/index';
export default {
  components: {
    assetsClassification,
    goodsClassification,
    getDepartmentSelect,
    getSupplierList
  },
  props: {
    dialogBool: Boolean,
    curEventType: {
      type: String,
      default: 'add'
    },
  },
  data() {
    return {
      title: '添加入库单',
      assetsInfo: {
        assetsIndex: 1,
        assetsSize: 10,
        assetsCount: 0,
      },
      goodsInfo: {
        goodsIndex: 1,
        goodsSize: 10,
        goodsCount: 0,
      },
      form: {
        id: '',
        type: '',
        user_id: '',
        dept_id: '',
        enter_date: '',
        purchase_id: '',
        purchase_user: '',
        purchase_dept: '',
        remark: '',
        assets_Create: [],
        goods_Create: [],
      },
      loading: false,
      TableHeight: 300,
      purOptions: [],
      assetsVisible: false,
      goodsVisible: false,
      selectedAssetsIds: [], //选中的资产id
      selectedGoodsIds: [], //选中的物品id
      stoOptions: [
        {value: 1, label: '管理员入库'},
        {value: 2, label: '采购单入库'},
      ],
      basicRules: {
        type: [
          {
            required: true,
            message: "请选择入库方式",
            trigger: "change",
          },
        ],
        user_id: [
          {
            required: true,
            message: "请选择操作人",
            trigger: "change",
          },
        ],
        dept_id: [
          {
            required: true,
            message: "请选择操作人部门",
            trigger: "change",
          },
        ],
        enter_date: [
          {
            required: true,
            message: "请选择入库日期",
            trigger: "change",
          },
        ],
      },
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
          label: "资产单价(元)",
          prop: "price",
          width: "130",
          align: "center",
          signIndex: 3,
          sortable: false,
        },
        {
          id: 5,
          label: "入库数量",
          prop: "count",
          width: "130",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "合计费用",
          prop: "fee",
          width: "130",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 10,
          label: "供应商",
          prop: "supplier_name",
          width: "130",
          align: "center",
          signIndex: 9,
          sortable: false,
        },
        {
          id: 7,
          label: "存放位置",
          prop: "address",
          width: "130",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "备注",
          prop: "remark",
          width: "130",
          align: "center",
          signIndex: 7,
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
          id: 11,
          label: "品牌",
          prop: "brand",
          width: "130",
          align: "center",
          signIndex: 10,
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
          label: "采购单价(元)",
          prop: "price",
          width: "150",
          align: "center",
          signIndex: 4,
          sortable: false,
        },
        {
          id: 6,
          label: "入库数量",
          prop: "count",
          width: "170",
          align: "center",
          signIndex: 5,
          sortable: false,
        },
        {
          id: 7,
          label: "库存数量",
          prop: "surplus_count",
          width: "150",
          align: "center",
          signIndex: 6,
          sortable: false,
        },
        {
          id: 8,
          label: "合计费用",
          prop: "fee",
          width: "170",
          align: "center",
          signIndex: 7,
          sortable: false,
        },
        {
          id: 12,
          label: "供应商",
          prop: "supplier_name",
          width: "130",
          align: "center",
          signIndex: 11,
          sortable: false,
        },
        {
          id: 9,
          label: "存放位置",
          prop: "address",
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
    }
  },
  watch: {
    dialogBool(bool) {
      if(bool) {
        this.form.enter_date = formatTime(new Date())
        this.getAssetsOrder()
        this.setConfigTitle()
        this.$nextTick(() => {
          if (getUser() && this.curEventType == 'add') {
            let userInfo = JSON.parse(getUser());
            this.form.user_id = userInfo.user_id
            this.form.dept_id = userInfo.department_id
          }
          this.$refs.form.clearValidate();
        })
      }else {
        this.$refs.personalTree.onClear();
        this.$refs.departmentlTree.onClear();
        this.$refs.personalsTree.onClear();
        this.$refs.departmentlsTree.onClear();
        Object.assign(this.$data, this.$options.data());
        this.$refs.form.clearValidate();
      }
    }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    setConfigTitle() {
      switch (this.curEventType) {
        case 'add':
          this.title = '添加入库单'
          break;
        case 'edit':
          this.title = '编辑入库单'
          break;
        case 'check':
          this.title = '查看入库单'
          break;
      }
    },
    // 获取资产采购单
    getAssetsOrder() {
      let params = {};
      params.page_index = 1;
      params.page_size = 100;
      this.$client.GetByPagePurchase(params)
      .then(res => {
        if (res.head.result === "200") {
          this.purOptions = []
          if(res.context && res.context.length) {
            res.context.forEach(item => {
              if(this.curEventType == 'add') {
                if(!item.is_enter) this.purOptions.push(item)
              }else {
                this.purOptions.push(item)
              }
            })
          } 
        } else {
          this.$message({
            showClose: true,
            message: res.head.describle,
            type: "error",
          });
        };  
      })
    },
    // 设置申请人信息
    setApplicantInfo(val) {
      this.purOptions.forEach(item => {
        if(item.id == val) {
          this.form.purchase_user = item.user_id
          this.form.purchase_dept = item.dept_id
          this.form.assets_Create = JSON.parse(JSON.stringify(item.purchase_assets))
          this.form.goods_Create = JSON.parse(JSON.stringify(item.purchase_goods))
        } 
      })
      
    },
    // 添加资产
    setAssetsInfo(info) {
      let arr = JSON.parse(JSON.stringify(info))
      let ids = this.form.assets_Create.map(item => {return item.id})
      let form = []
      arr.forEach(zItem => {
        if(ids.indexOf(zItem.id) == -1) {
          form.push(zItem)
        }
      })
      this.form.assets_Create = [...this.form.assets_Create, ...form]
      this.assetsVisible = false
    },
    // 添加物品
    setGoodsInfo(info) {
      let arr = JSON.parse(JSON.stringify(info))
      let ids = this.form.goods_Create.map(item => {return item.id})
      let form = []
      arr.forEach(zItem => {
        if(ids.indexOf(zItem.id) == -1) {
          form.push(zItem)
        }
      })
      this.form.goods_Create = [...this.form.goods_Create, ...form]
      this.goodsVisible = false
    },
    // 计算资产合计费用
    assetsTotalCost(index) {
      this.form.assets_Create[index].fee = this.form.assets_Create[index].price * this.form.assets_Create[index].count 
    },
    // 计算物品合计费用
    goodsTotalCost(index) {
      this.form.goods_Create[index].fee = this.form.goods_Create[index].price * this.form.goods_Create[index].count
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
      this.form.assets_Create.forEach(item => {
        if(this.selectedAssetsIds.indexOf(item.id) == -1) {
          arrData.push(item)
        }
      })
      this.form.assets_Create = arrData
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
      this.form.goods_Create.forEach(item => {
        if(this.selectedGoodsIds.indexOf(item.id) == -1) {
          arrData.push(item)
        }
      })
      this.form.goods_Create = arrData
    },
    // 保存
    saveOnSubmit() {
      if(!this.form.assets_Create.length && !this.form.goods_Create.length) {
        this.$message({
          showClose: true,
          message: '您未添加入库资产或物品，请检查。',
          type: "error",
        });
        return
      }
      let isAssets = false, isGoods = false
      this.form.assets_Create.forEach(item => {
        if(!item.address || !item.count) isAssets = true
      })
      if(isAssets) {
        this.$message({
          showClose: true,
          message: '请您检查资产明细中入库数量、存放位置、未填写完整。',
          type: "error",
        });
        return
      }
      this.form.goods_Create.forEach(item => {
        if(!item.count) isAssets = true
      })
      if(isGoods) {
        this.$message({
          showClose: true,
          message: '请您检查物品明细中入库数量、未填写完整。',
          type: "error",
        });
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          let info = {...this.form};
          this.$emit("save-add-edit", info);
        } else {
          return false;
        }
      });
    },
    // 回显
    setData(form) {
      setTimeout(() => {
        for (let key in this.form) {
          this.form[key] = form[key];
        }
        this.form.assets_Create = form.enter_asssets
        this.form.goods_Create = form.enter_goods
      }, 30);
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>
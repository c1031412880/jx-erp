<template>
  <div class="get-vehicle-select-dialog">
    <el-input
      clearable
      slot="reference"
      size="mini"
      @clear="onClear"
      :placeholder="placeholder"
      prefix-icon="el-icon-search"
      :disabled="disabled"
      :value="input_names" class="popover-input-box"
      @focus="openSelectVehiclePop">
    </el-input>
    <el-dialog
      title="选择车辆"
      :show-close="true"
      :visible.sync="isShowSelectVehiclePop"
      width="760px"
      >
      <div class="el-dialog-div show-flex-box-r">
        <el-card class="box-card left-box">
          <div slot="header" class="clearfix">
            <span>车辆树</span>
          </div>
          <div style="height: 520px">
            <div class="get-vehicle-tree" style="width: 100%;height: 100%;">
              <div class="search-input-content show-flex-box-r" style="align-items: center;">
              <el-input
                  ref="inputSearch"
                  size="mini"
                  :placeholder="form.type == 0? '请输入车牌号':form.type == 1?'请输入自编号':'请输入车牌号或自编号'"
                  prefix-icon="el-icon-search"
                  v-model="valSelect">
                </el-input>
                <i class="show-flex-box-r show-flex-center" style="margin-left: 10px;cursor: pointer; width: 16px;height: 16px;flex-shrink: 0;" @click="loadData('refresh')">
                  <img src="@/assets/components/refresh.png" alt="" style="flex-shrink: 0; height: 13px;width: 13px;object-fit: cover;">
                </i>
                <i class="show-flex-box-r show-flex-center" style="margin-left: 10px;cursor: pointer; width: 16px;height: 16px;flex-shrink: 0;" @click="isDefaultExpandAll = false" v-if="isDefaultExpandAll">
                  <img src="@/assets/components/reduce.png" alt="" style="flex-shrink: 0; height: 13px;width: 13px;object-fit: cover;">
                </i>
                <i class="show-flex-box-r show-flex-center" style="margin-left: 10px;cursor: pointer; width: 16px;height: 16px;flex-shrink: 0;" @click="isDefaultExpandAll = true" v-else>
                  <img src="@/assets/components/add.png" alt="" style="flex-shrink: 0; height: 13px;width: 13px;object-fit: cover;"></i>
              </div>
              
              <!-- check-strictly 子父节点不相关 -->
              <el-tree
                ref="tree"
                v-loading="loading"
                :default-expand-all="isDefaultExpandAll"
                :show-checkbox="isShowCheckbox"
                :highlight-current="true"
                :check-on-click-node="isShowCheckbox"
                :check-strictly="false"
                :expand-on-click-node="true"
                :data="data"
                node-key="i_id"
                :props="defaultProps"
                :filter-node-method="filterNode"
                @node-click="handleNodeClick"
                @check-change="onCheck"
                style="margin-top: 20px;width: 100%;height: 400px;overflow: auto;"
              >
                <div class="custom-tree-node show-flex-box-r" slot-scope="{ node, data }">
                  <span class="show-flex-box-r" style="align-items: center;">
                    <!-- <i style="margin-right: 5px; color:#409EFF" :class="data.type == 1 ? 'el-icon-office-building' : data.type == 2 ? 'el-icon-s-unfold': 'el-icon-truck'"></i> -->
                    <i class="show-flex-box-r" style="margin-right: 5px; width: 13px;height: 13px;flex-shrink: 0;">
                      <img src="@/assets/components/org.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 1">
                      <img src="@/assets/components/line.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 2">
                      <img src="@/assets/components/car.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;" v-if="data.type == 3">
                    </i>
                    <span style="margin-right: 25px; margin-bottom: 3px;">{{node.label}}</span>
                  </span>
                </div>
              </el-tree>
            </div>
          </div>
          
        </el-card>
        <el-card class="box-card center-box" ref="centerBox">
          <div slot="header" class="clearfix">
            <span>已选车辆({{vehicleList.length}}/{{vehicleTotalNum}})</span>
            <el-button style="float: right; padding: 6px 0" type="text" @click="onVehicleClear">清空</el-button>
          </div>
          <ul style="width: 100%;height: 450px;overflow: auto">
            <li class="search-input-content" style="width: 100%;display: flex;margin-bottom: 5px; align-items: center;" v-for="(item,index) in vehicleList" :key="index">
              <div style="flex: 1;line-height: 25px;">{{item.c_name}}</div>
              <i class="show-flex-box-r" style="cursor: pointer; width: 18px;height: 18px;flex-shrink: 0;margin-right: 8px;" @click="clearList(item,index)">
                <img src="@/assets/components/del.png" alt="" style="flex-shrink: 0; height: 100%;width: 100%;object-fit: cover;">
              </i>
              <i></i>
            </li>
          </ul>
        </el-card>
      </div>
      <span slot="footer" class="dialog-footer show-flex-box-r">
        <el-form :inline="true" size="mini">
          <el-row>
            <el-form-item label="车辆筛选:">
              <el-select v-model="form.type" placeholder="请选择" style="width: 140px">
                <el-option
                  v-for="item in vehicleTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item >
              <tr-select-dictionaries v-model="form.oil_type" :classKey="'燃料类别'" :placeholder="'燃料类型'" style="width: 140px"></tr-select-dictionaries>
              </el-form-item>
            <el-form-item>
              <el-select v-model="form.kind_id" clearable filterable placeholder="车辆型号" style="width: 160px">
                <el-option
                  v-for="item in carNameOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-button @click="closeDialog()" size="mini" style="margin-left: 30px;">取 消</el-button>
            <el-button type="primary" @click="sureSelectVehicle()" size="mini">确 定</el-button>
          </el-row>
        </el-form>
      </span>
    </el-dialog>

  </div>
  
</template>

<script type="text/ecmascript-6">

  export default {
    name: "get-vehicle-select-dialog",
    components: {},
    props: {
      value: {},
      placeholder: [String],
      isShowCheckbox:{
        type: Boolean,
        default: false
      },
      disabled:{
        type: Boolean,
        default: false
      },
      isExportMultiple: {
        type: Boolean,
        default: true
      },
      isSort: {
        type: Boolean,
        default: false
      }, // 是否需要根据点击排序
      vehicleType: {
        type: Number,
        default: 0
      }, 
    },
    watch:{
      value(newVal, oldVal) {
        this.id = newVal
        if (!newVal || newVal.length == 0) {
          this.input_names = ''
          if(this.$refs.tree) this.$refs.tree.setCheckedKeys([]);
        }
      },
      valSelect(val) {
        if(val) {
          this.$refs.tree.filter(val);
        }else {
          this.allExpanded(false)
        }
      },
      // visible(vaule) {
      //   if(vaule) {
      //     this.$nextTick(() => {
      //       this.$refs.tree.inputFocus()
      //     })
      //   }
      // },
      form:{
        deep:true,
        handler:function(newV,oldV) {
          this.loadData();
          this.onVehicleClear();
        }
      },
      isDefaultExpandAll() {
        this.loading = true
        this.allExpanded(this.isDefaultExpandAll)
        setTimeout(() =>{
          this.loading = false
        },300)
      },
      isShowSelectVehiclePop() {
        if(!this.isShowSelectVehiclePop) {
          this.valSelect = '';
          this.isDefaultExpandAll = false
        }else {      
          this.$nextTick(() => {
            this.$refs.inputSearch.focus()
          })
        }
      }
    },
    data() {
      return {
        loading: false,
        isDefaultExpandAll: false,
        valSelect: "",
        vehicleTypeOptions: [{
          value: 0,
          label: '显示车牌号'
        }, {
          value: 1,
          label: '显示自编号'
        }, {
          value: 2,
          label: '自编号（车牌号）'
        }],
        carNameOptions:[],
        defaultProps: {
          children: "children",
          label: "c_name",
        },
        defaultKeys:[],
        notTypeKey:[],
        data:[], // 车辆树
        vehicleTotalNum:0,
        id: '',
        input_names: '',
        form:{
          type: 0,
          oil_type:'',
          kind_id:''
        },
        vehicleList:[],
        isShowSelectVehiclePop: false
      }
    },
    created() {
      this.form.type = this.vehicleType
      this.loadData();
    },
    mounted() {
      this.id = this.value
    },
    methods: {
      // 咱开或收起树节点
      allExpanded(isCanGo){
        // 展开还是收起
        var treeNodeList = this.$refs.tree.store._getAllNodes();
        
        for (var i = 0; i < treeNodeList.length; i++) {
          treeNodeList[i].expanded = isCanGo;
        }
      },
      // 打开选择车辆弹窗
      openSelectVehiclePop() {
        this.isShowSelectVehiclePop = true
        // 获取车辆型号信息
        this.reqCmDataInfo();
      },
      reqCmDataInfo() {
        this.carNameOptions = []
        this.$client.GetCarModelVehicleManager({}).then(req => {
          if (req.head.result === '200') {
            this.carNameOptions = req.context.list
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
      // 获取车辆树数据
      loadData(type) {
        this.data = []
        this.loading = true;
        this.$client.GetNewVehicleTreeDataBase(this.$outFormData(this.form)).then((res) => {
          if (res.head.result === "200") {
            this.loading = false;
            this.data = res.context.Item2;
            this.vehicleTotalNum = res.context.Item1 || 0;
            if(!!this.data && this.data.length){
              this.defaultKeys.push(this.data[0].i_id)
            }
            if(type == 'refresh') {
              let ids = this.vehicleList.map(item => item.i_id)
              this.$refs.tree.setCheckedKeys(ids);
            }else{
              this.$refs.tree.setCheckedKeys([]);
            }
            this.isDefaultExpandAll = false
          }
        })
        .catch((err) => {
          // this.data = [];
          this.loading = false;
        });
      },
      // 数据筛选
      filterNode(value, data) {
        if (!value) {return true};
        return !!data.c_name && data.c_name.indexOf(value) !== -1
      },
      // 节点点击事件
      handleNodeClick(data) {
        if(!this.isShowCheckbox) {
          if (data.type === 3) {
            this.$emit('input', data.i_id)
            this.$emit("on-check", [data.i_id],[data]);
            // this.outNodesName()
          }
        }
      },
       // 节点多选事件
      onCheck() {
        if(this.isShowCheckbox) {
          let curSelectNode = this.$refs.tree.getCheckedNodes();
          let nodes = []
          // let keys = []
          // let names = []
          if (this.isSort) {
            if (this.vehicleList.length == 0 || this.vehicleList.length > curSelectNode.length) {
              this.notTypeKey = []
              nodes = []
              for(let i = 0;i<curSelectNode.length;i++) {
                let item = curSelectNode[i]
                if (item.type === 3) {
                  nodes.push(item)
                } else {
                  this.notTypeKey.push(item.i_id)
                }
              }
              this.vehicleList = [...nodes]
            } else {
              this.notTypeKey = []
              nodes = []
              let ids = this.vehicleList.map(item => item.i_id)
              curSelectNode.forEach(item =>{
                if (item.type === 3) {
                  if (ids.indexOf(item.i_id) == -1) {
                    this.vehicleList.push(item)
                  }
                }else {
                  this.notTypeKey.push(item.i_id)
                }
              })
            }
          } else {
            this.notTypeKey = []
            for(let i = 0;i<curSelectNode.length;i++) {
              let item = curSelectNode[i]
              if (item.type === 3) {
                nodes.push(item)
                // keys.push(item.i_id)
                // names.push(item.c_name)
              } else {
                this.notTypeKey.push(item.i_id)
              }
            }
            // this.$emit('input', keys)
            // this.$emit("on-check", keys, [...nodes]);
            // this.outNodesName()
            this.vehicleList = [...nodes]
            // this.inputNames(names)
          }
        }
      },
      inputNames(names) {
        this.input_names = names.toString()
      },
      vehicleCheck(node) {
        let nodes = []
        let vehs = []
        let names = []
        node.forEach(item => {
          if (item.type === 3) {
            nodes.push(item)
            vehs.push(item.i_id)
            names.push(item.c_name)
          }
        })
        this.input_names = names.toString()
        if(this.isExportMultiple) {
          this.$emit('input', vehs)
        }
        this.$emit('on-change', vehs, nodes)
      },
      // 清空
      onVehicleClear() {
        this.id = []
        // this.$refs.tree.setCheckedkeys(this.id)
        this.vehicleList = []
        if (this.$refs.tree) {
          this.$refs.tree.setCheckedKeys([]);
        }
      },
      clearList(item,index) {
        this.vehicleList.splice(index,1)
        let ids = this.vehicleList.map(item => item.i_id)
        this.$refs.tree.setCheckedKeys(ids);
      },
      // input返回
      setInput(val) {
        this.onVehicleClear()
        this.$emit('input', val)
      },
      onClear() {
        this.input_names = ''
        this.id = this.isExportMultiple ? [] : ''
        this.setInput(this.isExportMultiple ? [] : '')
      },
      // 关闭弹窗
      closeDialog() {
        this.isShowSelectVehiclePop = false
        this.setInput([])
      },
      // 确定选择车辆
      sureSelectVehicle() {
        if(this.isShowCheckbox) {
          let curSelectNode = this.$refs.tree.getCheckedNodes();
          let nodes = []
          let keys = []
          let names = []
          for(let i = 0;i<curSelectNode.length;i++) {
            let item = curSelectNode[i]
            if (item.type === 3) {
              nodes.push(item)
              keys.push(item.i_id)
              names.push(item.c_name)
            } 
          }
          this.$emit('input', keys)
          this.$emit("on-check", keys, [...nodes]);
          this.inputNames(names)
          this.isShowSelectVehiclePop = false
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  .el-dialog__wrapper /deep/ .el-dialog__body {
    padding: 10px 20px;
  }
  .el-dialog__wrapper /deep/ .el-dialog__header {
    padding: 10px 20px;
  }
  .el-dialog-div /deep/ .el-card__body {
    padding: 10px 20px;
  }
  .popover-input-box{
    // width 300px
  }

  .el-dialog-div {
    width: 100%;
    height: 520px;

    .box-card {
      height: 100%;
    }

    .left-box {
      // flex: 0 0 23vw;
      margin: 0 5px 0 0;
      min-width: 380px;
      height: 100%;
    }

    .center-box {
      flex: 1;
      height: 100%;
    }
  }
  .el-dialog-div /deep/ .el-card__header {
      background: #F5F5F5 !important;
      padding: 7px 20px;
    }

  .search-input-content>i>img:hover {
    transform: scale(1.05)
  }

</style>

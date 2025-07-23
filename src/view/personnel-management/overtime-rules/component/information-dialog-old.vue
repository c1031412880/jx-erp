<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="980px"
    top="60px"
  >
    <div class="el-dialog-div" >
      <el-form :model="form" :rules="basicRules" ref="form" label-width="140px" size="mini">
        <el-form-item label="规则名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入规则名称"></el-input>
        </el-form-item>
        <el-form-item label="应用考勤组:" prop="group_name">
          <el-input v-model="form.group_name" placeholder="请输入应用考勤组" disabled></el-input>
        </el-form-item>
        <el-tabs v-model="form.type" @tab-click="handleClick">
          <el-tab-pane :label="zItem.label" :name="zItem.type" v-for="(zItem,zIndex) in form.types" :key="zIndex">
          <div v-if="zItem.type == '3'" style="font-size:12px; color: #909399; margin-bottom: 8px;">注：节假日指节日当天（如5月1日、10月1日等）</div>
            <el-form-item label="允许加班:" prop="">
              <el-switch
                v-model="zItem.is_allow"
                active-color="#409EFF"
                inactive-color="#ff4949"
                :active-value="1" :inactive-value="2">
              </el-switch>
            </el-form-item>
            <el-form-item label="允许加班:" prop="">
              <span>按审批时长计算</span>
            </el-form-item>
            <el-form-item label="加班费计算规则:" prop="">
              <span>计为加班费</span>
            </el-form-item>
            <el-form-item label="加班时长:" prop="">
              <ul class="show-flex-box-c" v-if="zItem.fees.length > 0">
                <li class="show-flex-box-r" style="align-items: center; margin-bottom: 15px;" v-for="(item,index) in zItem.fees" :key="index">
                  <div class="show-flex-box-r" style="align-items: center;margin-right:10px">
                    <span>加班时间大于等于&nbsp;</span>
                    <el-input v-model="item.min" placeholder="" style="width:135px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.min = $event.target.value" size="mini"> <template slot="append">小时</template> </el-input>

                    <span v-if="index+1 < zItem.fees.length">
                      <span>&nbsp;，小于&nbsp;</span>
                      <el-input v-model="item.max" placeholder="" style="width:135px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.max = $event.target.value" size="mini"> <template slot="append">小时</template> </el-input>
                      <span>&nbsp;，按每小时&nbsp;</span>
                    </span>
                    <span v-if=" index+1 == zItem.fees.length">，按&nbsp;</span>
                    <el-input v-model="item.value" placeholder="" style="width:140px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.value= $event.target.value" size="mini"> <template slot="append">元</template> </el-input> 
                    
                  </div>
                  <span class="show-flex-box-r" v-if="index+1 < zItem.fees.length">
                    <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addProportionSetList(zItem)" v-if="index == zItem.fees.length-2"></el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteProportionSetList(zItem,index)" v-if="index > 0"></el-button>
                  </span>
                </li>
              </ul>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
        <el-form-item label="加班金额设置:" prop="max_fee">
          <div class="show-flex-box-r">
            <!-- <el-switch
              v-model="form.is_set ==1?true:false"
              active-color="#409EFF"
              inactive-color="#ff4949"
              @click.native.prevent="selectedSwitchSet(1)"
              style="margin-top:6px">
            </el-switch>
            &nbsp;
            &nbsp; -->
            <span>每月加班金额不超过 &nbsp;</span>
            <el-input v-model="form.max_fee" placeholder="金额" style="width: 120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.max_fee = $event.target.value"><template slot="append">元</template></el-input>
          </div>
          
        </el-form-item>
        <el-form-item label="" prop="max_fee">
          <span style="color:'#909399'; font-size: 12px">说明:金额为0是，将不限制加班金额</span>
        </el-form-item>
      </el-form>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill('form')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  components: {},
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "编辑",
    },
    curSelecedType: [String],
  },
  mounted() {
  },
  data() {
    return {
      form: {
        id: '',
        name: '',
        group_name:'',
        type: '1',
        types:[
           {
            type:'1',
            label:'工作日',
            is_allow: 1, //是否允许加班 1是2否。默认1
            is_check: 1, //是否按照审批时长计算;1是2否。默认1
            is_fee: 1, //是否记为加班费;1是2否。默认1
            fees:[
              {
                min: '',
                max: '',
                value:'',
              },
              {
                min: '',
                max: -1,
                value:'',
              },
            ]
          },
          {
            type:'2',
            label:'休息日',
            is_allow: 1, //1是2否。默认1
            is_check: 1, //1是2否。默认1
            is_fee: 1, //是否记为加班费;1是2否。默认1
            fees:[
              {
                min: '',
                max: '',
                value:'',
              },
              {
                min: '',
                max: -1,
                value:'',
              },
            ]
          },
          {
            type:'3',
            label:'节假日',
            is_allow: 1, //1是2否。默认1
            is_check: 1, //1是2否。默认1
            is_fee: 1, //是否记为加班费;1是2否。默认1
            fees:[
              {
                min: '',
                max: '',
                value:'',
              },
              {
                min: '',
                max: -1,
                value:'',
              },
            ]
          },
        ],
        max_fee: 0,
        // is_set:1
      },
      basicRules: {
        name: [
          { required: true, message: "请输入规则名称", trigger: "change" },
        ],
      },
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.$nextTick(() => {
          this.$refs.form.clearValidate();
        })
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    // 选择是否允许加班
    selectedSwitch(index,val) {
     this.form.types[index].is_allow == val? this.form.types[index].is_allow = 2:  this.form.types[index].is_allow= val
    },
    selectedSwitchSet(val){
      this.form.is_set == val? this.form.is_set = 2:  this.form.is_set= val
    },
    // 增加设置
    addProportionSetList(zItem) {
      let obj = {
        min: '',
        max: '',
        value:'',
      };
      zItem.fees.splice(zItem.fees.length -1, 0, obj)
    },
    deleteProportionSetList(zItem,index) {
      zItem.fees.splice(index,1)
    },

    // 数据编辑回显示
    setData(info) {
      let val = JSON.parse(JSON.stringify(info))
      val.group_name = val.groups.map(item => {return item.name}).join(',')
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.form[key] = val[key];
          if(key == 'types') {
            val.types.map(item => {
              if(item.type == 1) {
                item.label = '工作日'
              }
              if(item.type == 2) {
                item.label = '休息日'
              }
              if(item.type == 3) {
                item.label = '节假日'
              }
              item.type = String(item.type)
            })
          }
        }
      }
      this.$nextTick(() =>{
        this.$refs.form.clearValidate();
      })
    },


    updatePlaybill(formName) {
       this.$refs[formName].validate((valid) => {
        if (valid) {
          let info = JSON.parse(JSON.stringify(this.form))
          delete info.group_name
          delete info.type
          info.types.forEach(element => {
            element.type = Number(element.type)
            delete element.label
            delete element['is_allow ==1?true:false']
          });

          this.$emit("save-add-edit", info);
          // delete info['is_set ==1?true:false']
          // if(info.is_set == 1 && Number(info.max_fee) > 0) {
          //   this.$emit("save-add-edit", info);
          // }else{
          //   this.$message({
          //     showClose: true,
          //     message: '开启最大加班费用，设置金额必须大于零',
          //     type: "warning",
          //   });
          //   return
          // }
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div {
  height: 380px;
  overflow-y: scroll;

}
.el-dialog-div /deep/ .el-input {
  width: 750px;
}
</style>


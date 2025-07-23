<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="1080px"
    
  >
    <div class="el-dialog-div">
      <el-form :model="form" :rules="basicRules" ref="form" label-width="145px" size="mini">
        <el-form-item label="班次名称:" prop="name">
          <el-input v-model="form.name" placeholder="请输入班次名称" style="width: 855px;"></el-input>
        </el-form-item>
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>上下班时间设置</span>
            <el-button style="float: right; padding: 3px 0" type="text" @click="addTime">添加</el-button>
          </div>
          <el-card class="box-card" v-for="(item,index) in form.child" :key="index"  style="margin-bottom:15px;">
            <div slot="header" class="clearfix">
              <span>第{{index+1}}次上下班</span>
              <el-button type="text" style="margin-left: 10px;color:#D9001B" v-if="index != 0" @click="deletetime(index)">删除</el-button>
              <span style="float: right; padding: 3px 0" type="text">
                 <!-- v-if="(index+1) < form.child.length" -->
                <el-radio-group v-model="item.is_rest" >
                  <el-radio :label="1" @click.native.prevent="radioChange1(index,1)">休息时间</el-radio>
                </el-radio-group>
              </span>
            </div>
            <div class="show-flex-box-r">
              <el-form-item label="上班时间:" :prop="'child.'+ index +'.up_time'" :rules="[{required: true,message: '请选择上班时间',trigger: 'change'}]">
                 <el-time-picker
                  v-model="item.up_time"
                  :picker-options="{
                    
                  }"
                  placeholder="请选择上班时间点"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="seletedTiems"
                  >
                </el-time-picker>
              </el-form-item>
              <el-form-item label="上班打卡时间范围:" :prop="'child.'+ index +'.up_section'" :rules="[{required: true,message: '请选择上班打卡时间范围',trigger: 'change'}]">
                <el-time-picker
                  is-range
                  v-model="item.up_section"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  format="HH:mm"
                  value-format="HH:mm"
                  :editable="false">
                </el-time-picker>
              </el-form-item>
              <el-radio v-model="item.is_up" :label="1" :disabled="index == 0" style="height: 47px;line-height: 28px;margin-left:15px;" @click.native.prevent="radioChangeUp(index,1)">打卡</el-radio>
            </div>
            <div class="show-flex-box-r">
              <el-form-item label="下班时间:" :prop="'child.'+ index +'.down_time'" :rules="[{required: true,message: '请选择下班时间',trigger: 'change'}]">
                 <el-time-picker
                  v-model="item.down_time"
                  :picker-options="{
                    
                  }"
                  placeholder="请选择下班时间点"
                  format="HH:mm"
                  value-format="HH:mm"
                  @change="seletedTiems">
                </el-time-picker>
              </el-form-item>
              <el-form-item label="下班打卡时间范围:" :prop="'child.'+ index +'.down_section'" :rules="[{required: true,message: '请选择下班打卡时间范围',trigger: 'change'}]">
                <el-time-picker
                  is-range
                  v-model="item.down_section"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  format="HH:mm"
                  value-format="HH:mm"
                  :editable="false">
                </el-time-picker>
              </el-form-item>
              <el-radio v-model="item.is_down" :label="1" style="height: 47px;line-height: 28px;margin-left:15px;" @click.native.prevent="radioChangeDown(index,1)">打卡</el-radio>
            </div>
             <!-- && (index+1) < form.child.length -->
            <div class="show-flex-box-r" v-if="item.is_rest == 1">
               <el-form-item label="休息时间:" :prop="'child.'+ index +'.rest_section'" :rules="[{required: true,message: '请选择休息时间',trigger: 'change'}]">
                <el-time-picker
                  is-range
                  v-model="item.rest_section"
                  range-separator="至"
                  start-placeholder="开始时间"
                  end-placeholder="结束时间"
                  placeholder="选择时间范围"
                  format="HH:mm"
                  value-format="HH:mm"
                  :editable="false">
                </el-time-picker>
              </el-form-item>
            </div>
          </el-card>
          
        </el-card>
        <div class="show-flex-box-r" style="align-items: center; margin: 10px 0;">
          <el-form-item label="班次工时:" prop="work_day">
            <span>合计工作时长{{parseInt(Number(form.work_hours)/60)}}个小时{{parseInt(Number(form.work_hours)%60)}}分钟     ，计为 &nbsp;</span>
            <el-input-number v-model="form.work_day" :min="1" :max="10" label="请输入"></el-input-number>
            <span>&nbsp;天出勤</span>
          </el-form-item>
        </div>
        <div class="show-flex-box-r">
          <el-form-item label="弹性打卡:" prop="is_tx">
            <div class="show-flex-box-r">
              <el-card class="box-card">
                <div class="show-flex-box-c show-flex-center" style="width:200px;height: 150px;">
                  <el-checkbox v-model="form.is_tx" @change="changeIsTx">允许晚到晚走、早到早走</el-checkbox>
                  <el-checkbox v-model="form.is_yx" @change="changeIsYx">晚到、早走几分钟不计为异常</el-checkbox>
                </div>
              </el-card>
              
              <el-card class="box-card">
                <div class="show-flex-box-c" style="width:580px;height: 150px; justify-content: center;">
                  <div class="show-flex-box-c" style="margin-bottom:10px" v-if="form.is_tx">
                    <span style="margin-bottom:10px">上班最多可晚到: 
                      <el-input placeholder="请输入" v-model="form.tx_up" style="width:140px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.tx_up = $event.target.value" size="mini">
                        <template slot="append">分钟</template>
                      </el-input>
                      上班晚到几分钟，下班必须晚走几分钟
                    </span>
                    <span>下班最多可早走: 
                      <el-input placeholder="请输入" v-model="form.tx_down" style="width:140px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.tx_down = $event.target.value" size="mini">
                        <template slot="append">分钟</template>
                      </el-input>
                      上班早到几分钟，下班可以早走几分钟
                    </span>
                  </div>
                  <div  class="show-flex-box-c" v-if="form.is_yx">
                    <span style="margin-bottom:10px">上班晚到: 
                      <el-input placeholder="请输入" v-model="form.yc_up" style="width:140px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.yc_up = $event.target.value" size="mini">
                        <template slot="append">分钟</template>
                      </el-input>
                      不记为迟到
                    </span>
                    <span>下班早走: 
                      <el-input placeholder="请输入" v-model="form.yc_down" style="width:140px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.yc_down = $event.target.value" size="mini">
                        <template slot="append">分钟</template>
                      </el-input>
                      不记为早退
                    </span>
                  </div>
                </div>
              </el-card>
              
            </div>
            
          </el-form-item>
        </div>
        <div class="show-flex-box-c">
          <el-form-item label="更多设置:" prop="is_cdkg">
            <el-checkbox v-model="form.is_cdkg"></el-checkbox>
             <span style="margin-bottom:10px">迟到超过 
              <el-input placeholder="请输入" v-model="form.cdkg" style="width:140px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.cdkg = $event.target.value" size="mini">
                <template slot="append">分钟</template>
              </el-input>
              为旷工
            </span>
          </el-form-item>
          <el-form-item label="" prop="is_ztkg">
            <el-checkbox v-model="form.is_ztkg"></el-checkbox>
             <span style="margin-bottom:10px">早退超过 
              <el-input placeholder="请输入" v-model="form.ztkg" style="width:140px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="form.ztkg = $event.target.value" size="mini">
                <template slot="append">分钟</template>
              </el-input>
              为旷工
            </span>
          </el-form-item>
        </div>
        <!-- <div class="show-flex-box-r" style="align-items:center">
          <el-form-item label="是否立即生效:" prop="isEnableToday">
            <el-radio-group v-model="form.isEnableToday" >
              <el-radio :label="1"><span style="color:#606266">是</span></el-radio>
              <el-radio :label="2"><span style="color:#606266">否</span></el-radio>
            </el-radio-group>
          </el-form-item>
          <span style="font-size:12px; color:#909399;padding-bottom: 15px;margin-left: 20px;" > <span style="color:#D9001B">"是" </span> 是立即生效，<span style="color:#D9001B">"否" </span> 是次日生效</span>
        </div> -->
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
        id: "",
        name: "",
        work_hours:0,
        work_day:1,
        // 开启弹性
        is_tx:true, //0关闭1开启，默认0
        tx_up:0,
        tx_down:0,
        // 开启异常
        is_yx:false, //0关闭1开启，默认0
        yc_up:0,
        yc_down:0,
        // 更多
        is_cdkg:false, //1是2否，默认2
        cdkg:'',
        is_ztkg: false,//1是2否，默认2
        ztkg:'',
        // 上班时间设置
        child:[
          {
            is_rest:2,
            up_time:'',
            is_up:1,
            up_section:null,
            is_down:1,
            down_time:'',
            down_section:null,
            rest_section:null
          }
        ],
        // isEnableToday:1
      },
      basicRules: {
        name: [
          { required: true, message: "请输入班次名称", trigger: "change" },
        ],
        work_day: [
          { required: true, message: "请输入班次工记为天数出勤", trigger: "change" },
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
    // 'form.is_yx'(){
    //   if(!this.is_yx) {
    //     this.form.yc_up = 0
    //     this.form.yc_down = 0
    //   }
    // },
    // 'form.is_tx'(){
    //   if(!this.is_tx) {
    //     this.form.tx_up = 0
    //     this.form.tx_down = 0
    //   }
    // }
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 添加班次
    addTime() {
      if(this.form.child.length>2) {
        this.$message({
          message: '最多增加3次上下班打卡时间',
          type: 'warning'
        });
        return
      }
      let obj ={
        is_rest:2,
        up_time:'',
        is_up:1,
        up_section:null,
        is_down:1,
        down_time:'',
        down_section:null,
        rest_section:null
      }
      this.form.child.push(obj)
    },
    // 删除班次
    deletetime(index) {
      this.form.child.splice(index,1)
    },
    // 选择是否休息
    radioChange1(index,val) {
     this.form.child[index].is_rest == val? this.form.child[index].is_rest = 2:  this.form.child[index].is_rest= val
     if(this.form.child[index].is_rest == 1) {
      if(!!this.form.child[index].rest_section  && this.form.child[index].rest_section.length > 0) {
        this.form.child[index].rest_section = null
      }
     }
     
    },
    // 选择上班是否打卡
    radioChangeUp(index,val) {
     this.form.child[index].is_up == val? this.form.child[index].is_up = 2:  this.form.child[index].is_up= val
    },
    // 选择下班是否打开
    radioChangeDown(index,val) {
     this.form.child[index].is_down == val? this.form.child[index].is_down = 2:  this.form.child[index].is_down= val
    },
    // 时间比较大小
    timeComparisonSize(value1,value2){
      let value1Number = Number(value1.replace(/[:]/g,""))
      let value2Number = Number(value2.replace(/[:]/g,""))
      if(value1Number<=value2Number) {
        return true
      }else{
         return false
      }
    },
    // 时间转成分钟
    calculateMinutes(value) {
      // console.log(value.substr(3,2),value.substr(0,2))
      let hour = value.substr(0,2)
      let minutes = value.substr(3,2)
      // console.log(hour, minutes,hour*60 + minutes)
      return Number(hour*60) + Number(minutes)
    },
    // 选择上下班时间算出工作时长
    seletedTiems(val) {
      let workHours = 0;
      if(this.form.child.length) {
        for (let i = 0; i < this.form.child.length; i++) {
          if(!!this.form.child[i].up_time && !!this.form.child[i].down_time) {
            this.calculateMinutes(this.form.child[i].up_time)
            if(!this.timeComparisonSize(this.form.child[i].up_time, this.form.child[i].down_time)) {
              this.$message({
                message: '下班时间不能小于上班时间',
                type: 'warning'
              });
              this.form.child[i].down_time = ''
              return
            }else{
              workHours = workHours + (this.calculateMinutes(this.form.child[i].down_time) - this.calculateMinutes(this.form.child[i].up_time))
              // alert(workHours)
            }
            
          }
        }
        
      }
      this.form.work_hours = workHours
      // console.log(workHours)
    },
    // 更改是否允许晚到晚走，早到早走
    changeIsTx(val) {
      if(val) {
        this.form.is_yx = false
        this.form.yc_up = 0
        this.form.yc_down = 0
      }
    },
    // 更改晚到、早走几分钟不记为异常
    changeIsYx(val) {
      if(val) {
        this.form.is_tx = false
        form.tx_up = 0
        form.tx_down = 0
      }
    },
    // 数据编辑回显示
    setData(info) {
      let val = JSON.parse(JSON.stringify(info))
      for (const key in this.form) {
        if (Object.hasOwnProperty.call(val, key)) {
          this.form[key] = val[key];
          if(key == 'is_tx' || key == 'is_yx' || key == 'is_cdkg'|| key == 'is_ztkg') {
            this.form[key] = val[key] == 1? true:false
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
          info.is_tx = this.form.is_tx? 1 : 0
          info.is_yx = this.form.is_yx? 1 : 0
          info.is_cdkg = this.form.is_cdkg? 1 : 2
          info.is_ztkg = this.form.is_ztkg? 1 : 2
          this.$confirm('立即生效：今日考勤结果将按新规则重新计算', '选择规则生效时间', {
            distinguishCancelAndClose: true,
            confirmButtonText: '立即生效',
            cancelButtonText: '明天生效'
          }).then(() => {
              info.isEnableToday = 1
              this.$emit("save-add-edit", info, 1);
            }).catch(action => {
              if(action == 'cancel') {
                info.isEnableToday = 2
                this.$emit("save-add-edit", info, 1);
              }
            });
        } else {
          return false;
        }
      });
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
// .el-dialog-div /deep/ .el-input {
//   width: 460px;
// }
.el-dialog-div {
  height: 400px;
  overflow-y: scroll; 
}
</style>


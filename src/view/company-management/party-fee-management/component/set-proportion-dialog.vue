<template>
  <el-dialog
    :visible="dialogBool"
    :title="title"
    :before-close="dialogClose"
    width="810px"
    
  >
    <div class="el-dialog-div" :style="`${proportionSetList.length > 6? 'overflow-y: scroll;':''}`">
      <div class="set-proportion-box show-flex-box-c">
        <div class="set-proportion-start show-flex-box-r" style="align-items: center; margin-bottom: 15px;">
          <span>缴纳基数：小于等于&nbsp;</span>
          <el-input v-model="startForm.max" placeholder="金额" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" size="mini" @blur="startForm.max = $event.target.value"> <template slot="append">元</template> </el-input>
          <span>&nbsp;，缴纳比例为：</span>
          <el-input v-model="startForm.value" placeholder="百分比" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="startForm.value = $event.target.value" size="mini"> <template slot="append">%</template> </el-input>
        </div>

        <ul class="show-flex-box-c" v-if="proportionSetList.length > 0">
          <li class="show-flex-box-r" style="align-items: center; margin-bottom: 15px;" v-for="(item,index) in proportionSetList" :key="index">
            <div class="show-flex-box-r" style="align-items: center;margin-right:10px">
              <span>缴纳基数：大于&nbsp;</span>
              <el-input v-model="item.min" placeholder="金额" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.min = $event.target.value" size="mini"> <template slot="append">元</template> </el-input>
              <span>&nbsp;，小于等于&nbsp;</span>
              <el-input v-model="item.max" placeholder="金额" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.max = $event.target.value" size="mini"> <template slot="append">元</template> </el-input>
              <span>&nbsp;，缴纳比例为：</span>
              <el-input v-model="item.value" placeholder="百分比" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="item.value= $event.target.value" size="mini"> <template slot="append">%</template> </el-input> 
            </div>
            <span class="show-flex-box-r" v-if="index == (proportionSetList.length-1)">
              <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addProportionSetList"></el-button>
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteProportionSetList(index)"></el-button>
            </span>
          </li>
        </ul>
        <div class="show-flex-box-r" style="align-items: center; margin-bottom: 15px;"  v-else>
          <span>增加比例设置: &nbsp;&nbsp;</span>
          <el-button type="primary" icon="el-icon-circle-plus-outline" size="mini" @click="addProportionSetList"></el-button>
        </div>
        <div class="set-proportion-end show-flex-box-r" style="align-items: center; padding-bottom: 15px;">
          <span>缴纳基数：大于&nbsp;</span>
          <el-input v-model="endForm.min" placeholder="金额" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="endForm.min = $event.target.value" size="mini"> <template slot="append">元</template> </el-input>
          <span>&nbsp;，缴纳比例为：</span>
          <el-input v-model="endForm.value" placeholder="百分比" style="width:120px" oninput="value=value.replace(/[^\d.-]/g,'')" @blur="endForm.value = $event.target.value" size="mini"> <template slot="append">%</template> </el-input>
        </div>
      </div>
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogClose">取 消</el-button>
      <el-button type="primary" @click="updatePlaybill()">确 认</el-button>
    </span>
  </el-dialog>
</template>

<script type="text/ecmascript-6">
export default {
  props: {
    dialogBool: Boolean,
    title: {
      type: String,
      default: "党费比例设置",
    },
  },
  mounted() {
  },
  data() {
    return {
      startForm: {
        min: 0,
        max: "",
        value: "",
      },
      endForm: {
        min: "",
        max: -1,
        value: "",
      },
      proportionSetList:[
        // {
        //   min: '',
        //   max: '',
        //   value:'',
        // }
      ]
    };
  },
  watch: {
    dialogBool(bool) {
      if (bool === false) {
        Object.assign(this.$data, this.$options.data());
      }else{
        this.reqPartyFeeSetList();
      }
    },
  },
  methods: {
    dialogClose() {
      this.$emit("update:dialogBool", false);
    },
    // 获取比列设置
    reqPartyFeeSetList() {
      this.$client
        .PartyFeeListPartyFee()
        .then((res) => {
          if (res.head.result == "200") {
            let list = res.context;
            if(list.length > 1) {
              this.startForm = list[0];
              this.endForm = list.slice(-1)[0];
              list.shift();
              list.pop();
              this.proportionSetList = res.context;
            }
          } else {
            this.$message({
              showClose: true,
              message: res.head.describle,
              type: "error",
            });
          }
        })
    },
    // 增加比例设置
    addProportionSetList() {
      let obj = {
        min: '',
        max: '',
        value:'',
      };
      this.proportionSetList.push(obj)
    },
    deleteProportionSetList(index) {
      this.proportionSetList.splice(index,1)
    },
    updatePlaybill() {
      console.log(this.startForm)
      if(!this.startForm.max) {
        this.$message({
          message: `第1行中的“小于等于”为必填项`,
          type: 'warning'
        });
        return
      }
      if(!this.startForm.value) {
        this.$message({
          message: `第1行中的“缴纳比例”为必填项`,
          type: 'warning'
        });
        return
      }

      try{
        this.proportionSetList.forEach((item,index) => {
          
          if(!item.min) {
            this.$message({
              message: `第${index+2}行中的“大于”为必填项`,
              type: 'warning'
            });
            throw new Error("ending")
          }
          if(!item.max) {
            this.$message({
              message: `第${index+2}行中的“小于等于”为必填项`,
              type: 'warning'
            });
            throw new Error("ending")
          }
          if(!item.value) {
            this.$message({
              message: `第${index+2}行中的“缴纳比例”为必填项`,
              type: 'warning'
            });
            throw new Error("ending")
          }

        })
      }catch(e) {
        if(e.message == "ending"){
          return
　　  　}
      }

      if(!this.endForm.min) {
        this.$message({
          message: `最后1行中的“大于”为必填项`,
          type: 'warning'
        });
        return
      }
      if(!this.endForm.value) {
        this.$message({
          message: `最后1行中的“缴纳比例”为必填项`,
          type: 'warning'
        });
        return
      }



      let setList = [...this.proportionSetList];
      if(this.startForm.max && this.startForm.value) {
        setList.unshift(this.startForm)
      }
      if(this.endForm.min && this.endForm.value) {
        setList.push(this.endForm)
      }
      setList = setList.map(item => {
        item.min = Number(item.min) 
        item.max = Number(item.max) 
        item.value =  Number(item.value) 
        return item
      })
      // console.log(setList)
      // return
      this.$emit("save-set-proportion",  setList);
        
      
    },
  },
};
</script>
  
<style lang="stylus" rel="stylesheet/stylus" scoped>
.el-dialog-div{
  height: 350px;
  // overflow-y: scroll;
}
.set-proportion-box{
  width: 100%;
  height: 100%;
  // align-items: center;
}

</style>


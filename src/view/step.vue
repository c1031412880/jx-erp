<!--  -->
<template>
  <div style="height: 500px">
    <!-- <el-steps direction="vertical" :active="0">
      <el-step title="步骤 1">
        <template slot="description">
          <div style="width:500px;display: flex" >
            <el-button  v-for="(index,i) in this.data" :key="i">{{index.name}}
              <i @click="clickOne(i)" class="el-icon-delete-solid"></i>
            </el-button>
            <el-button type="primary" circle>+</el-button>
          </div>
        </template>
      </el-step>
      <el-step title="步骤 2"></el-step>
      <el-step
        title="步骤 3"
      ></el-step>
    </el-steps> -->
    <div style="width: 500px;margin-left:30%">
      <el-form ref="elForm" :model="formData" size="medium" label-width="100px" label-position="top">
        <el-form-item label="报销项目名称" >
          <el-input v-model="formData.name" placeholder="请输入审批名称" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="金额" >
          <el-input v-model="formData.money" placeholder="请输入金额" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
        <el-form-item label="备注" v-if="this.active != 2">
          <el-input v-model="formData.remark"  placeholder="请输入备注" clearable :style="{width: '100%'}">
          </el-input>
        </el-form-item>
      </el-form>
    </div>
    <el-steps direction="vertical" :active="this.active">
      <el-step v-for="(item,index) in data" :key="index" :title="map[item.type]">
        <template slot="description">
          <div style="width:500px;display: flex" >
            <el-button  v-for="(item2,i) in item.content" :key="i">
              {{item2.name}}
              <!-- <i @click="clickOne(i)" class="el-icon-delete-solid"></i> -->
            </el-button>
            <!-- <el-button type="primary" circle>+</el-button> -->
          </div>
        </template>
        <template slot="description">
           <!-- <el-button v-if="item.type == 'approver'" size="small" type="primary" @click="approval(index)">审批</el-button> -->
        </template>
      </el-step>
    </el-steps>
   
  </div>
</template>

<script>
export default {
  data() {
    const map = {'start': '发起人', 'approver': '审批', 'copy': '抄送'}
    return {
      active: 2,
      formData:{
        name:'11',
        money: '6000',
        remark: '11'
      },
      data:[],
      name:[
        {
          name:'张三',
          value: '100'
        },
        {
          name:'李四',
          value: '100'
        },
        {
          name:'王五',
          value: '100'
        },
      ],
      map:map
    };
  },

  mounted(){
    let process = this.$route.params.structData
    process = JSON.parse(process)

    let processObj = []
    process.forEach(item => {
      if(item.type != 'condition'){
        processObj.push(item)
      }
    });
    this.data = processObj
    console.log(this.data)


  },
  components: {},

  computed: {},

  // mounted: {},

  methods: {
    approval(val){
      console.log(val)
      this.active += 1
    },
    clickOne(i){
      console.log(i)
      this.data.splice(i,1)
    }
  },
};
</script>
<style lang='scss' scoped>
</style>
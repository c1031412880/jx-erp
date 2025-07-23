<!--  -->
<template>
  <div class="">
    <el-form ref="form">
      <el-form-item label="选择表单">
        <el-select
          v-model="value"
          clearable
          placeholder="请选择"
          @change="selectedFrom"
        >
          <el-option
            v-for="item in formOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { get_form_table } from "@/api/erp";
//这里可以导入其他文件（比如：组件，工具js，第三方插件js，json文件，图片文件等等）
//例如：import 《组件名称》 from '《组件路径》';

export default {
  //import引入的组件需要注入到对象中才能使用
  components: {},
  data() {
    //这里存放数据
    return {
      formOptions: [],
      contactFormOptions:[],
      value: "",
    };
  },
  //生命周期 - 创建完成（可以访问当前this实例）
  created() {
    this.getAllForm()
  },
  //生命周期 - 挂载完成（可以访问DOM元素）
  mounted() {
    // this.getAllForm()
  },
  //监听属性 类似于data概念
  computed: {},
  //监控data中的数据变化
  watch: {},
  //方法集合
  methods: {
    getAllForm() {
      get_form_table({}).then((req) => {
        if (req.content.result === "200") {
          this.contactFormOptions = req.content.data;
          // console.log(JSON.stringify(this.contactFormOptions))
          this.formOptions = this.bulidOptions();
          if(this.formOptions.length > 0) {
            this.value = this.formOptions[0].value;
            this.selectedFrom(this.formOptions[0].value)
          }
        } else {
        }
      });
    },

    bulidOptions() {
      let bulidOptionsList = [];
      this.contactFormOptions.forEach((item,index) => {
        let formObj = {
          value: item.id,
          label: item.name
        };
        bulidOptionsList.push(formObj)
      });

      return bulidOptionsList
    },

    selectedFrom(val) {
      let formName = val ? this.formOptions.find(ele => ele.value === val).label : ''
      this.$parent.toFatherMethods(formName,val);
    },
  },
};
</script>
<style lang="stylus" scoped></style>
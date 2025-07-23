<template>
  <div class="red-head">
    <div
      v-for="(item,i) in titleList"
      :key="i"
      :style="{width: `${10000 / item.zoom}%`, transform: `scale(${item.zoom / 100},1)`,
       marginLeft: `-${((10000 / item.zoom) - 100) / 2}%`,
       fontSize: item.title_fontSize + 'px',color: item.title_fontColor,
       fontWeight: item.title_fontWeight == 0 ? 'bold' : '',fontFamily: item.defaultFont}"
      class="font-style justify-txt">
      {{item.title}}
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: "red-head",
  props: {
    titleList: {
      type: Array,
      default: () => [
        {title: '',
          zoom: ''
        }
      ]
    },
  },
  mounted() {
    // 固定pt 65
    // pt与px转换 px = pt / 72 * 96
  },
  methods: {
    //获取DPI
    js_getDPI() {
      let arrDPI = new Array();
      if ( window.screen.deviceXDPI != undefined ) {
        arrDPI[0] = window.screen.deviceXDPI;
        arrDPI[1] = window.screen.deviceYDPI;
      }
      else {
        let tmpNode = document.createElement( "DIV" );
        tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
        document.body.appendChild( tmpNode );
        arrDPI[0] = parseInt( tmpNode.offsetWidth );
        arrDPI[1] = parseInt( tmpNode.offsetHeight );
        tmpNode.parentNode.removeChild( tmpNode );
      }
      return arrDPI;
    }
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
.red-head{
  font-size calc(95.992px * 1.23)
  width 100%
  line-height 1.5
  color red
  //font-family '仿宋'
  letter-spacing 1.64px
  word-spacing 1.64px
  .font-style{
    //font-weight 600
  }
  .justify-txt{
    text-align-last:justify;
    text-align:justify;
    text-justify:distribute-all-lines;
  }
  .left-txt{
    text-align: left;
  }
}
</style>

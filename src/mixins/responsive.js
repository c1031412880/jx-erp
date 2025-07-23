/**
 * 响应式设计 mixin
 * 用于检测屏幕尺寸并提供响应式相关的计算属性和方法
 */
export default {
  data() {
    return {
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight
    }
  },
  computed: {
    // 屏幕尺寸分类
    screenSize() {
      if (this.screenWidth >= 1920) return 'xl'
      if (this.screenWidth >= 1400) return 'lg'
      if (this.screenWidth >= 1200) return 'md'
      if (this.screenWidth >= 768) return 'sm'
      return 'xs'
    },
    
    // 缩放比例
    scaleRatio() {
      if (this.screenWidth >= 1920) return 1
      if (this.screenWidth >= 1400) return 0.95
      if (this.screenWidth >= 1200) return 0.85
      if (this.screenWidth >= 768) return 0.7
      return 0.6
    },
    
    // 是否为移动端
    isMobile() {
      return this.screenWidth < 768
    },
    
    // 是否为平板
    isTablet() {
      return this.screenWidth >= 768 && this.screenWidth < 1200
    },
    
    // 是否为桌面端
    isDesktop() {
      return this.screenWidth >= 1200
    },
    
    // 响应式网格列数
    responsiveColumns() {
      switch (this.screenSize) {
        case 'xs': return 1
        case 'sm': return 2
        case 'md': return 3
        case 'lg': return 4
        case 'xl': return 6
        default: return 4
      }
    },
    
    // 响应式图表高度
    responsiveChartHeight() {
      const baseHeight = 300
      return Math.round(baseHeight * this.scaleRatio) + 'px'
    },
    
    // 响应式字体大小
    responsiveFontSize() {
      const scale = this.scaleRatio
      return {
        title: Math.round(16 * scale) + 'px',
        subtitle: Math.round(14 * scale) + 'px',
        content: Math.round(12 * scale) + 'px',
        small: Math.round(10 * scale) + 'px'
      }
    },
    
    // ECharts字体大小
    echartsFontSize() {
      const scale = this.scaleRatio
      return {
        title: Math.round(18 * scale),
        subtitle: Math.round(14 * scale),
        legend: Math.round(12 * scale),
        axis: Math.round(11 * scale),
        tooltip: Math.round(12 * scale)
      }
    }
  },
  
  mounted() {
    this.handleResize = this.debounce(this.updateScreenSize, 100)
    window.addEventListener('resize', this.handleResize)
  },
  
  beforeDestroy() {
    if (this.handleResize) {
      window.removeEventListener('resize', this.handleResize)
    }
  },
  
  methods: {
    // 更新屏幕尺寸
    updateScreenSize() {
      this.screenWidth = window.innerWidth
      this.screenHeight = window.innerHeight
    },
    
    // 防抖函数
    debounce(func, wait) {
      let timeout
      return function executedFunction(...args) {
        const later = () => {
          clearTimeout(timeout)
          func(...args)
        }
        clearTimeout(timeout)
        timeout = setTimeout(later, wait)
      }
    },
    
    // 获取响应式样式
    getResponsiveStyle(config = {}) {
      const {
        mobile = {},
        tablet = {},
        desktop = {}
      } = config
      
      if (this.isMobile && mobile) return mobile
      if (this.isTablet && tablet) return tablet
      if (this.isDesktop && desktop) return desktop
      
      return {}
    },
    
    // 获取缩放后的像素值
    getScaledPixels(basePixels) {
      return Math.round(basePixels * this.scaleRatio) + 'px'
    }
  }
} 
<template>
  <div v-if="source" ref="container" class="c-mandala">
    <svg id="mandala" :class="{'is-changing' : isChanging}" />
    <incrementer v-show="showUI" :value="currentSides" :step="10" :min="10" :max="50" @increment="onIncrement" />
  </div>
</template>
<script>
import Incrementer from "@/components/Incrementer";
export default {
  components: {
    Incrementer,
  },
  props: {
    source: {
      type: String,
      default: () => ""
      // default: () => "https://picsum.photos/500"
    },
    sides: {
      type: Number,
      default: () => 20
    },
    showUI: {
      type: Boolean,
      default: () => true
    },
  },
  data () {
    return {
      mandala: undefined,
      currentSides: this.sides,
      isChanging: true,
    }
  },
  computed: {
    windowWidth () {
      return window.innerWidth
    },
  },
  watch: { 
    source: function(newVal, oldVal) {
      this.source = newVal
      this.$nextTick( () => {
        this.redraw()
      })
    }
  },
  mounted () {
    if (this.source) this.draw()
    window.onresize = this.onWindowResize
  },
  methods: {
    onIncrement (value) {
      this.currentSides = value
      this.redraw()
    },
    draw () {
      const radius = window.innerWidth/2
      const angle = 360/this.currentSides/2
      const b = radius*Math.tan(angle*Math.PI/180)
      const coords = (radius-b)+',0 '+radius+','+radius+' '+(radius+b)+',0'
      this.mandala = Snap('#mandala')
      this.mandala.attr({
        viewBox: `0 0 ${window.innerWidth} ${window.innerWidth}`,
        preserveAspectRatio: "xMidYMid meet"
      }).transform('s1.2')

      const images = []
      const parts = []
      for (var i = 0; i < this.currentSides; i++) {
        var tri = this.mandala.polygon(coords).attr({fill: '#fff'})
        images[i] = this.mandala.image(this.source, 0,0, window.innerWidth, window.innerWidth )
        parts[i] = this.mandala.group(images[i]).attr({mask: tri})
        
        parts[i].transform( 'r'+angle*2*i+','+radius+','+radius+'' )
      }
      setTimeout(() => {
        this.isChanging = false
      }, 500);
    },
    redraw () {
      this.isChanging = true
      this.mandala.clear()
      this.draw()
    },
    onWindowResize () {
      this.redraw()
    }
  }
}
</script>
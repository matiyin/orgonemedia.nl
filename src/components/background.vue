<template>
  <div>
    <div id="bg">
      <div ref="imageDiv1" class="c-background-image" :style="{ 'background-image': 'url(' + getImage1 + ')' }" />
      <div ref="imageDiv2" class="c-background-image c-background-image__second" :style="{ 'background-image': 'url(' + getImage2 + ')' }" />
    </div>
    <transition name="fade-bg">
      <mandala v-if="showMandala" :source="getCurrentImage" :sides="mandalaSides" />
    </transition>
    <incrementer
      v-if="showMandala"
      :value="mandalaSides"
      :step="5"
      :min="5"
      :max="20"
      @increment="onIncrement"
      @close="closeMandala"
    />
  </div>
</template>

<script>
import mandala from "@/components/mandala";
import Incrementer from "@/components/Incrementer";

export default {
  components: {
    mandala,
    Incrementer,
  },
  props: {
    showMandala: {
      type: Boolean,
      default: () => false
    },
    isActivated: {
      type: Boolean,
      default: () => false
    },
    image: {
      type: String,
      default: () => ""
    },
    nextImage: {
      type: String,
      default: () => ""
    },
  },
  data () {
    return {
      animationId: null,
      imgtoggle: true,
      image1: this.image,
      image2: null,
      currentImage: this.image,
      lFollowX: 0,
      lFollowY: 0,
      mandalaSides: 10,
    }
  },
  computed: {
    getImage1: {
      // getter
      get: function () {
        if ( this.image1) {
          return this.image1;
        } else {
          return this.image;
        }
      },
      // setter
      set: function (src) {
        this.image1 = src;
      }
    },
    getImage2: {
      // getter
      get: function () {
        if ( this.image2) {
          return this.image2;
        } else {
          return this.nextImage;
        }
      },
      // setter
      set: function (src) {
        this.image2 = src;
      }
    },
    getCurrentImage: {
      // getter
      get: function () {
        return this.currentImage
      },
      // setter
      set: function (src) {
        this.currentImage = src;
      }
    },
  },
  watch: { 
    nextImage: function(newVal, oldVal) {
      this.imgtoggle = !this.imgtoggle;
      if (!this.imgtoggle) {
        this.image2 = newVal;
        this.$refs.imageDiv2.style.opacity = '1.0';
      } else {
        this.image1 = newVal;
        this.$refs.imageDiv2.style.opacity = '0';
      }
      this.getCurrentImage = newVal
    },
    showMandala: function(newVal, oldVal) {
      if (!this.getCurrentImage) this.getCurrentImage = this.image
      if (newVal) {
        this.stopParallax()
      } else {
        this.startParallax()
      }
    },
    isActivated: function(newVal, oldVal) {
      if (newVal) {
        this.showUI = false
      } else {
        this.showUI = true
      }
    },
  },
  mounted () {
    this.startParallax()
  },
  destroyed () {
    this.stopParallax()
  },
  methods: {
    startParallax () {
      var x = 0,
          y = 0,
          friction = 1 / 30;

      const bg = document.getElementById('bg')

      const moveBackground = () => {
        x += (this.lFollowX - x) * friction;
        y += (this.lFollowY - y) * friction;
        
        let translate = 'translate(' + x + 'px, ' + y + 'px) scale(1.1)';
        bg.style.transform = translate

        this.animationId = window.requestAnimationFrame(moveBackground);
      }

      document.addEventListener( 'mousemove', (e) => {
        this.mouseMoved(e)
      });

      moveBackground();
    },
    stopParallax () {
      window.cancelAnimationFrame(this.animationId)
      document.removeEventListener( 'mousemove', this.mouseMoved )
    },
    mouseMoved (e) {
      const lMouseX = Math.max(-100, Math.min(100, window.screen.width / 2 - e.clientX))
      const lMouseY = Math.max(-100, Math.min(100, window.screen.height / 2 - e.clientY))
      this.lFollowX = (20 * lMouseX) / 100
      this.lFollowY = (10 * lMouseY) / 100
    },
    closeMandala () {
      this.$emit('close')
    },
    onIncrement (value) {
      this.mandalaSides = value
    }
  }
}
</script>

<style lang="scss">
$fadeSpeed: 3s;
#bg {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}
.c-background-image {
  position: absolute;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  transform: scale(1.1);
  transition: opacity $fadeSpeed 1s ease-in;
  &__second {
    opacity: 0;
  }
}
.bgfade-enter-active, .bgfade-leave-active {
  transition: opacity $fadeSpeed;
}
.bgfade-enter, .bgfade-leave-to {
  opacity: 0;
  transition-duration: 0.3s;
}

</style>
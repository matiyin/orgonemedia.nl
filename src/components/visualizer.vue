<template>
  <div ref="omviz" class="c-visualizer">
    <canvas id="canvas" />
    <audio id="audio" />
  </div>
</template>

<script>
export default {
  props: {
    audioPlaying: {
      type: Boolean,
      default: () => false
    },
  },
  data () {
    return {
      animationId: false,
      playing: false,
      audio: undefined,
      ctx: undefined,
      analyser: undefined,
      dataArray: undefined,
      containerHeight: undefined,
      topOffset: 100,
      WIDTH: undefined,
      HEIGHT: undefined,
      canvas: undefined,
    }
  },
  computed: {
    getTrack () {
      return require('../assets/dragons-legend.mp3')
    }
  },
  watch: {
    audioPlaying: (newVal, oldVal) => {
      this.audioPlaying = !this.audioPlaying;
    },
  },
  mounted () {
    this.audio = document.getElementById("audio");
    const audio = this.audio;
    audio.src = this.getTrack;
    audio.load();
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const context = new AudioContext();
    const src = context.createMediaElementSource(audio);
    this.analyser = context.createAnalyser();
    const analyser = this.analyser;

    this.canvas = document.getElementById("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    this.ctx = canvas.getContext("2d");
    const ctx = this.ctx;

    src.connect(analyser);
    analyser.connect(context.destination);

    analyser.fftSize = 512;

    const bufferLength = analyser.frequencyBinCount;
    // console.log(bufferLength);

    this.dataArray = new Uint8Array(bufferLength);
    const dataArray = this.dataArray;

    this.WIDTH = canvas.width;
    this.HEIGHT = canvas.height;

    this.setCanvasHeight()
    audio.play();
    this.renderFrame();
    window.onresize = this.onWindowResize;
  },
  destroyed() {
    window.cancelAnimationFrame(this.animationId);
    this.animationId = undefined;
  },
  methods: {
    toggleAudio (audioPlaying) {
      if (audioPlaying) {
        // stop
        this.audio.play();
      } else {
        // start
        this.audio.pause();
      }
      // this.playing = !this.playing
    },
    drawBars (array) {
      const ctx = this.ctx;
      //just show bins with a value over the treshold
      var threshold = 0;
      // clear the current state
      ctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
      //the max count of bins for the visualization
      var maxBinCount = array.length;
      //space between bins
      // var space = 16;
            
      ctx.save();


      ctx.globalCompositeOperation='source-over';

      // console.log('bincount', maxBinCount); //--> 1024
      ctx.scale(0.5, 0.5);
      ctx.translate(window.innerWidth, this.containerHeight+this.topOffset);
      ctx.fillStyle = "#fff";

      var bass = Math.floor(array[1]); //1Hz Frequenz 
      this.setBass(bass);
      const barWidth = 8;
      // const radius = -this.containerHeight/4;
      const radius = -this.containerHeight/4 * bass/120;
      // var radius = 0.45 * window.innerWidth <= 450 ? -(bass * 0.25 + 0.45 * WIDTH) : -(bass * 0.25 + 450);

      var bar_length_factor = 0.4;
      // if ($(window).width() >= 785) {
        // bar_length_factor = 1.0;
      // }
      // else if ($(window).width() < 785) {
      //   bar_length_factor = 1.5;
      // }
      // else if ($(window).width() < 500) {
      //   bar_length_factor = 20.0;
      // }
      //go over each bin
      for ( var i = 0; i < maxBinCount; i++ ){
        
        var value = array[i];
        if (value >= threshold) {			
          ctx.fillRect(0, radius, barWidth, -value / bar_length_factor);
          ctx.rotate((180 / (maxBinCount/4)) * Math.PI/180);   
        }
      }  
      ctx.fillStyle = "#666";      
      for ( var i = 0; i < maxBinCount; i++ ){

        var value = array[i];
        if (value >= threshold) {				
          ctx.rotate(-(180 / (maxBinCount/4+10)) * Math.PI/180);
          ctx.fillRect(0, radius, barWidth, -value / bar_length_factor);
          // ctx.fillRect(0, radius, $(window).width() <= 450 ? 2 : 3, -value / bar_length_factor);
        }
      } 

      ctx.fillStyle = "#000";      
      for ( var i = 0; i < maxBinCount; i++ ){

        var value = array[i];
        if (value >= threshold) {				
          ctx.rotate((180 / (maxBinCount/4)) * Math.PI/180);
          ctx.fillRect(0, radius, barWidth/2, -value / bar_length_factor/2);
          // ctx.fillRect(0, radius, $(window).width() <= 450 ? 2 : 3, -value / bar_length_factor);
        }
      } 
        
      ctx.restore();
    },
    renderFrame () {
      this.animationId = window.requestAnimationFrame(this.renderFrame);
      this.analyser.getByteFrequencyData(this.dataArray);
      this.drawBars(this.dataArray);
    },
    setBass (bass) {
      this.$emit('bassFreq', bass);
    },
    setCanvasHeight () {
      this.containerHeight = document.getElementById('menu').clientWidth;
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
    },
    onWindowResize () {
      window.cancelAnimationFrame(this.animationId);
      this.setCanvasHeight ()
      this.renderFrame()
    }
  },
}
</script>

<style lang="scss">

#canvas {
  position: fixed;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
}
</style>
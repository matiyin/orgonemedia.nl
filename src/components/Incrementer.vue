<template>
  <div class="c-incrementer">
    <div class="c-incrementer__button c-incrementer__button--increment" :class="{'is-disabled': !canIncrement}" @click="increment">
      <slot :name="increment">+</slot>
    </div>
    <div class="c-incrementer__button c-incrementer__button--decrement" :class="{'is-disabled': !canDecrement}" @click="decrement">
      <slot :name="decrement">-</slot>
    </div>
    <div class="c-incrementer__button c-incrementer__button--refresh" :class="{'is-loading': isRefreshing}" @click="refresh">
      <svg width="640" height="640" viewBox="0 0 640 640"><path fill="#fff" d="M320 96v64c-0.085 0-0.186 0-0.286 0-88.366 0-160 71.634-160 160 0 44.254 17.966 84.312 47.003 113.277l0.003 0.003-45.12 45.12c-40.541-40.537-65.616-96.54-65.616-158.4 0-123.712 100.288-224 224-224 0.006 0 0.011 0 0.017 0h-0.001zM478.4 161.6c40.541 40.537 65.616 96.54 65.616 158.4 0 123.712-100.288 224-224 224-0.006 0-0.011 0-0.017 0h0.001v-64c0.085 0 0.186 0 0.286 0 88.366 0 160-71.634 160-160 0-44.254-17.966-84.312-47.003-113.277l-0.003-0.003 45.12-45.12zM320 640l-128-128 128-128v256zM320 256v-256l128 128-128 128z" /></svg>  
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Incrementer',
    props: {
      value: {
        default: 0,
        type: Number
      },
      min: {
        default: 0,
        type: Number
      },
      max: {
        default: undefined,
        type: Number
      },
      step: {
        default: 1,
        type: Number
      },
    },
    data () {
      return {
        intValue: 0,
        isRefreshing: false,
      }
    },
    computed: {
      canIncrement () {
        return (this.max === undefined || ((this.intValue + this.step) <= this.max))
      },
      canDecrement () {
        return ((this.intValue - this.step) >= this.min)
      },
    },
    created () {
      this.intValue = this.value
      if (this.step < 1) this.step = 1
      if (this.max < this.min) this.max = undefined
    },
    methods: {
      increment () {
        if (this.canIncrement) {
          this.intValue = this.intValue + this.step
          this.$emit('increment', this.intValue)
        }
      },
      decrement () {
        if (this.canDecrement) {
          this.intValue = this.intValue - this.step
          this.$emit('increment', this.intValue)
        }
      },
      refresh () {
        if (!this.isRefreshing) {
          this.isRefreshing = true
          this.$emit('onMandalaRefresh')
          let vm = this.$parent
          while(vm) {
            vm.$emit('onMandalaRefresh')
            vm = vm.$parent
          }
          setTimeout(() => {
            this.isRefreshing = false;
          }, 1000);
        }
      },
    },
  }
</script>

<style lang="scss" scoped>
.c-incrementer {
  position: absolute;
  top: 40px;
  left: 40px;
  &__button {
    background-color: #000;
    color: #fff;
    cursor: pointer;
    display: block;
    width: 50px;
    height: 50px;
    font-size: 30px;
    text-align: center;
    line-height: 46px;
    font-weight: bold;
    border-radius: 50%;
    transition: color 0.3s;
    margin-bottom: 10px;
    transition: opacity 0.3s;

    &:hover {
      color: #EC008C;
      path {
        fill: #EC008C;
      }
    }

    &.is-disabled {
      opacity: 0;
    }
    &--refresh {
      padding: 8px 10px 0;
      box-sizing: border-box;
      svg {
        width: 100%;
        height: auto;
      }
      &.is-loading {
        svg {
          animation: refreshIcon 1s linear infinite;
        }
      }
    }
  }
  @media screen and (max-width: 900px) {
    top: auto;
    bottom: 20px;
    left: 20px;
  }
}
body.user-is-touching .c-incrementer__button:hover {
  color: #fff;
  path {
    fill: #fff;
  }
}
</style>
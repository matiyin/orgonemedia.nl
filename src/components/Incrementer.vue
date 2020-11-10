<template>
  <div class="c-incrementer">
    <div class="c-incrementer__button c-incrementer__button--close" @click="close">
      <svg width="512" height="512" viewBox="0 0 512 512"><path fill="#fff" d="M507.331 411.33c-0.002-0.002-0.004-0.004-0.006-0.005l-155.322-155.325 155.322-155.325c0.002-0.002 0.004-0.003 0.006-0.005 1.672-1.673 2.881-3.627 3.656-5.708 2.123-5.688 0.912-12.341-3.662-16.915l-73.373-73.373c-4.574-4.573-11.225-5.783-16.914-3.66-2.080 0.775-4.035 1.984-5.709 3.655 0 0.002-0.002 0.003-0.004 0.005l-155.324 155.326-155.324-155.325c-0.002-0.002-0.003-0.003-0.005-0.005-1.673-1.671-3.627-2.88-5.707-3.655-5.69-2.124-12.341-0.913-16.915 3.66l-73.374 73.374c-4.574 4.574-5.784 11.226-3.661 16.914 0.776 2.080 1.985 4.036 3.656 5.708 0.002 0.001 0.003 0.003 0.005 0.005l155.325 155.324-155.325 155.326c-0.001 0.002-0.003 0.003-0.004 0.005-1.671 1.673-2.88 3.627-3.657 5.707-2.124 5.688-0.913 12.341 3.661 16.915l73.374 73.373c4.575 4.574 11.226 5.784 16.915 3.661 2.080-0.776 4.035-1.985 5.708-3.656 0.001-0.002 0.003-0.003 0.005-0.005l155.324-155.325 155.324 155.325c0.002 0.001 0.004 0.003 0.006 0.004 1.674 1.672 3.627 2.881 5.707 3.657 5.689 2.123 12.342 0.913 16.914-3.661l73.373-73.374c4.574-4.574 5.785-11.227 3.662-16.915-0.776-2.080-1.985-4.034-3.657-5.707z"></path></svg>  
    </div>
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
      close () {
        this.$emit('close')
      }
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

    &:hover:not(.is-disabled) {
      color: #EC008C;
      path {
        fill: #EC008C;
      }
    }

    &.is-disabled {
      pointer-events: none;
      color: #333;
    }
    &--refresh,
    &--close {
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
    &--close {
      padding-top: 2px;
      svg {
        width: 60%;
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
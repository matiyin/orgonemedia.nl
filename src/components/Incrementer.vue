<template>
  <div class="c-incrementer">
    <div class="c-incrementer__button c-incrementer__button--increment" @click="increment" :class="{'is-disabled': !canIncrement}">
      <slot :name="increment">+</slot>
    </div>
    <div class="c-incrementer__button c-incrementer__button--decrement" @click="decrement" :class="{'is-disabled': !canDecrement}">
      <slot :name="decrement">-</slot>
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
        intValue: 0
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
      }
    },
    watch: {
      value: {
        handler: function (newVal, oldVal) {
          this.intValue = newVal
        }
      }
    },
    created () {
      this.intValue = this.value
      if (this.step < 1) this.step = 1
      if (this.max < this.min) this.max = undefined
    }
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
    }

    &.is-disabled {
      opacity: 0;
    }
  }
  @media screen and (max-width: 900px) {
    top: auto;
    bottom: 20px;
    left: 20px;
  }
}
</style>
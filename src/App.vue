<template>
  <div v-hammer:swipe="touchUI" class="c-page" :class="{'has-touch': hasTouch}">
    <transition name="fade-bg">
      <page-loader v-show="!imagesLoaded" />
    </transition>
    <transition name="fade-bg">
      <background
        v-show="!loading && imagesLoaded"
        :image="splashSrc"
        :show-mandala="showMandala"
        :next-image="splashNext"
        :is-activated="isActivated"
        @onMandalaRefresh="onMandalaRefresh"
        @close="showMandala=false"
      />
    </transition>
    <!-- <transition name="fade-bg">
      <div v-show="showPattern" class="c-pattern" :style="{ 'background-image': 'url(' + getPattern + ')' }" />
    </transition> -->
    <transition name="fade">
      <svg
        v-show="!loading && imagesLoaded && !creditShown && !showMandala"
        id="background"
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        @click="closeMenuContent"
      />
    </transition>
    <transition name="fade-logo">
      <div v-show="!loading && imagesLoaded" :class="{'is-activated': isActivated}" class="c-orgone">
        <svg id="menu" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        <svg id="logobg" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" />
        <svg id="logo" width="100%" height="100%" preserveAspectRatio="xMidYMid meet" @click="activate" />
      </div>
    </transition>
    <transition name="title">
      <div v-show="!creditShown && !showMandala" :class="{'is-activated': isActivated}" class="c-content" v-html="infoContent" />
    </transition>
    <div v-if="splashCredit" class="c-credit" :class="{'is-open': creditShown}">
      <transition name="credits">
        <div v-show="creditShown" class="c-credit__content">
          <a :href="splashCredit.sourceUrl+'?utm_source=Orgone&utm_medium=referral'" target="blank">Photo</a> 
          <span> by </span>
          <a :href="splashCredit.userUrl+'?utm_source=Orgone&utm_medium=referral'" target="blank">{{ splashCredit.user }}</a>
          <span> on </span>
          <a href="https://unsplash.com/?utm_source=Orgone&utm_medium=referral" target="blank">Unsplash</a>
        </div>
      </transition>
      <div class="c-credit__icon" @click="showCredit"><img src="./assets/icons/info.svg" alt="Info"></div>
    </div>
    <visualizer v-if="audioPlaying" :audio-playing="audioPlaying" @bassFreq="pumpBase" />
    <transition appear name="menu-content">
      <div v-show="menuContent" :key="menuTitle" class="c-menu-content" :class="menuName">
        <header v-hammer:swipe.down="closeMenuContent" @click="closeMenuContent">{{ menuTitle }}<span>[x]</span></header>
        <div ref="scrollBar" v-bar>
          <div>
            <div v-html="menuContent" /> 
          </div>
        </div>
      </div>
    </transition>
    <div v-show="errored" class="c-error">Unsplash API unavailable, using a fallback image</div>
    <transition appear name="no-cookie">
      <no-cookie v-show="showNoCookie" @close="closeNoCookie" />
    </transition>
    <transition name="credits">
      <div v-if="pwa.updateExists" class="c-refresh-pwa c-notification">
        <p @click="refreshApp">New version available!<span>Click to update</span></p>
        <div class="c-notification__icon" @click="refreshApp">
          <svg width="640" height="640" viewBox="0 0 640 640"><path fill="#fff" d="M320 96v64c-0.085 0-0.186 0-0.286 0-88.366 0-160 71.634-160 160 0 44.254 17.966 84.312 47.003 113.277l0.003 0.003-45.12 45.12c-40.541-40.537-65.616-96.54-65.616-158.4 0-123.712 100.288-224 224-224 0.006 0 0.011 0 0.017 0h-0.001zM478.4 161.6c40.541 40.537 65.616 96.54 65.616 158.4 0 123.712-100.288 224-224 224-0.006 0-0.011 0-0.017 0h0.001v-64c0.085 0 0.186 0 0.286 0 88.366 0 160-71.634 160-160 0-44.254-17.966-84.312-47.003-113.277l-0.003-0.003 45.12-45.12zM320 640l-128-128 128-128v256zM320 256v-256l128 128-128 128z" /></svg>  
        </div>
        <div class="c-notification__close" @click="closeNotification">
          <svg width="512" height="512" viewBox="0 0 512 512"><path fill="#fff" d="M446.627 110.627l-45.254-45.254-145.373 145.372-145.373-145.372-45.254 45.253 145.373 145.374-145.373 145.373 45.254 45.254 145.373-145.373 145.373 145.373 45.254-45.255-145.372-145.372z" /></svg>
        </div>
      </div>
    </transition>
    <transition name="credits">
      <div v-if="pwa.showAddtoHome" class="c-add-to-home c-notification">
        <p @click="addToHomeScreen">Install web app</p>
        <div class="c-notification__icon" @click="addToHomeScreen">
          <svg width="640" height="640" viewBox="0 0 640 640"><path fill="#fff" d="M64 64c0-35.2 28.8-64 64-64h384c35.346 0 64 28.654 64 64v0 576l-256-128-256 128v-576zM128 64v480l192-96 192 96v-480h-384zM288 224v-64h64v64h64v64h-64v64h-64v-64h-64v-64h64z" /></svg>
        </div>
        <div class="c-notification__close" @click="closeNotification">
          <svg width="512" height="512" viewBox="0 0 512 512"><path fill="#fff" d="M446.627 110.627l-45.254-45.254-145.373 145.372-145.373-145.372-45.254 45.253 145.373 145.374-145.373 145.373 45.254 45.254 145.373-145.373 145.373 145.373 45.254-45.255-145.372-145.372z" /></svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import Snap from "snapsvg"
import axios from "axios"
import background from "@/components/background";
import visualizer from "@/components/visualizer";
import pageLoader from "@/components/pageLoader";
import noCookie from "@/components/noCookie";
import data from './assets/menuItems.json'
import './assets/app.scss'
export default {
  components: {
    background,
    visualizer,
    pageLoader,
    noCookie,
  },
  data() {
    return {
      hasTouch: false,
      loading: true,
      imagesLoaded: false,
      showPattern: true,
      errored: false,
      splashID: 'e258f6b9997c09e3ac471770475c0b99abb31419cc7cd9b9368ab67b81c22454',
      splashSrc: null,
      splashNext: null,
      splashCredit: null,
      isActivated: false,
      isHovering: false,
      creditShown: false,
      audioPlaying: false,
      showMandala: false,
      showNoCookie: true,
      svg: {
        menu: undefined,
        logo: undefined,
        background: undefined,
        logoStroke: undefined,
        g_circle: [],
        m_line: [],
        m_circle: [],
        i_icon: [],
        g_menuitem: [],
        g_pattern: undefined,
      },
      infoContent: '<h1>enjoying web development 	&crarr;</h1>',
      menuTitle: null,
      menuName: null,
      menuContent: null,
      menuItems: data.data,
      patterns: [
        `M77.17 0H80v2.83l-.1.1A39.9 39.9 0 0 1 74.64 20a39.9 39.9 0 0 1 5.24 17.06l.11.11v2.89c-.01 6.9-1.8 13.79-5.35 19.94A39.96 39.96 0 0 1 80 79.94V80h-2.83L66.84 69.66a39.83 39.83 0 0 1-24.1 10.25l.09.09h-5.66l.1-.1c-8.7-.58-17.22-4-24.1-10.23L2.82 80H0V79.94c.01-6.9 1.8-13.8 5.35-19.94A39.96 39.96 0 0 1 0 40.06V37.17l.1-.1A39.9 39.9 0 0 1 5.36 20 39.9 39.9 0 0 1 .1 2.94L0 2.83V0h2.83l-.1.1a39.83 39.83 0 0 1 24.1 10.24L37.18 0H40c0 6.92-1.78 13.83-5.35 20A39.96 39.96 0 0 1 40 40c0-6.92 1.78-13.83 5.35-20A39.96 39.96 0 0 1 40 0h2.83l10.33 10.34A39.83 39.83 0 0 1 77.26.09L77.17 0zm.77 77.94c-.3-5.52-1.8-11-4.49-16a40.18 40.18 0 0 1-5.17 6.34l9.66 9.66zm-12.52-9.7l-6.83-6.83-5.46 5.46-1.41 1.41-9.66 9.66c8.4-.45 16.69-3.68 23.36-9.7zm-23.07 6.58l7.99-7.98a40.05 40.05 0 0 1-3.79-4.9 37.88 37.88 0 0 0-4.2 12.88zM47.68 60a37.98 37.98 0 0 0 4.07 5.42L57.17 60l-5.42-5.42A38 38 0 0 0 47.68 60zm2.66-6.84a40.06 40.06 0 0 0-3.79 4.9 37.88 37.88 0 0 1-4.2-12.88l7.99 7.98zm1.38-1.44l1.41 1.41 5.46 5.46 6.83-6.84a37.85 37.85 0 0 0-23.36-9.7l9.66 9.67zM60 60l6.87 6.87A38.1 38.1 0 0 0 72.32 60a38.11 38.11 0 0 0-5.45-6.87L60 60zm-14.65 0a39.9 39.9 0 0 0-5.24 17.06l-.11.11-.1-.1A39.9 39.9 0 0 0 34.64 60a39.9 39.9 0 0 0 5.24-17.06l.11-.11.1.1A39.9 39.9 0 0 0 45.36 60zm9.23-48.25a37.85 37.85 0 0 1 23.36-9.7l-9.66 9.67-1.41 1.41-5.46 5.46-6.83-6.84zm13.67 13.67L62.83 20l5.42-5.42A38 38 0 0 1 72.32 20a37.98 37.98 0 0 1-4.07 5.42zm5.2-3.47a40.05 40.05 0 0 1-3.79 4.89l7.99 7.98c-.61-4.45-2.01-8.82-4.2-12.87zm-6.58 4.92l1.41 1.41 9.66 9.66a37.85 37.85 0 0 1-23.36-9.7l6.83-6.83 5.46 5.46zM53.13 13.13L60 20l-6.87 6.87A38.11 38.11 0 0 1 47.68 20a38.1 38.1 0 0 1 5.45-6.87zm-1.41-1.41l-9.66-9.66c.3 5.52 1.8 11 4.49 16a40.18 40.18 0 0 1 5.17-6.34zm-9.66 26.22c.3-5.52 1.8-11 4.49-16a40.18 40.18 0 0 0 5.17 6.34l-9.66 9.66zm26.22 13.78l9.66-9.66c-.3 5.52-1.8 11-4.49 16a40.18 40.18 0 0 0-5.17-6.34zm8.98-11.81L66.84 50.34a39.83 39.83 0 0 0-24.1-10.25l10.42-10.43a39.83 39.83 0 0 0 24.1 10.25zm-7.6-26.75a40.06 40.06 0 0 1 3.79 4.9 37.88 37.88 0 0 0 4.2-12.88l-7.99 7.98zm-31.72 28.9c-8.4.45-16.69 3.68-23.36 9.7l6.83 6.83 5.46-5.46 1.41-1.41 9.66-9.66zM22.83 60l5.42 5.42c1.54-1.7 2.9-3.52 4.07-5.42a38 38 0 0 0-4.07-5.42L22.83 60zm5.45 8.28l-1.41-1.41-5.46-5.46-6.83 6.84a37.85 37.85 0 0 0 23.36 9.7l-9.66-9.67zm9.37 6.54l-7.99-7.98a40.05 40.05 0 0 0 3.79-4.9 37.88 37.88 0 0 1 4.2 12.88zM20 60l-6.87-6.87A38.11 38.11 0 0 0 7.68 60a38.11 38.11 0 0 0 5.45 6.87L20 60zm17.26-19.9L26.84 29.65a39.83 39.83 0 0 1-24.1 10.25l10.42 10.43a39.83 39.83 0 0 1 24.1-10.25zm-35.2 1.96l9.66 9.66a40.18 40.18 0 0 0-5.17 6.33c-2.7-5-4.2-10.47-4.5-16zm4.49 19.89c-2.7 5-4.2 10.47-4.5 16l9.67-9.67a40.18 40.18 0 0 1-5.17-6.33zm31.1-16.77c-.61 4.45-2.01 8.82-4.2 12.87a40.06 40.06 0 0 0-3.79-4.89l7.99-7.98zm-4.2-23.23c2.7 5 4.2 10.47 4.5 16l-9.67-9.67c1.97-1.97 3.7-4.1 5.17-6.33zm-14.86-.54l6.83 6.84a37.85 37.85 0 0 1-23.36 9.7l9.66-9.67 1.41-1.41 5.46-5.46zm-8.25 5.43l-7.99 7.98c.61-4.45 2.01-8.82 4.2-12.87a40.04 40.04 0 0 0 3.79 4.89zm1.41-1.42A37.99 37.99 0 0 1 7.68 20a38 38 0 0 1 4.07-5.42L17.17 20l-5.42 5.42zm-5.2-7.37a40.04 40.04 0 0 1 3.79-4.89L2.35 5.18c.61 4.45 2.01 8.82 4.2 12.87zm6.58-4.92l-1.41-1.41-9.66-9.66a37.85 37.85 0 0 1 23.36 9.7l-6.83 6.83-5.46-5.46zm13.74 13.74L20 20l6.87-6.87A38.1 38.1 0 0 1 32.32 20a38.1 38.1 0 0 1-5.45 6.87zm6.58-8.82a40.18 40.18 0 0 0-5.17-6.33l9.66-9.66c-.3 5.52-1.8 11-4.49 16z`,
        `M0,0 L12,0 L12,6 L0,6 L0,0 Z M28,8 L40,8 L40,14 L28,14 L28,8 Z M42,0 L54,0 L54,6 L42,6 L42,0 Z M56,0 L68,0 L68,6 L56,6 L56,0 Z M56,8 L68,8 L68,14 L56,14 L56,8 Z M42,8 L54,8 L54,14 L42,14 L42,8 Z M42,24 L54,24 L54,30 L42,30 L42,24 Z M56,16 L68,16 L68,22 L56,22 L56,16 Z M70,16 L82,16 L82,22 L70,22 L70,16 Z M70,0 L82,0 L82,6 L70,6 L70,0 Z M28,32 L40,32 L40,38 L28,38 L28,32 Z M14,16 L26,16 L26,22 L14,22 L14,16 Z M0,24 L12,24 L12,30 L0,30 L0,24 Z M0,32 L12,32 L12,38 L0,38 L0,32 Z M14,32 L26,32 L26,38 L14,38 L14,32 Z M28,40 L40,40 L40,46 L28,46 L28,40 Z M14,40 L26,40 L26,46 L14,46 L14,40 Z M42,40 L54,40 L54,46 L42,46 L42,40 Z M56,32 L68,32 L68,38 L56,38 L56,32 Z M56,24 L68,24 L68,30 L56,30 L56,24 Z M70,32 L82,32 L82,38 L70,38 L70,32 Z M70,40 L82,40 L82,46 L70,46 L70,40 Z M14,24 L26,24 L26,30 L14,30 L14,24 Z M28,16 L40,16 L40,22 L28,22 L28,16 Z M14,8 L26,8 L26,14 L14,14 L14,8 Z M0,8 L12,8 L12,14 L0,14 L0,8 Z`,
      ],
      pwa: {
        refreshing: false,
        registration: null,
        updateExists: false,
        showAddtoHome: false,
        deferredPrompt: null,
      },
      inactiveTimer: null,
    };
  },
  computed: {
    getPlaceholder () {
      return require('./assets/placeholder_bg.jpg')
    },
    // getPattern () {
    //   return require('./assets/patterns/church-on-sunday.svg')
    // },
    menuItemRadius () {
      return window.innerWidth > 900 ? 7 : 9
    },
    menuItemLength () {
      return window.innerWidth > 900 ? 9 : 9
    },
  },
  watch: { 
    hasTouch: function(newVal, oldVal) {
      console.log('hasTouch:', newVal)
    },      
  },
  created () {
    const vm = this;
    // Listen for swUpdated event and display refresh snackbar as required.
    document.addEventListener('swUpdated', vm.showRefreshUI, { once: true });
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('swUpdated:', navigator.serviceWorker)
      if (vm.refreshing) return
      vm.refreshing = true
      window.location.reload()
    });
    // show Add to Home PWA popup
    window.addEventListener('beforeinstallprompt', function (e) {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault()
      // Stash the event so it can be triggered later.
      vm.pwa.deferredPrompt = e
     vm.toggleAddToHome()
    });
  },
  mounted () {
    const vm = this;
    this.getImage()
    this.detectTouch()
    window.addEventListener( 'resize', this.onWindowResize, false )
    // SVG stuff
    const path = "M54,90c-19.9,0-36-16.1-36-36s16.1-36,36-36s36,16.1,36,36h-36";

    // background fill
    this.svg.background = window.Snap("#background");
    this.svg.background.rect(0,0,100,100);
    this.svg.background.attr({
      fill: "#EC008C",
      stroke: "none",
    });

    // background pattern
      // const g_pattern = vm.svg.background.path(vm.patterns[0])
      // .attr({
      //   fill: "#000",
      //   fillOpacity: "0.1",
      //   stroke: "none",
      //   fillRule: "evenodd",
      //   patternContentUnits: "userSpaceOnUse",
      // })
      // .pattern(0, 0, 80, 80)
      // .transform('s2.5');
      // vm.g_pattern = vm.svg.background.rect(0,0,500, 500)
      // vm.g_pattern.attr({
      //   preserveAspectRatio: "xMidYMid slice",
      //   fill: g_pattern
      // })
      



    // logo fill 
    this.svg.logobg = window.Snap("#logobg");
    this.svg.logobg.attr({ viewBox: "0 0 108 108" });
    const gl_circle = this.svg.logobg.circle(54,54,36).attr({
      fill: "#fff",
    });
    const gl_rect = this.svg.logobg.rect(54,54,72,72).attr({
      fill: "#000",
    });
    const bgmask = this.svg.logobg.group(gl_circle,gl_rect);
    const bgl_rect = this.svg.logobg.rect(0,0,108,108).attr({
      fill: "#EC008C",
      mask: bgmask,
    });

    // logo stroke
    this.svg.logo = window.Snap("#logo");
    this.svg.logo.attr({ viewBox: "0 0 108 108" });
    this.svg.logoStroke  = this.svg.logo.path( path );
    this.svg.logoStroke.attr({
      stroke: "#000",
      fill: "none",
      strokeWidth: 0,
      strokeDashoffset: 220,
      strokeDasharray: 220,
    });

    // menu items
    this.svg.menu = window.Snap("#menu");
    this.svg.menu.attr({ viewBox: "0 0 108 108" });
    
    let count = 0;
    for (let index = 0; index < this.menuItems.length; index++) {
      const data = this.menuItems[index];
      this.svg.m_line[index]  = this.svg.menu.line(54,54,54,9.4).attr({
        stroke: "#000",
        fill: "none",
        strokeWidth: 0.2,
      });
      this.svg.m_circle[index] = this.svg.menu.circle(54,this.menuItemLength,this.menuItemRadius).attr({
        fill: "#000",
      });
      this.svg.i_icon[index] = this.svg.menu.path(data.icon).attr({
        fill: "#fff",
      });
      this.svg.g_circle[index] = this.svg.menu.group(this.svg.m_circle[index],this.svg.i_icon[index]);
      this.svg.g_menuitem[index] = this.svg.menu.group(this.svg.m_line[index],this.svg.g_circle[index]);
      const vm = this;
      this.svg.g_menuitem[index].node.onclick = () => {
        // this.resetMenuItems();
        window.Snap.animate( 1, 1.3, function( value ) {
          vm.svg.g_circle[index].transform('s' + value );
        }, 100, mina.backout, function() {
          window.Snap.animate( 1.3, 1, function( value ) {
            vm.svg.g_circle[index].transform('s' + value );
          }, 200, mina.easein);
        });
        // rotate refresh icon
        if (data.name == 'refresh') {
          window.Snap.animate( 0, 360, function( value ) {
            vm.svg.i_icon[index].transform('r' + value );
          }, 2000, mina.easein);
        }
        this.openMenuItem(vm.svg.g_menuitem[index].node,data)
      };
      if (index !=0) this.svg.i_icon[index].transform( `r${count*-45}` );
      // console.log('count:', count)
      this.svg.g_menuitem[index].transform( `r${count*45},54,54` );
      if (count === 2) { count = count+2 } else { count++ };

    }

    // logo hover
    vm.svg.logo.mouseover(function() {
      if (!vm.isActivated && !this.hasTouch && window.innerWidth > 1024) {
        vm.isHovering = true
        window.Snap.animate(220,0, ( value ) => {
          vm.svg.logoStroke.attr({ 'strokeDashoffset': value, 'strokeWidth': 0.5 })
        }, 500 );
      }
    }).mouseout(function() {
      if (!vm.isActivated && !this.hasTouch && window.innerWidth > 1024) {
        window.Snap.animate(0,220, ( value ) => {
          vm.svg.logoStroke.attr({ 'strokeDashoffset': value, 'strokeWidth': 0.5 })
        }, 500 );
        vm.isHovering = false
      }
    });

    setTimeout(() => {
      // animate logo start (mask)
      window.Snap.animate(72,0, ( value ) => {
        gl_rect.transform( `t${value},t${value}`);
      }, 3000, () => {
        setTimeout(() => {
          this.showNoCookie = false
        }, 4000);
        this.inactiveTimer = setInterval(() => {
          this.animateInactive ()
        }, 8000)
      } );   
    }, 3000);

  },
  methods: {
    animateInactive () {
      if (!this.isActivated && !this.isHovering) {
        window.Snap.animate(220,0, ( value ) => {
          this.svg.logoStroke.attr({ 'strokeDashoffset': value, 'strokeWidth': 2 })
        }, 500, mina.easeout() );
        setTimeout(() => {
          if (!this.isHovering) {
            window.Snap.animate(0,220, ( value ) => {
              this.svg.logoStroke.attr({ 'strokeDashoffset': value, 'strokeWidth': 1 })
            }, 300 );
          }
        }, 3000);
      }
    },
    detectTouch () {
      window.addEventListener('touchstart', function onFirstTouch() {
        document.body.classList.add('user-is-touching');
        this.hasTouch = true;
        window.removeEventListener('touchstart', onFirstTouch, false);
      }, false);
    },
    getImage () {
      axios
        // .get('https://api.unsplash.com/photos/random/?client_id='+this.splashID)
        .get('https://api.unsplash.com/photos/random/?query=nature&orientation=landscape&client_id='+this.splashID)
        .then(response => {
          if (this.splashSrc) {
            // replace image
            const img = new Image()
            img.src = response.data.urls.raw + "&w=1800"
            setTimeout(() => {
              if ( !img.complete || !img.naturalWidth ) {
                this.handleLoadError('ERROR: Unsplash image took too long to load...')
              } else {
                this.errored = false
                this.hasError = false
              }
            }, 10000);
            img.onload = this.handleLoad
            img.onerror = this.handleError
            this.splashNext = img.src
            this.splashCredit = {
              sourceUrl: response.data.links.html,
              userUrl: response.data.user.links.html,
              user: response.data.user.name,
            }
          } else {
            // first image
            const img = new Image()
            img.src = response.data.urls.raw + "&w=1800"
            setTimeout(() => {
              if ( !img.complete || !img.naturalWidth ) {
                this.handleLoadError('ERROR: Unsplash image took too long to load...')
              }
            }, 10000);
            img.onload = this.handleLoad
            img.onerror = this.handleError
            this.splashSrc = img.src
            this.splashCredit = {
              sourceUrl: response.data.links.html,
              userUrl: response.data.user.links.html,
              user: response.data.user.name,
            }
            this.loading = false
          }
        })
        .catch(error => {
          this.handleLoadError(error)
        })
    },
    // animate logo
    activate () {
      const vm = this;
      clearInterval(this.inactiveTimer)
      if (this.isActivated) {
        this.isActivated = false;
        // close
        window.Snap.animate(0,220, function( value ){
          vm.svg.logoStroke.attr({ 'strokeDashoffset': value })
        }, 500 );
        window.Snap.animate(18,0, function( value ){
          vm.svg.logoStroke.attr({ 'strokeWidth': value })
        }, 450 );
        // close menu content
        this.closeMenuContent();
      } else {
        this.isActivated = true;
        // open
        window.Snap.animate(220,0, function( value ){
          vm.svg.logoStroke.attr({ 'strokeDashoffset': value })
        }, 1000 );
        window.Snap.animate(0,18, function( value ){
          vm.svg.logoStroke.attr({ 'strokeWidth': value })
        }, 900 );
        this.closeMandala()
      }
    },
    // open Unsplash credits 
    showCredit () {
      if (!this.creditShown) {
        setTimeout(() => {
          this.creditShown = false
        }, 8000);
      }
      this.closeMenuContent()
      this.isActivated = true
      this.activate()
      this.creditShown = !this.creditShown
    },
    handleLoad () {
      this.imagesLoaded = true
      const logo = document.getElementById('logobg')
      setTimeout(() => {
        logo.classList.remove('is-rotating')
      }, 3000);
    },
    handleError () {
      console.error('error loading images')
      this.hasError = true
      setTimeout(() => {  
        this.hasError = false
      }, 3000);
    },
    handleLoadError (error) {
      console.error(error)
      this.errored = true
      this.handleLoad
      this.imagesLoaded = true
      this.splashSrc = this.getPlaceholder
      this.loading = false
      this.hasError = true
    },
    openMenuItem (el,data) {
      this.creditShown = false
      if (data.name != 'audio') {
        if (el.getAttribute('class') != null) {
          this.closeMenuContent()
        } else {
          this.resetMenuItems()
          el.classList.add('is-menu-active')
          this.menuContent = data.content
          this.menuTitle = data.title
          this.menuName = data.name
        }
      }
      switch (data.name) {
        case 'goodies':
          this.showMandala = !this.showMandala
          if (this.showMandala) this.resetAudio()
          // this.isActivated = false
          this.activate()
          break;
      
        case 'audio':
          if (this.audioPlaying) this.resetAudio()
          this.showMandala = false
          this.resetMenuItems()
          this.audioPlaying = !this.audioPlaying
          break;
      
        case 'refresh':
          this.getImage()
          this.showCredit()
          const logo = document.getElementById('logobg')
          logo.classList.add('is-rotating')
          break;
      
        default:
          break;
      }
    },
    closeNoCookie () {
      this.showNoCookie = false
    },
    closeMenuContent () {
      this.menuContent = null
      this.resetMenuItems()
    },
    closeMandala () {
      this.showMandala = false
    },
    onMandalaRefresh () {
      this.getImage()
    },
    resetMenuItems () {
      const menuItems = document.querySelectorAll('.is-menu-active');
      if (menuItems.length) {
        Array.from(menuItems).forEach( el => {
          el.removeAttribute('class')
        });
      }
    },
    pumpBase (bass) {
      // console.log(bass);
      this.svg.logo.node.style.transform = 'scale('+bass/500+')';
      this.svg.logobg.node.style.transform = 'scale('+bass/500+')';
      // this.svg.logo.node.style.transitionTimingFunction = 'linear';
      // this.svg.logobg.node.style.transitionTimingFunction = 'linear';
      this.svg.logo.node.style.transition = 'none';
      this.svg.logobg.node.style.transition = 'none';
    },
    resetAudio () {
      this.svg.logo.node.removeAttribute('style')
      this.svg.logobg.node.removeAttribute('style')
    },
    // setCanvasHeight () {
    //   console.log('this.$refs.visualizer:', this.$refs.visualizerref)
    //   // this.$refs.visualizer.innerHeight = this.$refs.visualizer.innerWidth
    // },
    onWindowResize () {
    },
    // PWA refresh
    showRefreshUI (e) {
      this.pwa.registration = e.detail;
      this.pwa.updateExists = true;
    },
    refreshApp () {
      this.pwa.updateExists = false;
      if (!this.pwa.registration || !this.pwa.registration.waiting) { return; }
      this.pwa.registration.waiting.postMessage('skipWaiting');
    },
    toggleAddToHome () {
      this.pwa.showAddtoHome = !this.pwa.showAddtoHome
    },
    addToHomeScreen () {
      this.toggleAddToHome()
      this.pwa.deferredPrompt.prompt()  // Wait for the user to respond to the prompt
      this.pwa.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        this.pwa.deferredPrompt = null
      });
    },
    closeNotification () {
      this.pwa.updateExists = false
      this.pwa.showAddtoHome = false
    },
    // activate menu on touch, except when menu content is open
    touchUI (e) {
      if (this.menuContent != null) return
      this.activate()
    }
  },
}
</script>

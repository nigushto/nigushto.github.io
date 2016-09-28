/*!
Waypoints - 3.1.1
Copyright © 2011-2015 Caleb Troughton
Licensed under the MIT license.
https://github.com/imakewebthings/waypoints/blog/master/licenses.txt
*/
!function(){"use strict";function t(o){if(!o)throw new Error("No options passed to Waypoint constructor");if(!o.element)throw new Error("No element option passed to Waypoint constructor");if(!o.handler)throw new Error("No handler option passed to Waypoint constructor");this.key="waypoint-"+e,this.options=t.Adapter.extend({},t.defaults,o),this.element=this.options.element,this.adapter=new t.Adapter(this.element),this.callback=o.handler,this.axis=this.options.horizontal?"horizontal":"vertical",this.enabled=this.options.enabled,this.triggerPoint=null,this.group=t.Group.findOrCreate({name:this.options.group,axis:this.axis}),this.context=t.Context.findOrCreateByElement(this.options.context),t.offsetAliases[this.options.offset]&&(this.options.offset=t.offsetAliases[this.options.offset]),this.group.add(this),this.context.add(this),i[this.key]=this,e+=1}var e=0,i={};t.prototype.queueTrigger=function(t){this.group.queueTrigger(this,t)},t.prototype.trigger=function(t){this.enabled&&this.callback&&this.callback.apply(this,t)},t.prototype.destroy=function(){this.context.remove(this),this.group.remove(this),delete i[this.key]},t.prototype.disable=function(){return this.enabled=!1,this},t.prototype.enable=function(){return this.context.refresh(),this.enabled=!0,this},t.prototype.next=function(){return this.group.next(this)},t.prototype.previous=function(){return this.group.previous(this)},t.invokeAll=function(t){var e=[];for(var o in i)e.push(i[o]);for(var n=0,r=e.length;r>n;n++)e[n][t]()},t.destroyAll=function(){t.invokeAll("destroy")},t.disableAll=function(){t.invokeAll("disable")},t.enableAll=function(){t.invokeAll("enable")},t.refreshAll=function(){t.Context.refreshAll()},t.viewportHeight=function(){return window.innerHeight||document.documentElement.clientHeight},t.viewportWidth=function(){return document.documentElement.clientWidth},t.adapters=[],t.defaults={context:window,continuous:!0,enabled:!0,group:"default",horizontal:!1,offset:0},t.offsetAliases={"bottom-in-view":function(){return this.context.innerHeight()-this.adapter.outerHeight()},"right-in-view":function(){return this.context.innerWidth()-this.adapter.outerWidth()}},window.Waypoint=t}(),function(){"use strict";function t(t){window.setTimeout(t,1e3/60)}function e(t){this.element=t,this.Adapter=n.Adapter,this.adapter=new this.Adapter(t),this.key="waypoint-context-"+i,this.didScroll=!1,this.didResize=!1,this.oldScroll={x:this.adapter.scrollLeft(),y:this.adapter.scrollTop()},this.waypoints={vertical:{},horizontal:{}},t.waypointContextKey=this.key,o[t.waypointContextKey]=this,i+=1,this.createThrottledScrollHandler(),this.createThrottledResizeHandler()}var i=0,o={},n=window.Waypoint,r=window.onload;e.prototype.add=function(t){var e=t.options.horizontal?"horizontal":"vertical";this.waypoints[e][t.key]=t,this.refresh()},e.prototype.checkEmpty=function(){var t=this.Adapter.isEmptyObject(this.waypoints.horizontal),e=this.Adapter.isEmptyObject(this.waypoints.vertical);t&&e&&(this.adapter.off(".waypoints"),delete o[this.key])},e.prototype.createThrottledResizeHandler=function(){function t(){e.handleResize(),e.didResize=!1}var e=this;this.adapter.on("resize.waypoints",function(){e.didResize||(e.didResize=!0,n.requestAnimationFrame(t))})},e.prototype.createThrottledScrollHandler=function(){function t(){e.handleScroll(),e.didScroll=!1}var e=this;this.adapter.on("scroll.waypoints",function(){(!e.didScroll||n.isTouch)&&(e.didScroll=!0,n.requestAnimationFrame(t))})},e.prototype.handleResize=function(){n.Context.refreshAll()},e.prototype.handleScroll=function(){var t={},e={horizontal:{newScroll:this.adapter.scrollLeft(),oldScroll:this.oldScroll.x,forward:"right",backward:"left"},vertical:{newScroll:this.adapter.scrollTop(),oldScroll:this.oldScroll.y,forward:"down",backward:"up"}};for(var i in e){var o=e[i],n=o.newScroll>o.oldScroll,r=n?o.forward:o.backward;for(var s in this.waypoints[i]){var a=this.waypoints[i][s],l=o.oldScroll<a.triggerPoint,h=o.newScroll>=a.triggerPoint,p=l&&h,u=!l&&!h;(p||u)&&(a.queueTrigger(r),t[a.group.id]=a.group)}}for(var c in t)t[c].flushTriggers();this.oldScroll={x:e.horizontal.newScroll,y:e.vertical.newScroll}},e.prototype.innerHeight=function(){return this.element==this.element.window?n.viewportHeight():this.adapter.innerHeight()},e.prototype.remove=function(t){delete this.waypoints[t.axis][t.key],this.checkEmpty()},e.prototype.innerWidth=function(){return this.element==this.element.window?n.viewportWidth():this.adapter.innerWidth()},e.prototype.destroy=function(){var t=[];for(var e in this.waypoints)for(var i in this.waypoints[e])t.push(this.waypoints[e][i]);for(var o=0,n=t.length;n>o;o++)t[o].destroy()},e.prototype.refresh=function(){var t,e=this.element==this.element.window,i=this.adapter.offset(),o={};this.handleScroll(),t={horizontal:{contextOffset:e?0:i.left,contextScroll:e?0:this.oldScroll.x,contextDimension:this.innerWidth(),oldScroll:this.oldScroll.x,forward:"right",backward:"left",offsetProp:"left"},vertical:{contextOffset:e?0:i.top,contextScroll:e?0:this.oldScroll.y,contextDimension:this.innerHeight(),oldScroll:this.oldScroll.y,forward:"down",backward:"up",offsetProp:"top"}};for(var n in t){var r=t[n];for(var s in this.waypoints[n]){var a,l,h,p,u,c=this.waypoints[n][s],d=c.options.offset,f=c.triggerPoint,w=0,y=null==f;c.element!==c.element.window&&(w=c.adapter.offset()[r.offsetProp]),"function"==typeof d?d=d.apply(c):"string"==typeof d&&(d=parseFloat(d),c.options.offset.indexOf("%")>-1&&(d=Math.ceil(r.contextDimension*d/100))),a=r.contextScroll-r.contextOffset,c.triggerPoint=w+a-d,l=f<r.oldScroll,h=c.triggerPoint>=r.oldScroll,p=l&&h,u=!l&&!h,!y&&p?(c.queueTrigger(r.backward),o[c.group.id]=c.group):!y&&u?(c.queueTrigger(r.forward),o[c.group.id]=c.group):y&&r.oldScroll>=c.triggerPoint&&(c.queueTrigger(r.forward),o[c.group.id]=c.group)}}for(var g in o)o[g].flushTriggers();return this},e.findOrCreateByElement=function(t){return e.findByElement(t)||new e(t)},e.refreshAll=function(){for(var t in o)o[t].refresh()},e.findByElement=function(t){return o[t.waypointContextKey]},window.onload=function(){r&&r(),e.refreshAll()},n.requestAnimationFrame=function(e){var i=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||t;i.call(window,e)},n.Context=e}(),function(){"use strict";function t(t,e){return t.triggerPoint-e.triggerPoint}function e(t,e){return e.triggerPoint-t.triggerPoint}function i(t){this.name=t.name,this.axis=t.axis,this.id=this.name+"-"+this.axis,this.waypoints=[],this.clearTriggerQueues(),o[this.axis][this.name]=this}var o={vertical:{},horizontal:{}},n=window.Waypoint;i.prototype.add=function(t){this.waypoints.push(t)},i.prototype.clearTriggerQueues=function(){this.triggerQueues={up:[],down:[],left:[],right:[]}},i.prototype.flushTriggers=function(){for(var i in this.triggerQueues){var o=this.triggerQueues[i],n="up"===i||"left"===i;o.sort(n?e:t);for(var r=0,s=o.length;s>r;r+=1){var a=o[r];(a.options.continuous||r===o.length-1)&&a.trigger([i])}}this.clearTriggerQueues()},i.prototype.next=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints),o=i===this.waypoints.length-1;return o?null:this.waypoints[i+1]},i.prototype.previous=function(e){this.waypoints.sort(t);var i=n.Adapter.inArray(e,this.waypoints);return i?this.waypoints[i-1]:null},i.prototype.queueTrigger=function(t,e){this.triggerQueues[e].push(t)},i.prototype.remove=function(t){var e=n.Adapter.inArray(t,this.waypoints);e>-1&&this.waypoints.splice(e,1)},i.prototype.first=function(){return this.waypoints[0]},i.prototype.last=function(){return this.waypoints[this.waypoints.length-1]},i.findOrCreate=function(t){return o[t.axis][t.name]||new i(t)},n.Group=i}(),function(){"use strict";function t(t){this.$element=e(t)}var e=window.jQuery,i=window.Waypoint;e.each(["innerHeight","innerWidth","off","offset","on","outerHeight","outerWidth","scrollLeft","scrollTop"],function(e,i){t.prototype[i]=function(){var t=Array.prototype.slice.call(arguments);return this.$element[i].apply(this.$element,t)}}),e.each(["extend","inArray","isEmptyObject"],function(i,o){t[o]=e[o]}),i.adapters.push({name:"jquery",Adapter:t}),i.Adapter=t}(),function(){"use strict";function t(t){return function(){var i=[],o=arguments[0];return t.isFunction(arguments[0])&&(o=t.extend({},arguments[1]),o.handler=arguments[0]),this.each(function(){var n=t.extend({},o,{element:this});"string"==typeof n.context&&(n.context=t(this).closest(n.context)[0]),i.push(new e(n))}),i}}var e=window.Waypoint;window.jQuery&&(window.jQuery.fn.waypoint=t(window.jQuery)),window.Zepto&&(window.Zepto.fn.waypoint=t(window.Zepto))}();


(function($,sr){

  // debouncing function from John Hann
  // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
  var debounce = function (func, threshold, execAsap) {
      var timeout;

      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
                  func.apply(obj, args);
              timeout = null;
          };

          if (timeout)
              clearTimeout(timeout);
          else if (execAsap)
              func.apply(obj, args);

          timeout = setTimeout(delayed, threshold || 50);
      };
  }
  // smartresize
  jQuery.fn[sr] = function(fn){  return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr); };

})(jQuery,'smartResize');



$(document).ready(function(){

    var body = $('body'),
      socialLink = $('.social a'),
      menuOpen = $('.menu-open'),
      topNav = $('nav'),
      menu = $('.menu'),
      width = $(window).width(),
      item = $('.item'),
      preloader = $('#preloader'),
      isProject = body.hasClass('case'),
      isContact = body.hasClass('contact'),
      isAbout = body.hasClass('about'),
      isHome = body.hasClass('home'),
      video = document.getElementById('vid'),
      mobVid = document.getElementById('mob-vid'),
      touchable = 'ontouchstart' in document.documentElement,
      isFirefox = typeof InstallTrigger !== 'undefined',
      menuItem = $('.links li'),
      menuLink = $('.links li a'),
      work = $('.work'),
      clients = $('.clients'),
      height = $(window).height(),
      homeWrapper = $('.home #wrapper, body.home'),
      masterHeight = homeWrapper.height(),
      prev = $('#prev'),
      next = $('#next'),
      innerMenu = $('.menu-bg'),
      menuClose = $('.menu-close');

      if (isFirefox) {
        $('.grid li').css({'margin-left':'-.07em', 'margin-top':'-1px'});
      }

      if ((height > 1050) &&(screen.width > 1400) && (isHome)) {
        homeWrapper.height(masterHeight + 300);
      }

      if (touchable) {
        $('#mob-vid, #vid').removeAttr('preload');
        $('.grid ul li a, .coming-soon').css({'opacity': 1, 'background':'none', 'transform':'none'});
        $('.proj-over span').css({'transform':'none', 'opacity': 1, 'bottom':0});
        $('.proj-over').css({'background':'rgba(0,0,0,.8)', 'height': 'auto', 'padding':'40px 0', 'position':'absolute', 'top':'auto', 'bottom':0, 'transform':'none'});
        $('.grid li').css({'transform':'none', 'box-shadow':'none'});
      }

      // Disable Hovers For Touchable Devices

      if (!touchable) {
        $('html').addClass('no-touch');
      }

      $(window).load(function(){
        preloader.addClass('loader-off');
      });

      // Position Items On Load
      if (width > 800) {
      parallaxScroll();
      }

      if ((isProject) && (!touchable)) {

          if ($(window).scrollTop() > 500) {
            topNav.addClass('hide-nav');
            menu.addClass('turn-black');
          }

        }


      // Smooth Scrolling Function

      function smoothScroll(time, distance){

          var $window = $(window);
          var scrollTime = time;
          var scrollDistance = distance;

        $window.on("mousewheel.smooth DOMMouseScroll.smooth", function(event){

                    event.preventDefault();
                    var delta = event.originalEvent.wheelDelta/80 || -event.originalEvent.detail/3;
                  var scrollTop = $window.scrollTop();
                  var finalScroll = scrollTop - parseInt(delta*scrollDistance);

                  TweenMax.to($window, scrollTime, {
                    scrollTo : { y: finalScroll, autoKill:true },
                      ease: Power1.easeOut,
                      overwrite: 5
                    });

                });



        }

      function enableSmoothScroll (page, time, distance) {
          if (page) {
        $(window).on('mousewheel.smooth DOMMouseScroll.smooth', smoothScroll(time,distance));
      }
    }


      // ----------------------





$(window).load(function(){
  if (isAbout) {
    clients.waypoint(function(){
    menu.addClass('turn-white tw');
    innerMenu.addClass('white-bg');
    }, { offset: '6%' });

    clients.waypoint(function(){
    menu.removeClass('turn-white tw');
    innerMenu.removeClass('white-bg');
    }, { offset: '7%' });
  }

})




  $('[data-mobile-src]').each(function(){

    if (window.innerWidth >= 800) {
      var theImg = $(this).attr('data-desktop-src');
      $(this).attr('src', theImg);
    }

    else {
      var theImg = $(this).attr('data-mobile-src');
      $(this).attr('src', theImg);
    }

  })


  // Home Page Links

  $('.project a, .case nav a, .menu-open .links li a').click(function(e){
    e.preventDefault();
    preloader.removeClass('loader-off');
    var link = $(this).attr('href');
    window.setTimeout(function(){
      window.location = link;
    }, 400);
  });

  $('.social li a').click(function(){
    closeMenu();
  })


  window.setTimeout(function(){
    menuOpen.removeClass('load-hide');
  }, 500);

  // If Menu is open, close it on resize
  function closeMenu() {
  menuOpen.removeClass('open-the-menu');
  socialLink.removeClass('show-social');
  menuItem.removeClass('link-slide');
  innerMenu.removeClass('hide-bolt');
  menuClose.removeClass('show-close');
  menu.removeClass('black-menu');
  }

  // Parallax Scroll For Project Pages

  function parallaxScroll(){
    var scrolled = $(window).scrollTop();

    if (isProject) {
      $('header').css({'transform':'translate3d(0,'+-(scrolled*.7)+'px, 0)'});
    }

    if (isHome) {

      $('#logo').css({'transform':'translate(0,'+-(scrolled*1.82)+'px)'});
      $('#trendcue-move').css({'transform':'translate(0,'+-(scrolled*1.45)+'px)'});
      $('#opperman-move').css({'transform':'translate(0,'+-(scrolled*1.95)+'px)'});
      $('#athenos-move').css({'transform':'translate(0,'+-(scrolled*2.45)+'px)'});
      $('#coach-move').css({'transform':'translate(0,'+-(scrolled*1.64)+'px)'});
      $('#droga-move').css({'transform':'translate(0,'+-(scrolled*1.98)+'px)'});
      $('#wired-move').css({'transform':'translate(0,'+-(scrolled*2.3)+'px)'});
      $('#puma-move').css({'transform':'translate(0,'+-(scrolled*1.8)+'px)'});
      $('#ethr-move').css({'transform':'translate(0,'+-(scrolled*2.2)+'px)'});
      $('#thunder-move').css({'transform':'translate(0,'+-(scrolled*2.6)+'px)'});
      $('#unicef-move').css({'transform':'translate(0,'+-(scrolled*1.8)+'px)'});
      $('#info').css({'transform':'translate(0,'+-(scrolled*2.2)+'px)'});

    }

    if (isContact) {
      $('header').css({'transform':'translate(0,'+-(scrolled*.25)+'px)'});
    }

    if (isAbout) {
      $('header').css({'transform':'translate(0,'+-(scrolled*.15)+'px)'});
      $('.about-circle').css({'transform':'translate(0,'+-(scrolled*.22)+'px)'});
    }

  }


  // Allow Parallax if it's a desktop brower (not touchable) and the width is greater than or equal to 800px
  if ((width >= 785) && (!touchable)) {

    if (isHome) {
      smoothScroll(1.1, 110);

      if (isFirefox) {
        smoothScroll(.8, 220);
      }
    }

    else if (isProject) {
      smoothScroll(.7, 120);

      if (isFirefox) {
        smoothScroll(.8, 280);
      }
    }


    else {
      smoothScroll(.7, 80);

      if (isFirefox) {
        smoothScroll(.8, 220);
      }
    }

    $(window).on('scroll.parallax',function(e){
      parallaxScroll();
  });
  }




  // Check page width and adjust parallax-ability for desktops and mobile

  $(window).resize(function(){


  var width = $(this).width();
  if ((width <= 785) || (touchable)) {
    $(window).off('scroll.parallax mousewheel.smooth DOMMouseScroll.smooth');
    $('.project, .info, .laser').css({'transform':'none'});
    $('.case header, .about-circle, .devices').css({'transform':'none'});
  }

  else {

    // Re-position Items
    setTimeout(function(){
      parallaxScroll();
    }, 100);


    // Set Parallax Ability
    $(window).off('scroll.parallax').on('scroll.parallax', function(e){
      parallaxScroll();
    });


    // Clear Smoothscroll event to prevent multiple bindings
    $(window).off('mousewheel.smooth DOMMouseScroll.smooth');


    // Add Smoothscroll event
    if (isHome) {
      enableSmoothScroll(isHome, 1.1, 110);
    }

    if (isAbout) {
      enableSmoothScroll(isAbout, .7, 80);
    }

    if (isContact) {
      enableSmoothScroll(isContact, .7, 80);
    }

  }
});

  // Remove Slide Ability Of Elements For Mobile / Smaller Widths

  if ((touchable)||(screen.width <= 1024)||(width <= 800)) {
    item.removeClass('down');
    $('.exp ul').removeClass('down');
    $('.stag, .stag2').removeClass('down');

  }

  $(window).on('resize.closemenu', function(){
    closeMenu();
  })


// Menu Functionality

menu.click(function(){

  innerMenu.toggleClass('hide-bolt');
  menuClose.toggleClass('show-close');
  menu.toggleClass('black-menu');

  if (menu.hasClass('tw')) {
    menu.toggleClass('turn-white');
  }

  if (isContact) {
    $('footer .social').toggleClass('hidden');
  }
  menuOpen.toggleClass('open-the-menu');
  socialLink.each(function(i){
    var item=$(this);
    setTimeout(function(){
      item.toggleClass('show-social');
    }, 150*i)

  });

  menuItem.each(function(i){
    var item=$(this);
    setTimeout(function(){
      item.toggleClass('link-slide');
    }, 150*i)
  });


});

work.hover(function(){
  menuLink.toggleClass('dim-link');
})


// Slide In Items on Scroll

var slideUp = function(el, time, offst){
  el.each(function (i) {
  var item = $(this);
  item.waypoint(function(down){
    setTimeout(function(){
  item.removeClass('down');
    }, time*i);
  }, { offset: offst })
  });
};

slideUp(item, 1, '99%');
slideUp($('.stag'), 200, '99%');
slideUp($('.stag2'), 120, '99%');
slideUp($('.exp ul'), 1, '99%');
slideUp($('.about .stag'), 80, '99%');

// -------------------




});



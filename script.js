window.addEventListener('error',function(){document.documentElement.classList.remove('js')});
// Paint-tube colours on the hero title
(function(){
  var t=document.getElementById('title');if(!t)return;var c=['#FF3D81','#FFB400','#27D8A6','#6F8BFF','#FF6B2C','#fff'],s='Dopamine Art',h='',n=0;
  for(var i=0;i<s.length;i++){
    if(s[i]===' '){h+=' ';continue}
    h+='<span aria-hidden="true" style="color:'+c[n%c.length]+'">'+s[i]+'</span>';n++;
  }
  t.innerHTML=h;
})();
// Hide broken images so the colour wash and label show until real images are added
document.querySelectorAll('.art img').forEach(function(img){
  function bad(){img.style.display='none'}
  if(img.loading!=='lazy'&&img.complete&&img.naturalWidth===0)bad();
  img.addEventListener('error',bad);
  img.addEventListener('load',function(){img.style.display=''});
});
// Lightbox
var lb=document.getElementById('lb'),lbi=lb.querySelector('img'),lbc=document.createElement('div');lbc.className='lbc';lb.appendChild(lbc);
document.querySelectorAll('.art').forEach(function(f){
  f.addEventListener('click',function(){
    var i=f.querySelector('img');
    if(!i||i.style.display==='none')return;
    var cap=f.querySelector('figcaption')||(f.parentNode.classList.contains('piece')&&f.parentNode.querySelector('figcaption'));
    lbc.innerHTML=cap?cap.innerHTML:'';
    lbi.src=i.currentSrc||i.src;lbi.alt=i.alt;lb.showModal();
  });
});
document.getElementById('lbx').addEventListener('click',function(){lb.close()});
lb.addEventListener('click',function(e){if(e.target===lb)lb.close()});
document.getElementById('yr').textContent=new Date().getFullYear();

/* ==========================================================
   MOTION LAYER
   ========================================================== */
(function(){
  var root=document.documentElement,
      reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches,
      fine=window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  root.classList.add('js');

  // Hero: stagger letters and mosaic tiles in after the page veil lifts
  var t=document.getElementById('title');
  if(t){
    t.querySelectorAll('span').forEach(function(s,i){s.classList.add('lt');s.style.animationDelay=(0.6+i*0.06)+'s'});
    document.querySelectorAll('.mosaic .art').forEach(function(f,i){f.style.animationDelay=(0.7+i*0.09)+'s'});
  }

  // Scroll reveals
  var sel='.pagehead h1,.pagehead p,h2,.intro,.masonry .art,.about .art,.about .grid>div,.svc li,.steps li,.tl li,.cols h3,.contact p,.contact .links a,.more';
  var els=document.querySelectorAll(sel),counts=new Map();
  els.forEach(function(el){
    if(el.closest('.hero'))return;
    var p=el.parentNode,n=counts.get(p)||0;counts.set(p,n+1);
    var inView=el.getBoundingClientRect().top<window.innerHeight*0.95;
    el.style.setProperty('--d',((inView?0.75:0)+Math.min(n%6,5)*0.08)+'s');
    el.classList.add('rv');
  });
  function show(el){el.classList.add('in');setTimeout(function(){el.style.setProperty('--d','0s')},1800)}
  var rvs=document.querySelectorAll('.rv');
  if(reduce||!('IntersectionObserver' in window)){rvs.forEach(show)}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){show(e.target);io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
    rvs.forEach(function(el){io.observe(el)});
  }
  // Safety net: never leave anything on screen hidden
  setTimeout(function(){rvs.forEach(function(el){if(!el.classList.contains('in')&&el.getBoundingClientRect().top<window.innerHeight)show(el)})},3000);
  if(reduce)return;

  // Scroll progress ribbon
  var bar=document.createElement('div');bar.className='progress';document.body.appendChild(bar);
  function prog(){var h=document.documentElement.scrollHeight-window.innerHeight;bar.style.transform='scaleX('+(h>0?window.scrollY/h:0)+')'}
  window.addEventListener('scroll',prog,{passive:true});prog();

  // Page exit: paint bars sweep down, then navigate
  var cur=document.createElement('div');cur.className='curtain';cur.setAttribute('aria-hidden','true');
  for(var k=0;k<4;k++){var b=document.createElement('i');b.style.setProperty('--k',k);cur.appendChild(b)}
  document.body.appendChild(cur);
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a[href]');
    if(!a||e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||a.target==='_blank')return;
    var u=new URL(a.href,location.href);
    if(u.origin!==location.origin||u.protocol.indexOf('http')!==0&&u.protocol!=='file:')return;
    if(u.pathname===location.pathname&&u.search===location.search)return; // same page or #anchor
    e.preventDefault();cur.classList.add('go');
    setTimeout(function(){location.href=a.href},650);
  });
  window.addEventListener('pageshow',function(e){if(e.persisted)cur.classList.remove('go')});

  // Click splatter
  var colors=['#FF3D81','#FFB400','#27D8A6','#2F5BFF','#FF6B2C'];
  document.addEventListener('pointerdown',function(e){
    for(var i=0;i<11;i++){
      var d=document.createElement('div'),a=Math.random()*Math.PI*2,r=30+Math.random()*60;
      d.className='splat';
      d.style.cssText='left:'+e.clientX+'px;top:'+e.clientY+'px;--s:'+(6+Math.random()*12)+'px;--c:'+colors[i%colors.length]+';--dx:'+Math.cos(a)*r+'px;--dy:'+Math.sin(a)*r+'px';
      document.body.appendChild(d);setTimeout(function(x){x.remove()},900,d);
    }
  });

  if(!fine)return;

  // Cursor ring that grows over paintings and links
  var ring=document.createElement('div');ring.className='ring';document.body.appendChild(ring);
  var mx=0,my=0,rx=0,ry=0;
  document.addEventListener('pointermove',function(e){mx=e.clientX;my=e.clientY;ring.classList.add('on');
    ring.classList.toggle('big',!!(e.target.closest&&e.target.closest('.art,a,button')))});
  document.addEventListener('mouseleave',function(){ring.classList.remove('on')});
  (function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.transform='translate('+rx+'px,'+ry+'px)';requestAnimationFrame(loop)})();

  // 3D tilt on paintings
  document.querySelectorAll('.mosaic .art,.masonry .art').forEach(function(f){
    f.addEventListener('pointermove',function(e){
      var r=f.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
      f.classList.add('tilting');
      f.style.transform='perspective(800px) rotateY('+(x*9)+'deg) rotateX('+(-y*9)+'deg) scale(1.025)';
    });
    f.addEventListener('pointerleave',function(){f.classList.remove('tilting');f.style.transform=''});
  });
})();

/* Mobile menu: hamburger button, injected so the HTML pages need no changes */
(function(){
  var h=document.querySelector('header'),nav=h&&h.querySelector('nav'),ul=nav&&nav.querySelector('ul');
  if(!ul)return;
  var b=document.createElement('button');
  b.type='button';b.className='menu-btn';b.setAttribute('aria-label','Menu');
  b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','nav-links');
  b.innerHTML='<span></span><span></span><span></span>';
  ul.id='nav-links';nav.appendChild(b);
  var wa=nav.querySelector(':scope > .btn');
  if(wa){var li=document.createElement('li');li.className='mob-cta';li.appendChild(wa.cloneNode(true));ul.appendChild(li)}
  ul.querySelectorAll('li').forEach(function(l,i){l.style.setProperty('--i',i)});
  function set(o){h.classList.toggle('open',o);b.setAttribute('aria-expanded',o?'true':'false');document.body.style.overflow=o?'hidden':''}
  b.addEventListener('click',function(){set(!h.classList.contains('open'))});
  ul.addEventListener('click',function(e){if(e.target.closest('a'))set(false)});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')set(false)});
  document.addEventListener('click',function(e){if(h.classList.contains('open')&&!h.contains(e.target))set(false)});
  window.matchMedia('(min-width:821px)').addEventListener('change',function(){set(false)});
})();

setTimeout(function(){document.body.classList.add('veil-done')},2200);

/* Image folder fallback: if "Images/" or "images/" fails to load, retry with the other spelling.
   Fixes sites that work locally (Windows/Mac ignore capitals) but break on Vercel (Linux does not). */
(function(){
  function swap(s){return s.replace(/(^|\/)(images)\//i,function(m,p,n){return p+(n==='images'?'Images':'images')+'/'})}
  function retry(img){
    if(img.dataset.retried)return;
    var s=img.getAttribute('src')||'',t=swap(s);
    if(t===s)return;
    img.dataset.retried='1';img.style.display='';img.src=t;
  }
  document.querySelectorAll('img').forEach(function(img){
    img.addEventListener('error',function(){retry(img)});
    if(img.loading!=='lazy'&&img.complete&&img.naturalWidth===0)retry(img);
  });
})();

/* Debug helper: open any page with ?debug on the end (e.g. index.html?debug) on your phone.
   A red box at the top lists every image that failed to load, so you can see exactly which files are wrong. */
(function(){
  if(location.search.indexOf('debug')<0)return;
  var box=document.createElement('div');
  box.style.cssText='position:fixed;z-index:9999;left:0;right:0;top:0;max-height:45vh;overflow:auto;background:#b00020;color:#fff;font:12px/1.4 monospace;padding:8px;display:none';
  document.body.appendChild(box);
  function report(img){box.style.display='block';box.innerHTML+='FAILED: '+(img.currentSrc||img.src)+'<br>'}
  function check(){document.querySelectorAll('img').forEach(function(img){
    if(img.dataset.dbg)return;img.dataset.dbg=1;
    img.addEventListener('error',function(){report(img)});
    if(img.loading!=='lazy'&&img.complete&&img.naturalWidth===0)report(img);
  })}
  check();
  window.addEventListener('load',function(){
    setTimeout(function(){
      if(box.style.display==='none'){box.style.display='block';box.style.background='#0a7a3d';box.textContent='No failed images detected ('+document.images.length+' checked)'}
    },2500);
  });
})();
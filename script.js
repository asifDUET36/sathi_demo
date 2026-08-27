/* Shathi Food Park & Resort — shared site script */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Sticky header ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if(!header) return;
    if(window.scrollY > 40) header.classList.add('solid');
    else header.classList.remove('solid');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  if(toggle && navLinks){
    toggle.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      toggle.classList.toggle('active');
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
  }

  /* ---------- Active nav link ---------- */
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(a => {
    if(a.getAttribute('href') === path) a.classList.add('active');
  });

  /* ---------- Reveal on scroll ---------- */
  const revealItems = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && revealItems.length){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } });
    }, {threshold:.15});
    revealItems.forEach(el => io.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Route line draw-in (Explore page signature) ---------- */
  const routeLines = document.querySelectorAll('.route-line');
  if('IntersectionObserver' in window && routeLines.length){
    const ioRoute = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('in-view'); } });
    }, {threshold:.3});
    routeLines.forEach(el => ioRoute.observe(el));
  }

  /* ---------- Ambient rising particles ---------- */
  document.querySelectorAll('.ambient').forEach(layer => {
    const emoji = (layer.dataset.particles || '•').split(',');
    const count = parseInt(layer.dataset.count || '14', 10);
    for(let i=0;i<count;i++){
      const s = document.createElement('span');
      const pick = emoji[Math.floor(Math.random()*emoji.length)];
      s.textContent = pick;
      const left = Math.random()*100;
      const size = 14 + Math.random()*22;
      const dur = 9 + Math.random()*10;
      const delay = Math.random()*12;
      const drift = (Math.random()*80 - 40) + 'px';
      s.style.left = left + '%';
      s.style.fontSize = size + 'px';
      s.style.background = 'transparent';
      s.style.setProperty('--drift', drift);
      s.style.animationDuration = dur + 's';
      s.style.animationDelay = delay + 's';
      layer.appendChild(s);
    }
  });

  /* ---------- Steam wisps (Home hero) ---------- */
  const steamHost = document.querySelector('.hero-visual');
  if(steamHost){
    for(let i=0;i<5;i++){
      const s = document.createElement('span');
      s.className = 'steam';
      s.style.left = (44 + i*4) + '%';
      s.style.bottom = '48%';
      s.style.height = (40 + Math.random()*30) + 'px';
      s.style.animationDelay = (i*0.9) + 's';
      steamHost.appendChild(s);
    }
  }

  /* ---------- Category chip filter (Menu page) ---------- */
  const chips = document.querySelectorAll('[data-filter-chip]');
  const dishCards = document.querySelectorAll('[data-category]');
  if(chips.length && dishCards.length){
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        chips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        const cat = chip.dataset.filterChip;
        dishCards.forEach(card => {
          const match = cat === 'all' || card.dataset.category === cat;
          card.style.display = match ? '' : 'none';
        });
      });
    });
  }

  /* ---------- Menu search ---------- */
  const search = document.querySelector('#menu-search');
  if(search){
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      dishCards.forEach(card => {
        const name = (card.dataset.name || card.textContent).toLowerCase();
        card.style.display = name.includes(q) ? '' : 'none';
      });
      chips.forEach(c => c.classList.remove('active'));
    });
  }

  /* ---------- Room detail toggle (Resort page) ---------- */
  document.querySelectorAll('[data-room-toggle]').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.room-card');
      const detail = card && card.querySelector('.room-detail');
      if(!detail) return;
      const isOpen = detail.classList.toggle('show');
      btn.classList.toggle('open', isOpen);
      btn.innerHTML = isOpen ? 'Hide Details <span>→</span>' : 'View Room Details <span>→</span>';
    });
  });

  /* ---------- Order via WhatsApp buttons ---------- */
  document.querySelectorAll('[data-order-item]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.dataset.orderItem;
      const price = btn.dataset.orderPrice || '';
      const msg = encodeURIComponent(`Hi Shathi Food Park & Resort, I'd like to order: ${item} (${price}). Please confirm availability.`);
      window.open(`https://wa.me/8801000000000?text=${msg}`, '_blank');
    });
  });

  /* ---------- Trip Planner (Explore page) ---------- */
  const planner = document.querySelector('.planner');
  if(planner){
    const state = {duration:null, company:null, interest:null};
    planner.querySelectorAll('[data-planner-group]').forEach(group => {
      const key = group.dataset.plannerGroup;
      group.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
          group.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          state[key] = btn.dataset.value;
          maybeShowResult();
        });
      });
    });

    const resultBox = planner.querySelector('.planner-result');
    function maybeShowResult(){
      if(!state.duration || !state.company || !state.interest) return;
      const plans = {
        '1': 'Breakfast at Shathi → Hardinge Bridge → Lalon Shah Bridge → Lunch at Shathi → local sightseeing → Dinner at Shathi.',
        '2': 'Day 1: Check-in, Food Park, Kids Zone, Dinner. Day 2: Breakfast, Hardinge Bridge, Lalon Shah Bridge, Padma River, Lunch, return & checkout.',
        '3': 'Day 1: Arrival & Food Park. Day 2: Two Bridges & Padma River tour with photography stops. Day 3: Leisure morning, local culture visit, farewell lunch.'
      };
      const companyNote = {
        family: 'family-friendly pacing with Kids Zone and shorter travel legs',
        couple: 'relaxed sunset stops at the river and bridges',
        friends: 'photography-heavy route with flexible timing',
        solo: 'a light, easy-to-follow single-day loop'
      };
      const interestNote = {
        nature:'extra time by the Padma River',
        history:'guided context on Hardinge & Lalon Shah Bridge history',
        photography:'sunset and golden-hour stops prioritised',
        culture:'a stop for local culture & cuisine',
        family:'Food Park and Kids Zone built into the route',
        sunset:'the day timed to end at the river for sunset'
      };
      resultBox.innerHTML = `<strong>Your ${state.duration}-day plan:</strong><br>${plans[state.duration]}<br><br>
        Built for ${companyNote[state.company]}, with ${interestNote[state.interest]}.`;
      resultBox.classList.add('show');
    }
  }

});

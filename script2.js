/* ================= PARTICLE BACKGROUND ================= */
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", () => {
  resizeCanvas();
  init();
});
resizeCanvas();

let particles = [];
const mouse = { x: null, y: null };

canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = (e.clientX - rect.left) * (canvas.width / rect.width);
  mouse.y = (e.clientY - rect.top) * (canvas.height / rect.height);
});
canvas.addEventListener("mouseleave", () => {
  mouse.x = null;
  mouse.y = null;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.03;
    this.vy = (Math.random() - 0.5) * 0.03;
    this.radius = 1.5;
    this.baseRadius = 1.5;
    this.offset = Math.random() * 1000;
  }
  draw(force = 0) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#ffffff";
    ctx.shadowBlur = force > 0.2 ? 8 : 0;
    ctx.fill();
    ctx.shadowBlur = 0;
  }
  update() {
    this.x += Math.sin(Date.now() * 0.0003 + this.offset) * 0.03 + this.vx;
    this.y += Math.cos(Date.now() * 0.0003 + this.offset) * 0.03 + this.vy;
    this.vx *= 0.99;
    this.vy *= 0.99;

    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

    let force = 0;
    if (mouse.x !== null && mouse.y !== null) {
      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 120) {
        force = (120 - dist) / 120;
        this.vx += dx * 0.00009 * force;
        this.vy += dy * 0.00009 * force;
        this.radius = this.baseRadius + force * 0.5;
      } else this.radius = this.baseRadius;
    }
    this.draw(force);
  }
}
function connectParticles() {
  for (let a = 0; a < particles.length; a++) {
    for (let b = a + 1; b < particles.length; b++) {
      let dx = particles[a].x - particles[b].x;
      let dy = particles[a].y - particles[b].y;
      let dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 160) {
        let opacity = 1 - dist / 160;
        ctx.beginPath();
        ctx.moveTo(particles[a].x, particles[a].y);
        ctx.lineTo(particles[b].x, particles[b].y);
        ctx.strokeStyle = `rgba(255,255,255,${opacity * 0.1})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
      }
    }
  }
}
function init() {
  particles = [];
  const area = canvas.width * canvas.height;
  const density = 0.0002;
  const count = Math.floor(area * density);
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => p.update());
  connectParticles();
  requestAnimationFrame(animate);
}
init();
animate();

/* ================= ANIMATIONS ================= */
window.addEventListener("DOMContentLoaded", () => {
  // Sequential fade for hero content
  document.querySelectorAll(".reveal").forEach((el, i) => {
    setTimeout(() => el.classList.add("show"), i * 600);
  });

  // Slide in header/nav
  document.querySelectorAll(".slideIn").forEach((el, i) => {
    setTimeout(() => el.classList.add("slide"), i * 600);
  });
});

/* ================= INTERSECTION OBSERVER ================= */
const slideObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("slider"), i * 200);
      } else {
        entry.target.classList.remove("slider");
      }
    });
  },
  { threshold: 0.2 }
);
document
  .querySelectorAll(".slideright")
  .forEach((el) => slideObserver.observe(el));

const fadeObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("fadeUp"), i * 200);
      } else {
        entry.target.classList.remove("fadeUp");
      }
    });
  },
  { threshold: 0.1 }
);
document.querySelectorAll(".fade").forEach((el) => fadeObserver.observe(el));

// ProjectObserver
const ProjectObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add("slideDown"), i * 200);
      } else {
        entry.target.classList.remove("slideDown");
      }
    });
  },
  { threshold: 0.1 }
);
ProjectObserver.observe(document.querySelector("#Projects"));

/* ================= ACADEMY OBSERVER ================= */
const academyObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const children = entry.target.querySelectorAll("h2, p, h1, button");
        children.forEach((child, i) => {
          setTimeout(() => child.classList.add("show"), i * 300);
        });
      } else {
        child.classList.remove("show");
      }
    });
  },
  { threshold: 0.2 }
);
academyObserver.observe(document.querySelector("#Academy"));

// Header observer
window.addEventListener("scroll", () => {
  const header = document.querySelector(".header");
  if (window.scrollY > 500) {
    header.classList.add("scrolled");
    document.querySelector(".accent").style.backgroundColor = "#250e41";
  } else {
    header.classList.remove("scrolled");
  }
});

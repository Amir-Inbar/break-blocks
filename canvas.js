const particles = [];

function setup() {
  createCanvas(500, 500);

  const particlesLen = Math.floor(window.innerWidth / 50);

  for (let i = 0; i < particlesLen; i++) {
    particles.push(new particle());
  }
}

function draw() {
  background(55, 100, 144);
  particles.forEach((p) => {
    p.update();
    p.draw();
    p.checkParticles(particles);
    p.isTouched(particles);
  });
}

function particle() {
  this.pos = createVector(random(width), random(height));
  this.size = 10;
  this.vel = createVector(random(-2, 2), random(-2, 2));
  this.color = `rgba(225,225,225,0.8)`;
  this.distance = 0;

  (this.update = function () {
    this.pos.add(this.vel);
    this.edges();
  }),
    (this.draw = function () {
      noStroke();
      fill(this.color);
      circle(this.pos.x, this.pos.y, this.size);
    }),
    (this.edges = function () {
      if (this.pos.x < 0 || this.pos.x > width) {
        this.vel.x *= -1;
      }
      if (this.pos.y < 0 || this.pos.y > height) {
        this.vel.y *= -1;
      }
    }),
    (this.isTouched = function (particles) {
      particles.forEach((otherParticle) => {
        const distance = dist(
          this.pos.x,
          this.pos.y,
          otherParticle.pos.x,
          otherParticle.pos.y
        );
        if (distance < this.size) {
          this.vel.x *= -1;
          this.vel.y *= -1;
          otherParticle.vel.x *= -1;
          otherParticle.vel.y *= -1;
        }
      });
    }),
    (this.checkParticles = function (particles) {
      particles.forEach((p, idx) => {
        const distance = dist(this.pos.x, this.pos.y, p.pos.x, p.pos.y);
        this.distance = distance;
        if (this.distance < 100) {
          stroke('rgba(225,225,225,0.1');
          line(this.pos.x, this.pos.y, p.pos.x, p.pos.y);
        }
      });
    });
}

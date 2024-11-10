let lines;
let letters = [];
let floatingLetters = [];
let radius = 200;
let angleSpeed = 0.02;
let rotationAngle = 0;
let transitionProgress = 0;
let formingRing = false;
let textSizeValue = 24;

function preload() {
  lines = loadStrings("ringverse.txt");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont("Georgia");
  textSize(textSizeValue);
  textAlign(CENTER, CENTER);
  noFill();

  let fullText = lines.join(" ");
  letters = fullText.split("");

  for (let i = 0; i < letters.length; i++) {
    floatingLetters.push({
      letter: letters[i],
      x: random(width),
      y: random(height),
      speedX: random(-2, 2),
      speedY: random(-2, 2),
      targetX: 0,
      targetY: 0,
      isOnRing: false
    });
  }
}

function draw() {
  background(0);

  if (formingRing) {
    transitionProgress += 0.05;
    if (transitionProgress >= 1) {
      transitionProgress = 1;
    }

    push();
    translate(width / 2, height / 2);
    rotate(rotationAngle);

    for (let i = 0; i < floatingLetters.length; i++) {
      let angle = map(i, 0, floatingLetters.length, 0, TWO_PI);
      let targetX = radius * cos(angle);
      let targetY = radius * sin(angle);

      let letter = floatingLetters[i];
      letter.targetX = targetX;
      letter.targetY = targetY;

      letter.x = lerp(letter.x, letter.targetX, transitionProgress);
      letter.y = lerp(letter.y, letter.targetY, transitionProgress);

      let glow = 200 + 55 * sin(frameCount * 0.1);
      let c = color(255, 140 + 40 * sin(frameCount * 0.1), 0, glow);
      fill(c);

      push();
      translate(letter.x, letter.y);
      rotate(angle + HALF_PI);
      text(letter.letter, 0, 0);
      pop();
    }

    pop();
    rotationAngle += angleSpeed;

    if (transitionProgress >= 1) {
      for (let i = 0; i < floatingLetters.length; i++) {
        floatingLetters[i].isOnRing = true;
      }
    }
  } else {
    for (let i = 0; i < floatingLetters.length; i++) {
      let letter = floatingLetters[i];

      if (!letter.isOnRing) {
        letter.x += letter.speedX;
        letter.y += letter.speedY;

        if (letter.x < 0 || letter.x > width) {
          letter.speedX *= -1;
        }
        if (letter.y < 0 || letter.y > height) {
          letter.speedY *= -1;
        }

        let glow = 200 + 55 * sin(frameCount * 0.1);
        let c = color(255, 140 + 40 * sin(frameCount * 0.1), 0, glow);
        fill(c);

        text(letter.letter, letter.x, letter.y);
      }
    }
  }
}

function mousePressed() {
  if (!formingRing) {
    formingRing = true;
    transitionProgress = 0;
  } else {
    formingRing = false;
    for (let i = 0; i < floatingLetters.length; i++) {
      floatingLetters[i].x = random(width);
      floatingLetters[i].y = random(height);
      floatingLetters[i].speedX = random(-2, 2);
      floatingLetters[i].speedY = random(-2, 2);
      floatingLetters[i].isOnRing = false;
    }
  }
}

import p5 from "p5";

export const sketch1 = (p: p5) => {
  let angle = 0;
  let radius = 100;

  p.setup = () => {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.colorMode(p.HSB, 360, 100, 100);
  };

  p.draw = () => {
    p.background(220, 20, 10);

    p.translate(p.width / 2, p.height / 2);

    const numShapes = 12;
    for (let i = 0; i < numShapes; i++) {
      p.push();

      const shapeAngle = (p.TWO_PI / numShapes) * i;
      const x = p.cos(shapeAngle + angle) * radius;
      const y = p.sin(shapeAngle + angle) * radius;

      p.translate(x, y);
      p.rotate(angle * 2 + shapeAngle);

      const hue = (angle * 50 + i * 30) % 360;
      p.fill(hue, 80, 90, 0.8);
      p.noStroke();

      const size = 30 + p.sin(angle * 3 + i) * 10;
      p.ellipse(0, 0, size, size);

      p.pop();
    }

    angle += 0.02;
  };

  p.windowResized = () => {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
  };
};


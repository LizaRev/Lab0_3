export class Vector2 {
  constructor(x = 0, y = 0) {
    this.x = x;
    this.y = y;
  }

  add(other) { //додатв новий вектор з двух існуючих і це потріно для зхміни положення
    return new Vector2(
      this.x + other.x,
      this.y + other.y
    );
  }

  sub(other) { //наприклад для вістані
    return new Vector2(
      this.x - other.x,
      this.y - other.y
    );
  }

  scale(value) { //потріно для швидкості 
    return new Vector2(
      this.x * value,
      this.y * value
    );
  }

  length() {
    return Math.hypot(this.x, this.y);
  }

  normalize() { //для отримання напримку
    const length = this.length(); //знахидмо довжину потончого вектора

    if (length === 0) {
      return new Vector2(0, 0);
    }

    return new Vector2(
      this.x / length,
      this.y / length
    );
  }

  rotate(angle) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    return new Vector2(
      this.x * cos - this.y * sin,
      this.x * sin + this.y * cos
    );
  }

  dot(other) { //скалярний добуток множить відпідні компоненти,чи дивится ворог на гравця,який кут,визнаечння напрямку
    return this.x * other.x + this.y * other.y;
  }

  static fromAngle(angle) { //потрібен щоб за кутом отримати напрямок руху
    return new Vector2(
      Math.cos(angle),
      Math.sin(angle)
    );
  }
}


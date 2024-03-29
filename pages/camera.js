class Camera {
  constructor(position, target, up) {
    this.position = position;

    this.up = up;
    this.speed = 0.2;
    // TODO: target or azimuth/elevation, which is better?
    // Target-based camera is great when you want the camera to revolve around an object or have a fixed point of interest.
    // Azimuth/elevation-based camera offers more freedom and is suitable for applications like flight simulators 
    // or when you want to control the camera independently from a target.
    this.target = target;
    this.azimuth = -Math.PI / 2;
    this.elevation = 0;

    this.lastX = 0;
    this.lastY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.isDragging = false;

    this.fieldOfView = 45;   // in degrees
    this.zNear = 0.1;
    this.zFar = 100.0;

    this.update()
  }


  lookAt() {
    var view = mat4.create();
    var target = vec3.create();
    vec3.add(target, this.position, this.front);
    mat4.lookAt(view, this.position, target, this.up);
    return view;
  }

  perspective(aspect) {
    var projection = mat4.create();
    mat4.perspective(projection, this.fieldOfView * Math.PI / 180, aspect, this.zNear, this.zFar);
    return projection;
  }

  update() {
    this.front = vec3.create();
    this.front[0] = Math.cos(this.azimuth) * Math.cos(this.elevation);
    this.front[1] = Math.sin(this.elevation);
    this.front[2] = Math.sin(this.azimuth) * Math.cos(this.elevation);

    vec3.normalize(this.front, this.front);
    this.left = vec3.create();
    vec3.cross(this.left, this.up, this.front);
    vec3.normalize(this.left, this.left);
  }

  moveForward() {
    vec3.scaleAndAdd(this.position, this.position, this.front, this.speed);
  }

  moveBackward() {
    vec3.scaleAndAdd(this.position, this.position, this.front, -this.speed);
  }

  moveLeft() {
    vec3.scaleAndAdd(this.position, this.position, this.left, this.speed);
  }

  moveRight() {
    vec3.scaleAndAdd(this.position, this.position, this.left, -this.speed);
  }

  moveUp() {
    vec3.scaleAndAdd(this.position, this.position, this.up, this.speed);
  }

  moveDown() {
    vec3.scaleAndAdd(this.position, this.position, this.up, -this.speed);
  }

  handleKeyDown(event) {
    switch (event.key) {
      case 'w':
        this.moveForward();
        break;
      case 's':
        this.moveBackward();
        break;
      case 'a':
        this.moveLeft();
        break;
      case 'd':
        this.moveRight();
        break;
      case 'e':
        this.moveUp();
        break;
      case 'q':
        this.moveDown();
        break;
    }
    this.update();
  }

  handleMouseDown(event) {
    this.lastX = event.clientX;
    this.lastY = event.clientY;
    this.isDragging = true;
  }

  handleMouseMove(event) {
    if (!this.isDragging) return;
    this.currentX = event.clientX;
    this.currentY = event.clientY;
    this.azimuth += (this.currentX - this.lastX) * 0.001;
    this.elevation += -(this.currentY - this.lastY) * 0.001;
    // Clamp the elevation to be between -PI/2 and PI/2
    let eps = 1e-4;
    this.elevation = Math.max(-Math.PI / 2 + eps, Math.min(Math.PI / 2 - eps, this.elevation));
    this.update()
    this.lastX = this.currentX;
    this.lastY = this.currentY;
  }

  handleMouseUp() {
    this.isDragging = false;
  }

  handleMouseWheel(event) {
    this.fieldOfView += event.deltaY * 0.02;
    this.fieldOfView = Math.max(0.1, Math.min(150.0, this.fieldOfView));
  }

}
class Shader {
  constructor(gl, vertexSource, fragmentSource) {
    this.gl = gl;
    this.program = this.initShaderProgram(vertexSource, fragmentSource);
  }

  initShaderProgram(vertexSource, fragmentSource) {
    const vertexShader = this.loadShader(this.gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = this.loadShader(this.gl.FRAGMENT_SHADER, fragmentSource);

    const shaderProgram = this.gl.createProgram();
    this.gl.attachShader(shaderProgram, vertexShader);
    this.gl.attachShader(shaderProgram, fragmentShader);
    this.gl.linkProgram(shaderProgram);

    if (!this.gl.getProgramParameter(shaderProgram, this.gl.LINK_STATUS)) {
      alert('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(shaderProgram));
      return null;
    }

    return shaderProgram;
  }

  loadShader(type, source) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);

    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      alert('An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }

    return shader;
  }

  use() {
    this.gl.useProgram(this.program);
  }

  getAttribLocation(attribute) {
    return this.gl.getAttribLocation(this.program, attribute);
  }

  getUniformLocation(uniform) {
    return this.gl.getUniformLocation(this.program, uniform);
  }
}

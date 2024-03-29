class SwapTexture {
  createFloatTexture(gl, width, height) {
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    // gl.LINEAR_MIPMAP_NEAREST and gl.generateMipmap() is not supported for floating point textures
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    // gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);
    // Initialize the texture with zeros
    var data = new Float32Array(width * height * 4);
    // for (var i = 0; i < data.length; i += 4) {
    //   var cellSize = 64;
    //   var row = Math.floor(i / (width * 4*cellSize));
    //   var col = Math.floor((i % (width * 4)) / (4*cellSize));
    //   if ((row+col)%2 == 0) {
    //     data[i + 0] = 0.0; // R
    //     data[i + 1] = 0.0; // G
    //     data[i + 2] = 0.0; // B
    //     data[i + 3] = 1.0; // A
    //   }else{
    //     data[i + 0] = 1.0; // R
    //     data[i + 1] = 1.0; // G
    //     data[i + 2] = 1.0; // B
    //     data[i + 3] = 1.0; // A
    //   }
    // } 
    for (var i = 0; i < data.length; i += 4) {
      var row = Math.floor(i / (width * 4));
      var col = Math.floor((i % (width * 4)) / (4));
      if (row < width/3 && row > height/4 && col < width/3 && col > height/4) {
        data[i + 0] = 0.0; // R
        data[i + 1] = 0.0; // G
        data[i + 2] = 0.0; // B
        data[i + 3] = 1.0; // A
      }else{
        data[i + 0] = 1.0; // R
        data[i + 1] = 1.0; // G
        data[i + 2] = 1.0; // B
        data[i + 3] = 1.0; // A
      }
    }     
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, data);
    // gl.texSubImage2D(gl.TEXTURE_2D, 0, 0, 0, width, height, gl.RGBA, gl.FLOAT, data);
    // gl.bindTexture(gl.TEXTURE_2D, null);

    return texture;
  }
  constructor(gl, width, height) {
    this.gl = gl;
    this.width = width;
    this.height = height;
    this.cur_texture = this.createFloatTexture(gl, width, height);
    this.next_texture = this.createFloatTexture(gl, width, height);
  }
  swap() {
    let temp = this.cur_texture;
    this.cur_texture = this.next_texture;
    this.next_texture = temp;
  }
  // bind() {
  //   var gl = this.gl;
  //   gl.bindTexture(gl.TEXTURE_2D, this.cur_texture);
  // }
}

// Vertex shader program
const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uModelViewMatrix;
    uniform mat4 uProjectionMatrix;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
      vColor = aVertexColor;
    }
`;

// Fragment shader program
const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
`;

const quadVsSource = `
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;
    varying vec2 vTextureCoord;
    void main(void) {
      gl_Position = vec4(aVertexPosition, 0.0, 1.0);
      vTextureCoord = aTextureCoord;
    }
`;

const quadFsSource = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void) {
      // gl_FragColor = vec4(1.0, 0.0, 1.0, 1.0);
      gl_FragColor = vec4(vTextureCoord, 1.0, 1.0);
      // gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;

const copyTextureFsSource = `
    precision highp float;
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void) {
      // vec2 uv = vTextureCoord;
      // vec2 center = vec2(0.5, 0.5);
      // vec2 v = vec2(uv.y-center.y, center.x-uv.x);
      // gl_FragColor = vec4(v, 1.0, 1.0);
      gl_FragColor = texture2D(uSampler, vTextureCoord);
    }
`;

const decayFsSource = `
    varying highp vec2 vTextureCoord;
    uniform sampler2D uSampler;
    void main(void) {
      gl_FragColor = texture2D(uSampler, vTextureCoord) * 0.99;
    }
`;

const touchFsSource = `
    precision highp float;
    varying vec2 vTextureCoord;
    uniform vec2 touch;
    uniform vec2 vel;
    uniform float dt;
    void main(void) {
      vec2 uv = vTextureCoord;
      vec4 q = vec4(0.0, 0.0, 0.0, 1.0);
      if (distance(uv, touch) < 0.03) {
        q += vec4(vel*10.0, 0.0, 0.0);
      }
      gl_FragColor = q;
    }
`;

const advectionFsSource = `
    precision highp float;
    varying vec2 vTextureCoord;
    uniform sampler2D quantity;
    uniform sampler2D vel;
    uniform float dt;
    void main(void) {
      vec2 uv = vTextureCoord;
      vec2 center = vec2(0.5, 0.5);
      // vec2 v = texture2D(vel, uv).xy;
      // vec2 v = vec2(uv.y-center.y, center.x-uv.x);
      vec2 v = vec2(0.1, 0.0);
      vec4 new_quantity = texture2D(quantity, uv - v*0.01);
      gl_FragColor = new_quantity;
    }
`;


class DynamicData {
  constructor() {
    this.isDragging = false;
    this.touch_uv = {
      x: -1,
      y: -1,
    };
    this.last_touch_uv = this.touch_uv;
  }

  handleKeyDown(event) {

  }
  
  handleMouseDown(event) {
    this.isDragging = true;
    this.touch_uv = windowPosToUV(canvas, event.clientX, event.clientY);
    this.last_touch_uv = this.touch_uv;
  }

  handleMouseMove(event) {
    if (this.isDragging) {
      this.last_touch_uv = this.touch_uv;
      this.touch_uv = windowPosToUV(canvas, event.clientX, event.clientY);
    }
  }
  
  handleMouseUp() {
    this.isDragging = false;
    this.touch_uv = {
      x: -1,
      y: -1,
    };
    this.last_touch_uv = this.touch_uv;
  }
}

// Initialize WebGL, compile shaders, create buffers, and draw the scene
function main() {
  const canvas = document.getElementById('webgl-canvas');
  resizeCanvasToDisplaySize(canvas);
  window.addEventListener('resize', () => {
    resizeCanvasToDisplaySize(canvas);
    // gl.viewport(0, 0, canvas.width, canvas.height);
    // console.log('Resized canvas to: ' + canvas.width + 'x' + canvas.height);
    // Optional: Redraw the scene here if needed
  });
  const gl = canvas.getContext('webgl');

  if (!gl) {
    alert('Unable to initialize WebGL. Your browser may not support it.');
  }


  camera = new Camera([0, 0, 10], [0, 0, 0], [0, 1, 0]);

  dynamicData = new DynamicData();

  document.addEventListener('keydown', (event) => {
    camera.handleKeyDown(event);
  });

  // The mouse down event listener
  document.addEventListener('mousedown', function (event) {
    camera.handleMouseDown(event);
    dynamicData.handleMouseDown(event);
  });

  // The mouse move event listener
  document.addEventListener('mousemove', function (event) {
    camera.handleMouseMove(event);
    dynamicData.handleMouseMove(event);
  });

  // The mouse up event listener
  document.addEventListener('mouseup', function () {
    camera.handleMouseUp();
    dynamicData.handleMouseUp();
  });

  document.addEventListener('wheel', function (event) {
    camera.handleMouseWheel(event);
  });

  shader = new Shader(gl, vsSource, fsSource);
  const shaderProgram = shader.program;
  const programInfo = {
    program: shaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
      vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
    },
    uniformLocations: {
      projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
      modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
    },
  };

  quadShader = new Shader(gl, quadVsSource, quadFsSource);
  const quadShaderProgram = quadShader.program;
  const quadProgramInfo = {
    program: quadShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(quadShaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(quadShaderProgram, 'aTextureCoord'),
    },
  };

  copyTextureShader = new Shader(gl, quadVsSource, copyTextureFsSource);
  const copyTextureShaderProgram = copyTextureShader.program;
  const copyTextureProgramInfo = {
    program: copyTextureShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(copyTextureShaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(copyTextureShaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      sampler: gl.getUniformLocation(copyTextureShaderProgram, 'uSampler'),
    },
  };

  decayShader = new Shader(gl, quadVsSource, decayFsSource);
  const decayShaderProgram = decayShader.program;
  const decayProgramInfo = {
    program: decayShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(decayShaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(decayShaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      sampler: gl.getUniformLocation(decayShaderProgram, 'uSampler'),
    },
  };

  touchShader = new Shader(gl, quadVsSource, touchFsSource);
  const touchShaderProgram = touchShader.program;
  const touchProgramInfo = {
    program: touchShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(touchShaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(touchShaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      touch: gl.getUniformLocation(touchShaderProgram, 'touch'),
      vel: gl.getUniformLocation(touchShaderProgram, 'vel'),
      dt: gl.getUniformLocation(touchShaderProgram, 'dt'),
    },
  };
  // activeUniformNum = gl.getProgramParameter(touchProgramInfo.program, gl.ACTIVE_UNIFORMS)
  // for (let i = 0; i < activeUniformNum; i++) {
  //   console.log(gl.getActiveUniform(touchProgramInfo.program, i));
  // }
  // console.log(activeUniformNum)

  advectionShader = new Shader(gl, quadVsSource, advectionFsSource);
  const advectionShaderProgram = advectionShader.program;
  const advectionProgramInfo = {
    program: advectionShaderProgram,
    attribLocations: {
      vertexPosition: gl.getAttribLocation(advectionShaderProgram, 'aVertexPosition'),
      textureCoord: gl.getAttribLocation(advectionShaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
      quantity: gl.getUniformLocation(advectionShaderProgram, 'quantity'),
      vel: gl.getUniformLocation(advectionShaderProgram, 'vel'),
      dt: gl.getUniformLocation(advectionShaderProgram, 'dt'),
    },
  };



  checkWebGLError(gl);

  const buffers = initBuffers(gl);


  // Create a texture.
  var width = 512;
  var height = 512;
  getGLExtension(gl, 'OES_texture_float');
  getGLExtension(gl, 'OES_texture_float_linear');
  // getGLExtension(gl, 'WEBGL_color_buffer_float');
  // getGLExtension(gl, 'EXT_color_buffer_float');



  dyeTexture = new SwapTexture(gl, width, height);
  velTexture = new SwapTexture(gl, width, height);
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
  //               gl.RGBA, gl.UNSIGNED_BYTE, null);
  // // fill texture with a color
  // var data = new Uint8Array(width * height * 4);
  // for (var i = 0; i < data.length; i += 4) {
  //   data[i + 0] = 255; // R
  //   data[i + 1] = 0; // G
  //   data[i + 2] = 0; // B
  //   data[i + 3] = 255; // A
  // }
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0,
  //               gl.RGBA, gl.UNSIGNED_BYTE, data);
  // gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.FLOAT, null);

  checkWebGLError(gl);
  // console.log(pixels);
  
  
  // Initialize dye texture
  // Create a framebuffer and attach the texture.
  
  // {
  //   var fbo = gl.createFramebuffer();
  //   gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  //   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dyeTexture.cur_texture, 0);

  //   // Set the viewport to the texture's size
  //   gl.viewport(0, 0, width, height);

  //   // Clear to green, fully opaque
  //   gl.clearColor(0.0, 1.0, 0.0, 1.0);
  //   gl.enable(gl.DEPTH_TEST);
  //   gl.depthFunc(gl.LEQUAL);

  //   // Clear the canvas before we start drawing on it
  //   gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


  //   gl.useProgram(quadProgramInfo.program);
  //   {
  //     const numComponents = 2;
  //     const type = gl.FLOAT;
  //     const normalize = false;
  //     const sizeOfFloat = new Float32Array().BYTES_PER_ELEMENT;
  //     const stride = 4 * sizeOfFloat;
  //     const offset = 0;
  //     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.quad);
  //     gl.vertexAttribPointer(quadProgramInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
  //     gl.enableVertexAttribArray(quadProgramInfo.attribLocations.vertexPosition);
  //     gl.vertexAttribPointer(quadProgramInfo.attribLocations.textureCoord, numComponents, type, normalize, stride, 2*sizeOfFloat);
  //     gl.enableVertexAttribArray(quadProgramInfo.attribLocations.textureCoord);
  //   }
  //   {
  //     gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.quadIndices);
  //     const vertexCount = 6;
  //     const type = gl.UNSIGNED_SHORT;
  //     const offset = 0;
  //     gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  //   }
  // }
  
  // // We must bind a texture to the framebuffer in order to use gl.readPixels()
  //   var pixels = new Uint8Array(width * height * 4);
  //   gl.readPixels(0, 0, width, height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
  //   // get max value
  //   var max = 0;
  //   for (var i = 0; i < pixels.length; i += 4) {
  //     max = Math.max(max, pixels[i]);
  //   }
  //   console.log(max);

  const fps = 30;
  const interval = 1 / fps;
  let lastRenderTime = 0;

  // Draw the scene repeatedly
  function render(now) {


    now *= 0.001;  // convert to seconds
    const deltaTime = now - lastRenderTime;
    if (deltaTime >= interval) {
      lastRenderTime = now - (deltaTime % interval);


  
  // // Advect velocity
  // {
  //   var fbo = gl.createFramebuffer();
  //   gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  //   // gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
  //   gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, velTexture.next_texture, 0);


  //   // Set the viewport to the texture's size
  //   gl.viewport(0, 0, width, height);
  //   gl.enable(gl.DEPTH_TEST);
  //   gl.depthFunc(gl.LEQUAL);


  //   pi = advectionProgramInfo;
  //   gl.useProgram(pi.program);
  //   {
  //     const numComponents = 2;
  //     const type = gl.FLOAT;
  //     const normalize = false;
  //     const sizeOfFloat = new Float32Array().BYTES_PER_ELEMENT;
  //     const stride = 4 * sizeOfFloat;
  //     const offset = 0;
  //     gl.bindBuffer(gl.ARRAY_BUFFER, buffers.quad);
  //     gl.vertexAttribPointer(pi.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
  //     gl.enableVertexAttribArray(pi.attribLocations.vertexPosition);
  //     gl.vertexAttribPointer(pi.attribLocations.textureCoord, numComponents, type, normalize, stride, 2*sizeOfFloat);
  //     gl.enableVertexAttribArray(pi.attribLocations.textureCoord);
  //     gl.activeTexture(gl.TEXTURE0);
  //     gl.bindTexture(gl.TEXTURE_2D, velTexture.cur_texture);
  //     gl.uniform1i(pi.uniformLocations.quantity, 0);
  //     gl.activeTexture(gl.TEXTURE1);
  //     gl.bindTexture(gl.TEXTURE_2D, velTexture.cur_texture);
  //     gl.uniform1i(pi.uniformLocations.vel, 1);
  //     gl.uniform1f(pi.uniformLocations.dt, deltaTime);
  //     // real_touch = gl.getUniform(pi.program, pi.uniformLocations.touch);
  //     // console.log(real_touch);
      
  //     checkWebGLError(gl);
  //   }
  //   {
  //       gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.quadIndices);
  //       const vertexCount = 6;
  //       const type = gl.UNSIGNED_SHORT;
  //       const offset = 0;
  //       gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
  //   }
  // }

  // Advect dye
  {
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, dyeTexture.next_texture, 0);


    // Set the viewport to the texture's size
    gl.viewport(0, 0, width, height);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    pi = advectionProgramInfo;
    gl.useProgram(pi.program);
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const sizeOfFloat = new Float32Array().BYTES_PER_ELEMENT;
      const stride = 4 * sizeOfFloat;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.quad);
      gl.vertexAttribPointer(pi.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(pi.attribLocations.vertexPosition);
      gl.vertexAttribPointer(pi.attribLocations.textureCoord, numComponents, type, normalize, stride, 2*sizeOfFloat);
      gl.enableVertexAttribArray(pi.attribLocations.textureCoord);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dyeTexture.cur_texture);
      gl.uniform1i(pi.uniformLocations.quantity, 0);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, velTexture.cur_texture);
      gl.uniform1i(pi.uniformLocations.vel, 1);
      gl.uniform1f(pi.uniformLocations.dt, deltaTime);
      // real_touch = gl.getUniform(pi.program, pi.uniformLocations.touch);
      // console.log(real_touch);
      
      checkWebGLError(gl);
    }
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.quadIndices);
        const vertexCount = 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
  }

  dyeTexture.swap();
  velTexture.swap();


  // Interaction
  {
    var fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, velTexture.cur_texture, 0);

    // Set the viewport to the texture's size
    gl.viewport(0, 0, width, height);
    gl.enable(gl.BLEND);
    gl.blendEquation(gl.FUNC_ADD);
    gl.blendFunc(gl.ONE, gl.ONE);


    pi = touchProgramInfo;
    gl.useProgram(pi.program);
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const sizeOfFloat = new Float32Array().BYTES_PER_ELEMENT;
      const stride = 4 * sizeOfFloat;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.quad);
      gl.vertexAttribPointer(pi.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(pi.attribLocations.vertexPosition);
      gl.vertexAttribPointer(pi.attribLocations.textureCoord, numComponents, type, normalize, stride, 2*sizeOfFloat);
      gl.enableVertexAttribArray(pi.attribLocations.textureCoord);
      gl.uniform2f(pi.uniformLocations.touch, dynamicData.touch_uv.x, dynamicData.touch_uv.y);
      gl.uniform2f(pi.uniformLocations.vel, dynamicData.touch_uv.x - dynamicData.last_touch_uv.x, dynamicData.touch_uv.y - dynamicData.last_touch_uv.y);
      gl.uniform1f(pi.uniformLocations.dt, deltaTime);
      // real_touch = gl.getUniform(pi.program, pi.uniformLocations.touch);
      // console.log(real_touch);
      
      checkWebGLError(gl);
    }
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.quadIndices);
        const vertexCount = 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    gl.disable(gl.BLEND);

    checkWebGLError(gl);
  }




  // Draw to screen
  {
    // Draw to screen
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Clear to black, fully opaque
    gl.clearColor(1.0, 0.0, 0.0, 1.0);
    gl.clearDepth(1.0);
    // gl.enable(gl.DEPTH_TEST);
    // gl.depthFunc(gl.LEQUAL);

    // Clear the canvas before we start drawing on it
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.useProgram(copyTextureProgramInfo.program);
    {
      const numComponents = 2;
      const type = gl.FLOAT;
      const normalize = false;
      const sizeOfFloat = new Float32Array().BYTES_PER_ELEMENT;
      const stride = 4 * sizeOfFloat;
      const offset = 0;
      gl.bindBuffer(gl.ARRAY_BUFFER, buffers.quad);
      gl.vertexAttribPointer(copyTextureProgramInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
      gl.enableVertexAttribArray(copyTextureProgramInfo.attribLocations.vertexPosition);
      gl.vertexAttribPointer(copyTextureProgramInfo.attribLocations.textureCoord, numComponents, type, normalize, stride, 2*sizeOfFloat);
      gl.enableVertexAttribArray(copyTextureProgramInfo.attribLocations.textureCoord);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, dyeTexture.cur_texture);
      // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.uniform1i(copyTextureProgramInfo.uniformLocations.sampler, 0);
      checkWebGLError(gl);
    }
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.quadIndices);
        const vertexCount = 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
    // gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  }
  checkWebGLError(gl);




    // // Create a perspective matrix
    // aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    // const projectionMatrix = camera.perspective(aspect);
    // const modelViewMatrix = mat4.create();
    // mat4.multiply(modelViewMatrix, modelViewMatrix, camera.lookAt());

    // // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition attribute
    // {
    //   const numComponents = 3;  // pull out 3 values per iteration
    //   const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    //   const normalize = false;  // don't normalize
    //   const stride = 0;         // how many bytes to get from one set of values to the next
    //   const offset = 0;         // how many bytes inside the buffer to start from
    //   gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
    //   gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, numComponents, type, normalize, stride, offset);
    //   gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    // }
    // // Tell WebGL to use our program when drawing
    // gl.useProgram(programInfo.program);

    // // Set the shader uniforms
    // gl.uniformMatrix4fv(
    //   programInfo.uniformLocations.projectionMatrix,
    //   false,
    //   projectionMatrix);
    // gl.uniformMatrix4fv(
    //   programInfo.uniformLocations.modelViewMatrix,
    //   false,
    //   modelViewMatrix);

    // {
    //   const numComponents = 4;
    //   const type = gl.FLOAT;
    //   const normalize = false;
    //   const stride = 0;
    //   const offset = 0;
    //   gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
    //   gl.vertexAttribPointer(programInfo.attribLocations.vertexColor, numComponents, type, normalize, stride, offset);
    //   gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor);
    // }

    // // Tell WebGL which indices to use to index the vertices
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // // Draw the cube
    // const vertexCount = 36;
    // const type = gl.UNSIGNED_SHORT;
    // const offset = 0;
    // gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);

  }

  requestAnimationFrame(render);


  }
  requestAnimationFrame(render);
}

main();

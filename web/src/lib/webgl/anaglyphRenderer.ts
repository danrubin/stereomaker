import vertSrc from '../../shaders/anaglyph.vert.glsl?raw';
import fragSrc from '../../shaders/anaglyph.frag.glsl?raw';

function compileShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)!;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile error: ${log}`);
  }
  return shader;
}

function linkProgram(gl: WebGL2RenderingContext, vert: WebGLShader, frag: WebGLShader): WebGLProgram {
  const program = gl.createProgram()!;
  gl.attachShader(program, vert);
  gl.attachShader(program, frag);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link error: ${log}`);
  }
  return program;
}

function uploadBitmap(gl: WebGL2RenderingContext, texture: WebGLTexture, bitmap: ImageBitmap): void {
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bitmap);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  // Clamp to edge so out-of-bounds shifted right eye samples the border colour
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
}

/**
 * WebGL2 anaglyph renderer.
 * One instance per canvas. Never recreate the WebGL context — update textures in place.
 *
 * Context loss: listen for 'webglcontextlost' / 'webglcontextrestored' on the canvas
 * and call renderer.dispose() + create a new instance on restore (Phase 3 hardening).
 */
export class AnaglyphRenderer {
  private gl: WebGL2RenderingContext;
  private program: WebGLProgram;
  private texLeft: WebGLTexture;
  private texRight: WebGLTexture;
  private vao: WebGLVertexArrayObject;
  private uShiftX: WebGLUniformLocation;

  constructor(canvas: HTMLCanvasElement) {
    const gl = canvas.getContext('webgl2');
    if (!gl) throw new Error('WebGL2 not supported');
    this.gl = gl;

    const vert = compileShader(gl, gl.VERTEX_SHADER, vertSrc);
    const frag = compileShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    this.program = linkProgram(gl, vert, frag);
    gl.deleteShader(vert);
    gl.deleteShader(frag);

    // Empty VAO required by WebGL2 even with no attributes
    this.vao = gl.createVertexArray()!;

    this.texLeft  = gl.createTexture()!;
    this.texRight = gl.createTexture()!;

    gl.useProgram(this.program);
    gl.uniform1i(gl.getUniformLocation(this.program, 'uLeftEye'), 0);
    gl.uniform1i(gl.getUniformLocation(this.program, 'uRightEye'), 1);
    const uShiftX = gl.getUniformLocation(this.program, 'uShiftX');
    if (!uShiftX) throw new Error('uShiftX uniform not found in shader program');
    this.uShiftX = uShiftX;
  }

  /** Upload new left/right bitmaps. Call whenever images change. */
  setImages(left: ImageBitmap, right: ImageBitmap): void {
    const gl = this.gl;
    gl.activeTexture(gl.TEXTURE0);
    uploadBitmap(gl, this.texLeft, left);
    gl.activeTexture(gl.TEXTURE1);
    uploadBitmap(gl, this.texRight, right);
  }

  /**
   * Render one frame.
   * @param shiftX horizontal shift in pixels (params.translateX)
   * @param imageWidth width of the image in pixels (for normalising the shift)
   */
  render(shiftX: number, imageWidth: number): void {
    const gl = this.gl;
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.useProgram(this.program);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texLeft);
    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, this.texRight);

    gl.uniform1f(this.uShiftX, shiftX / imageWidth);

    gl.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.bindVertexArray(null);
  }

  dispose(): void {
    const gl = this.gl;
    gl.deleteProgram(this.program);
    gl.deleteTexture(this.texLeft);
    gl.deleteTexture(this.texRight);
    gl.deleteVertexArray(this.vao);
  }
}

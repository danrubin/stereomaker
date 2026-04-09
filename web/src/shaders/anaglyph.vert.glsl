#version 300 es

// Full-screen quad via gl_VertexID — no attribute buffers needed.
// Draw with gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4).
out vec2 vTexCoord;

void main() {
  // Map vertex 0-3 to the four corners of clip space
  vec2 pos = vec2(
    float(gl_VertexID & 1) * 2.0 - 1.0,
    float((gl_VertexID >> 1) & 1) * 2.0 - 1.0
  );
  gl_Position = vec4(pos, 0.0, 1.0);
  // Flip Y: WebGL clip-space Y is up, textures are top-down
  vTexCoord = vec2(pos.x * 0.5 + 0.5, 0.5 - pos.y * 0.5);
}

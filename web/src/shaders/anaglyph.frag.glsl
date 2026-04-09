#version 300 es
precision mediump float;

uniform sampler2D uLeftEye;
uniform sampler2D uRightEye;
// Horizontal shift of the right eye in normalised texture coordinates (0..1).
// Positive = shift right. Computed as: params.translateX / imageWidth.
uniform float uShiftX;

in vec2 vTexCoord;
out vec4 fragColor;

void main() {
  vec3 left  = texture(uLeftEye, vTexCoord).rgb;
  vec2 rightCoord = vec2(vTexCoord.x + uShiftX, vTexCoord.y);
  vec3 right = texture(uRightEye, rightCoord).rgb;

  // Red/cyan anaglyph: left eye → red channel, right eye → green + blue channels
  fragColor = vec4(left.r, right.gb, 1.0);
}

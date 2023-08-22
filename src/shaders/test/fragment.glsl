uniform vec3 uColor;
uniform sampler2D uTexture;

// varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
    // RGBA, so vec4
    // The texture2D function need the texture and the
    //UV, which is the position of the pixels
    vec4 textureColor = texture2D(uTexture, vUv);
    textureColor.rgb *= vElevation * 2.0 + 0.7;
    // gl_FragColor = vec4(uColor, 1.0);
    gl_FragColor = textureColor;
}
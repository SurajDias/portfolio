import { useEffect, useRef, useState } from "react";

interface FluidHeroCanvasProps {
  className?: string;
  isIntroComplete?: boolean;
}

export default function FluidHeroCanvas({
  className = "",
  isIntroComplete = true,
}: FluidHeroCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);
  const burstTriggerRef = useRef<(() => void) | null>(null);
  const burstFiredRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cleanupFn: (() => void) | undefined;

    try {
      cleanupFn = fluidSimulation(
        canvas,
        containerRef.current,
        (triggerBurst) => {
          burstTriggerRef.current = triggerBurst;
          if (isIntroComplete && !burstFiredRef.current) {
            burstFiredRef.current = true;
            triggerBurst();
          }
        }
      );
      if (!cleanupFn) {
        setWebGlSupported(false);
      }
    } catch (e) {
      console.warn("Fluid simulation WebGL initialization failed:", e);
      setWebGlSupported(false);
    }

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, []);

  useEffect(() => {
    if (isIntroComplete && burstTriggerRef.current && !burstFiredRef.current) {
      burstFiredRef.current = true;
      burstTriggerRef.current();
    }
  }, [isIntroComplete]);

  if (!webGlSupported) {
    return <StaticGradientFallback className={className} />;
  }

  return (
    <div ref={containerRef} className={`absolute inset-0 pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full block pointer-events-auto"
      />
    </div>
  );
}

function StaticGradientFallback({ className = "" }: { className?: string }) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-radial-top opacity-80" />
      <div className="absolute -right-32 top-[-10%] h-[550px] w-[550px] rounded-full bg-accent-glow/20 blur-[130px]" />
      <div className="absolute -left-32 bottom-[-10%] h-[450px] w-[450px] rounded-full bg-indigo-500/10 blur-[120px]" />
    </div>
  );
}

/* ==========================================================================
   Pavel Dobryakov WebGL Fluid Simulation Engine
   - Verbatim shaders, FBO setup, splats, noise, and physics loop.
   - Adapted with React cleanup & viewport/visibility performance guardrails.
   ========================================================================== */

function isMobileDevice() {
  return /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 768;
}

function fluidSimulation(
  canvas: HTMLCanvasElement,
  container: HTMLDivElement | null,
  onReady?: (triggerBurst: () => void) => void
) {
  const isMobile = isMobileDevice();
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  // Engine Config
  const config = {
    SIM_RESOLUTION: isMobile ? 64 : isDesktop ? 144 : 128,
    DYE_RESOLUTION: isMobile ? 512 : isDesktop ? 1024 : 768,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 1.0,
    VELOCITY_DISSIPATION: 0.2,
    PRESSURE: 0.8,
    PRESSURE_ITERATIONS: 20,
    CURL: 30,
    SPLAT_RADIUS: 0.25,
    SPLAT_FORCE: 6000,
    SHADING: !isMobile,
    COLORFUL: true,
    PAUSED: false,
    BACK_COLOR: { r: 0, g: 0, b: 0 },
    TRANSPARENT: true,
  };

  function HSVtoRGB(h: number, s: number, v: number) {
    let r = 0, g = 0, b = 0;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0: r = v; g = t; b = p; break;
      case 1: r = q; g = v; b = p; break;
      case 2: r = p; g = v; b = t; break;
      case 3: r = p; g = q; b = v; break;
      case 4: r = t; g = p; b = v; break;
      case 5: r = v; g = p; b = q; break;
    }
    return { r, g, b };
  }

  function generateColor() {
    // Narrow hue range to 0.58-0.78 (blue through violet) to match portfolio signature accent tokens
    const h = 0.58 + Math.random() * 0.20;
    const c = HSVtoRGB(h, 1.0, 1.0);
    return {
      r: c.r * 0.15,
      g: c.g * 0.15,
      b: c.b * 0.15,
    };
  }

  function getWebGLContext(canvas: HTMLCanvasElement) {
    const params = {
      alpha: true,
      depth: false,
      stencil: false,
      antialias: false,
      preserveDrawingBuffer: false,
    };

    let gl: any = canvas.getContext("webgl2", params);
    const isWebGL2 = !!gl;

    if (!isWebGL2) {
      gl = canvas.getContext("webgl", params) || canvas.getContext("experimental-webgl", params);
    }

    if (!gl) return null;

    let halfFloat: any;
    let supportLinearFiltering: any;

    if (isWebGL2) {
      gl.getExtension("EXT_color_buffer_float");
      supportLinearFiltering = gl.getExtension("OES_texture_float_linear");
    } else {
      halfFloat = gl.getExtension("OES_texture_half_float");
      supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    const halfFloatTexType = isWebGL2
      ? (gl as WebGL2RenderingContext).HALF_FLOAT
      : halfFloat
      ? halfFloat.HALF_FLOAT_OES
      : gl.UNSIGNED_BYTE;

    let formatRGBA: any;
    let formatRG: any;
    let formatR: any;

    if (isWebGL2) {
      const gl2 = gl as WebGL2RenderingContext;
      formatRGBA = getSupportedFormat(gl2, gl2.RGBA16F, gl2.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType);
      formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType);
    } else {
      formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
      formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    }

    return {
      gl,
      ext: {
        formatRGBA,
        formatRG,
        formatR,
        halfFloatTexType,
        supportLinearFiltering,
      },
    };
  }

  function getSupportedFormat(gl: any, internalFormat: number, format: number, type: number) {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      switch (internalFormat) {
        case gl.R16F:
          return getSupportedFormat(gl, gl.RG16F, gl.RG, type);
        case gl.RG16F:
          return getSupportedFormat(gl, gl.RGBA16F, gl.RGBA, type);
        default:
          return null;
      }
    }
    return { internalFormat, format };
  }

  function supportRenderTextureFormat(gl: any, internalFormat: number, format: number, type: number) {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null);

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);

    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status === gl.FRAMEBUFFER_COMPLETE;
  }

  const context = getWebGLContext(canvas);
  if (!context) return undefined;

  const { gl, ext } = context;

  // Shader Compilation Helpers
  class GLProgram {
    uniforms: { [key: string]: WebGLUniformLocation | null } = {};
    program: WebGLProgram;

    constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      this.program = gl.createProgram()!;
      gl.attachShader(this.program, vertexShader);
      gl.attachShader(this.program, fragmentShader);
      gl.linkProgram(this.program);

      if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
        console.error(gl.getProgramInfoLog(this.program));
      }

      const storeUniformsCount = gl.getProgramParameter(this.program, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < storeUniformsCount; i++) {
        const uniformName = gl.getActiveUniform(this.program, i)!.name;
        this.uniforms[uniformName] = gl.getUniformLocation(this.program, uniformName);
      }
    }

    bind() {
      gl.useProgram(this.program);
    }
  }

  function compileShader(type: number, source: string, keywords?: string[]) {
    source = addKeywords(source, keywords);
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  function addKeywords(source: string, keywords?: string[]) {
    if (!keywords) return source;
    let keywordsString = "";
    keywords.forEach((keyword) => {
      keywordsString += "#define " + keyword + "\n";
    });
    return keywordsString + source;
  }

  // Shaders
  const baseVertexShader = compileShader(
    gl.VERTEX_SHADER,
    `
    precision highp float;
    attribute vec2 aPosition;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform vec2 texelSize;

    void main () {
        vUv = aPosition * 0.5 + 0.5;
        vL = vUv - vec2(texelSize.x, 0.0);
        vR = vUv + vec2(texelSize.x, 0.0);
        vT = vUv + vec2(0.0, texelSize.y);
        vB = vUv - vec2(0.0, texelSize.y);
        gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `
  );

  const clearShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
    precision mediump float;
    varying highp vec2 vUv;
    uniform sampler2D uTexture;
    uniform float value;

    void main () {
        gl_FragColor = value * texture2D(uTexture, vUv);
    }
  `
  );

  const displayShaderSource = `
    precision highp float;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uTexture;
    uniform vec2 texelSize;

    void main () {
        vec3 c = texture2D(uTexture, vUv).rgb;

    #ifdef SHADING
        vec3 lc = texture2D(uTexture, vL).rgb;
        vec3 rc = texture2D(uTexture, vR).rgb;
        vec3 tc = texture2D(uTexture, vT).rgb;
        vec3 bc = texture2D(uTexture, vB).rgb;

        float dx = length(rc) - length(lc);
        float dy = length(tc) - length(bc);

        vec3 n = normalize(vec3(dx, dy, length(texelSize)));
        vec3 l = vec3(0.0, 0.0, 1.0);

        float diffuse = max(0.0, dot(n, l));
        c *= diffuse;
    #endif

        float a = max(c.r, max(c.g, c.b));
        gl_FragColor = vec4(c, a * 0.85);
    }
  `;

  const splatShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uTarget;
    uniform float aspect;
    uniform vec3 color;
    uniform vec2 point;
    uniform float radius;

    void main () {
        vec2 p = vUv - point.xy;
        p.x *= aspect;
        vec3 splat = exp(-dot(p, p) / radius) * color;
        vec3 base = texture2D(uTarget, vUv).xyz;
        gl_FragColor = vec4(base + splat, 1.0);
    }
  `
  );

  const advectionShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uVelocity;
    uniform sampler2D uSource;
    uniform vec2 texelSize;
    uniform vec2 dyeTexelSize;
    uniform float dt;
    uniform float dissipation;

    void main () {
        vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
        vec4 result = texture2D(uSource, coord);
        float decay = 1.0 + dissipation * dt;
        gl_FragColor = result / decay;
    }
  `
  );

  const divergenceShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).x;
        float R = texture2D(uVelocity, vR).x;
        float T = texture2D(uVelocity, vT).y;
        float B = texture2D(uVelocity, vB).y;

        vec2 C = texture2D(uVelocity, vUv).xy;
        if (vL.x < 0.0) { L = -C.x; }
        if (vR.x > 1.0) { R = -C.x; }
        if (vT.y > 1.0) { T = -C.y; }
        if (vB.y < 0.0) { B = -C.y; }

        float div = 0.5 * (R - L + T - B);
        gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
    }
  `
  );

  const curlShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uVelocity, vL).y;
        float R = texture2D(uVelocity, vR).y;
        float T = texture2D(uVelocity, vT).x;
        float B = texture2D(uVelocity, vB).x;
        float vorticity = 0.5 * (R - L - T + B);
        gl_FragColor = vec4(vorticity, 0.0, 0.0, 1.0);
    }
  `
  );

  const vorticityShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
    precision highp float;
    varying vec2 vUv;
    varying vec2 vL;
    varying vec2 vR;
    varying vec2 vT;
    varying vec2 vB;
    uniform sampler2D uVelocity;
    uniform sampler2D uCurl;
    uniform float curl;
    uniform float dt;

    void main () {
        float L = texture2D(uCurl, vL).x;
        float R = texture2D(uCurl, vR).x;
        float T = texture2D(uCurl, vT).x;
        float B = texture2D(uCurl, vB).x;
        float C = texture2D(uCurl, vUv).x;

        vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
        float l = length(force);
        force = (l > 0.0001) ? (force / l) : vec2(0.0);
        force *= curl * C;
        force.y *= -1.0;

        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity += force * dt;
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `
  );

  const pressureShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uDivergence;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        float divergence = texture2D(uDivergence, vUv).x;
        float pressure = (L + R + B + T - divergence) * 0.25;
        gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
    }
  `
  );

  const gradientSubtractShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
    precision mediump float;
    varying highp vec2 vUv;
    varying highp vec2 vL;
    varying highp vec2 vR;
    varying highp vec2 vT;
    varying highp vec2 vB;
    uniform sampler2D uPressure;
    uniform sampler2D uVelocity;

    void main () {
        float L = texture2D(uPressure, vL).x;
        float R = texture2D(uPressure, vR).x;
        float T = texture2D(uPressure, vT).x;
        float B = texture2D(uPressure, vB).x;
        vec2 velocity = texture2D(uVelocity, vUv).xy;
        velocity.xy -= vec2(R - L, T - B);
        gl_FragColor = vec4(velocity, 0.0, 1.0);
    }
  `
  );

  const clearProgram = new GLProgram(baseVertexShader, clearShader);
  const splatProgram = new GLProgram(baseVertexShader, splatShader);
  const advectionProgram = new GLProgram(baseVertexShader, advectionShader);
  const divergenceProgram = new GLProgram(baseVertexShader, divergenceShader);
  const curlProgram = new GLProgram(baseVertexShader, curlShader);
  const vorticityProgram = new GLProgram(baseVertexShader, vorticityShader);
  const pressureProgram = new GLProgram(baseVertexShader, pressureShader);
  const gradSubProgram = new GLProgram(baseVertexShader, gradientSubtractShader);

  const displayProgram = new GLProgram(
    baseVertexShader,
    compileShader(gl.FRAGMENT_SHADER, displayShaderSource, config.SHADING ? ["SHADING"] : [])
  );

  // Buffer Management
  let dye: DoubleFBO;
  let velocity: DoubleFBO;
  let divergence: FBO;
  let curl: FBO;
  let pressure: DoubleFBO;

  const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]), gl.STATIC_DRAW);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array([0, 1, 2, 0, 2, 3]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    return (target: FBO | null, clear = false) => {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (clear) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
  })();

  interface FBO {
    texture: WebGLTexture;
    fbo: WebGLFramebuffer;
    width: number;
    height: number;
    texelSizeX: number;
    texelSizeY: number;
    attach: (id: number) => number;
  }

  interface DoubleFBO {
    width: number;
    height: number;
    texelSizeX: number;
    texelSizeY: number;
    read: FBO;
    write: FBO;
    swap: () => void;
  }

  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null);

    const fbo = gl.createFramebuffer()!;
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const texelSizeX = 1.0 / w;
    const texelSizeY = 1.0 / h;

    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(w, h, internalFormat, format, type, param);

    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1;
      },
      set read(value) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value) {
        fbo2 = value;
      },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);

    const texType = ext.halfFloatTexType;
    const rgba = ext.formatRGBA;
    const rg = ext.formatRG;
    const r = ext.formatR;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    if (!dye)
      dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);
    else
      dye = resizeDoubleFBO(dye, dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering);

    if (!velocity)
      velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);
    else
      velocity = resizeDoubleFBO(velocity, simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering);

    divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
    pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST);
  }

  function resizeDoubleFBO(target: DoubleFBO, w: number, h: number, internalFormat: number, format: number, type: number, param: number) {
    if (target.width === w && target.height === h) return target;
    target.read = createFBO(w, h, internalFormat, format, type, param);
    target.write = createFBO(w, h, internalFormat, format, type, param);
    target.width = w;
    target.height = h;
    target.texelSizeX = 1.0 / w;
    target.texelSizeY = 1.0 / h;
    return target;
  }

  function getResolution(resolution: number) {
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;

    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);

    if (gl.drawingBufferWidth > gl.drawingBufferHeight)
      return { width: max, height: min };
    else return { width: min, height: max };
  }

  function scaleByPixelRatio(input: number) {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
  }

  // Pointer & Simulation Control
  class Pointer {
    id = -1;
    texcoordX = 0;
    texcoordY = 0;
    prevTexcoordX = 0;
    prevTexcoordY = 0;
    deltaX = 0;
    deltaY = 0;
    down = false;
    moved = false;
    color = generateColor();
  }

  const pointers: Pointer[] = [new Pointer()];

  function splat(x: number, y: number, dx: number, dy: number, color: { r: number; g: number; b: number }) {
    splatProgram.bind();
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(splatProgram.uniforms.aspect, canvas.width / canvas.height);
    gl.uniform2f(splatProgram.uniforms.point, x, y);
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
    gl.uniform1f(splatProgram.uniforms.radius, correctRadius(config.SPLAT_RADIUS / 100.0));
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(dye.write);
    dye.swap();
  }

  function correctRadius(radius: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) radius *= aspectRatio;
    return radius;
  }

  function multipleSplats(amount: number) {
    for (let i = 0; i < amount; i++) {
      const color = generateColor();
      color.r *= 10.0;
      color.g *= 10.0;
      color.b *= 10.0;
      const x = Math.random();
      const y = Math.random();
      const dx = 1000 * (Math.random() - 0.5);
      const dy = 1000 * (Math.random() - 0.5);
      splat(x, y, dx, dy, color);
    }
  }

  // Load burst logic
  function triggerLoadBurst() {
    multipleSplats(34);
    // Queue 8 waves with slight stagger
    for (let wave = 0; wave < 8; wave++) {
      setTimeout(() => {
        if (!isStopped) {
          multipleSplats(4);
        }
      }, wave * 180);
    }
  }

  // Auto-Cursor Orbit Logic Constants
  const ORBIT_RADIUS = 0.22;
  const ORBIT_SPEED = 0.85;
  const ORBIT_START_DELAY = 1000;
  let lastUserInteractionTime = Date.now();
  let orbitAngle = 0;

  function updateAutoOrbit(dt: number) {
    if (isMobile) return; // Skip auto orbit on mobile as per spec guardrails
    if (Date.now() - lastUserInteractionTime < ORBIT_START_DELAY) return;

    orbitAngle += dt * ORBIT_SPEED;
    const breathingRadius = ORBIT_RADIUS + Math.sin(orbitAngle * 1.5) * 0.04;

    const centerX = 0.5;
    const centerY = 0.5;
    const aspect = canvas.width / canvas.height;

    const x = centerX + Math.cos(orbitAngle) * breathingRadius;
    const y = centerY + Math.sin(orbitAngle) * breathingRadius * (aspect > 1 ? aspect : 1);

    const prevX = centerX + Math.cos(orbitAngle - dt * ORBIT_SPEED) * breathingRadius;
    const prevY = centerY + Math.sin(orbitAngle - dt * ORBIT_SPEED) * breathingRadius * (aspect > 1 ? aspect : 1);

    const dx = (x - prevX) * config.SPLAT_FORCE * 0.5;
    const dy = (y - prevY) * config.SPLAT_FORCE * 0.5;

    const color = generateColor();
    color.r *= 6.0;
    color.g *= 6.0;
    color.b *= 6.0;

    splat(x, y, dx, dy, color);
  }

  // Render & Physics Loop
  let lastUpdateTime = Date.now();
  let animFrameId: number | null = null;
  let isStopped = false;
  let isIntersecting = true;
  let isTabVisible = document.visibilityState === "visible";

  function update() {
    if (isStopped) return;

    // Guardrails: check visibility and viewport intersection
    if (!isIntersecting || !isTabVisible) {
      animFrameId = null;
      return;
    }

    resizeCanvas();
    const now = Date.now();
    let dt = (now - lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    lastUpdateTime = now;

    // Update auto orbit if idle
    updateAutoOrbit(dt);

    // Apply pointer movement splats
    pointers.forEach((p) => {
      if (p.moved) {
        p.moved = false;
        splat(p.texcoordX, p.texcoordY, p.deltaX * config.SPLAT_FORCE, p.deltaY * config.SPLAT_FORCE, p.color);
      }
    });

    // Step WebGL Simulation
    gl.viewport(0, 0, velocity.width, velocity.height);

    curlProgram.bind();
    gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl);

    vorticityProgram.bind();
    gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    divergenceProgram.bind();
    gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    clearProgram.bind();
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    pressureProgram.bind();
    gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    gradSubProgram.bind();
    gl.uniform2f(gradSubProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    gl.uniform1i(gradSubProgram.uniforms.uPressure, pressure.read.attach(0));
    gl.uniform1i(gradSubProgram.uniforms.uVelocity, velocity.read.attach(1));
    blit(velocity.write);
    velocity.swap();

    advectionProgram.bind();
    gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY);
    if (!ext.supportLinearFiltering) {
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY);
    }
    const velocityId = velocity.read.attach(0);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION);
    blit(velocity.write);
    velocity.swap();

    gl.viewport(0, 0, dye.width, dye.height);
    if (!ext.supportLinearFiltering) {
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY);
    }
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION);
    blit(dye.write);
    dye.swap();

    // Render to Screen
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    displayProgram.bind();
    if (config.SHADING) {
      gl.uniform2f(displayProgram.uniforms.texelSize, 1.0 / gl.drawingBufferWidth, 1.0 / gl.drawingBufferHeight);
    }
    gl.uniform1i(displayProgram.uniforms.uTexture, dye.read.attach(0));
    blit(null);

    animFrameId = requestAnimationFrame(update);
  }

  function startLoop() {
    if (animFrameId === null && !isStopped && isIntersecting && isTabVisible) {
      lastUpdateTime = Date.now();
      animFrameId = requestAnimationFrame(update);
    }
  }

  function resizeCanvas() {
    const width = scaleByPixelRatio(canvas.clientWidth);
    const height = scaleByPixelRatio(canvas.clientHeight);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      initFramebuffers();
    }
  }

  // Event Handlers
  function updatePointerMoveData(pointer: Pointer, x: number, y: number) {
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = x / canvas.clientWidth;
    pointer.texcoordY = 1.0 - y / canvas.clientHeight;
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved = Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
  }

  function correctDeltaX(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
  }

  function correctDeltaY(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
  }

  const handleMouseMove = (e: MouseEvent) => {
    lastUserInteractionTime = Date.now();
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
      const pointer = pointers[0];
      updatePointerMoveData(pointer, x, y);
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    lastUserInteractionTime = Date.now();
    const rect = canvas.getBoundingClientRect();
    const touches = e.targetTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      if (i < pointers.length) {
        updatePointerMoveData(pointers[i], x, y);
      }
    }
  };

  const handleTouchStart = (e: TouchEvent) => {
    lastUserInteractionTime = Date.now();
    const rect = canvas.getBoundingClientRect();
    const touches = e.targetTouches;
    for (let i = 0; i < touches.length; i++) {
      if (i >= pointers.length) pointers.push(new Pointer());
      const touch = touches[i];
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      pointers[i].id = touch.identifier;
      pointers[i].down = true;
      pointers[i].texcoordX = x / canvas.clientWidth;
      pointers[i].texcoordY = 1.0 - y / canvas.clientHeight;
      pointers[i].prevTexcoordX = pointers[i].texcoordX;
      pointers[i].prevTexcoordY = pointers[i].texcoordY;
      pointers[i].deltaX = 0;
      pointers[i].deltaY = 0;
      pointers[i].color = generateColor();
    }
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("touchmove", handleTouchMove, { passive: true });
  window.addEventListener("touchstart", handleTouchStart, { passive: true });

  // IntersectionObserver & Visibility API Performance Guardrails
  const observer = new IntersectionObserver(
    (entries) => {
      const entry = entries[0];
      isIntersecting = entry ? entry.isIntersecting : true;
      if (isIntersecting) {
        startLoop();
      }
    },
    { threshold: 0.05 }
  );

  const targetElem = container || canvas;
  observer.observe(targetElem);

  const handleVisibilityChange = () => {
    isTabVisible = document.visibilityState === "visible";
    if (isTabVisible) {
      startLoop();
    }
  };
  document.addEventListener("visibilitychange", handleVisibilityChange);

  // Initialize
  initFramebuffers();
  if (onReady) {
    onReady(triggerLoadBurst);
  } else {
    triggerLoadBurst();
  }
  startLoop();

  // Cleanup Teardown Function (returned to useEffect)
  return () => {
    isStopped = true;
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId);
      animFrameId = null;
    }
    observer.disconnect();
    document.removeEventListener("visibilitychange", handleVisibilityChange);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("touchmove", handleTouchMove);
    window.removeEventListener("touchstart", handleTouchStart);
  };
}

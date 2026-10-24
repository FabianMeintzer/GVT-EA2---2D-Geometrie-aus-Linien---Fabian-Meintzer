'use strict';

const BEZIER_STEPS = 12;
const QUAD_STEPS = 8;

function bezier(p0, c1, c2, p3, steps = BEZIER_STEPS) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s = 1 - t;
    const a = s * s * s;
    const b = 3 * s * s * t;
    const c = 3 * s * t * t;
    const d = t * t * t;
    points.push([
      a * p0[0] + b * c1[0] + c * c2[0] + d * p3[0],
      a * p0[1] + b * c1[1] + c * c2[1] + d * p3[1]
    ]);
  }
  return points;
}

function quadratic(p0, control, p2, steps = QUAD_STEPS) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const s = 1 - t;
    points.push([
      s * s * p0[0] + 2 * s * t * control[0] + t * t * p2[0],
      s * s * p0[1] + 2 * s * t * control[1] + t * t * p2[1]
    ]);
  }
  return points;
}

// Verbindet Kurvenstücke und vermeidet doppelte Punkte an den Nahtstellen.
function joinCurves(curves) {
  const result = [];
  curves.forEach(curve => {
    for (let i = result.length ? 1 : 0; i < curve.length; i++) {
      result.push(curve[i]);
    }
  });
  return result;
}

function closed(points) {
  if (points.length > 1) {
    const first = points[0];
    const last = points[points.length - 1];
    if (Math.abs(first[0] - last[0]) < 1e-6 && Math.abs(first[1] - last[1]) < 1e-6) {
      points.pop();
    }
  }
  return points;
}

function circle(cx, cy, rx, ry = rx, steps = 20, rotation = 0) {
  const points = [];
  for (let i = 0; i < steps; i++) {
    const angle = rotation + (i / steps) * Math.PI * 2;
    points.push([cx + Math.cos(angle) * rx, cy + Math.sin(angle) * ry]);
  }
  return points;
}

function line(a, b) {
  return [a, b];
}

function wave(x0, x1, y, amplitude, cycles, steps = 24, phase = 0) {
  const points = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    points.push([
      x0 + (x1 - x0) * t,
      y + amplitude * Math.sin(t * Math.PI * 2 * cycles + phase)
    ]);
  }
  return points;
}


const COLORS = {
  cream:     [0.97, 0.94, 0.87, 1.00],
  champagne: [0.88, 0.75, 0.53, 0.96],
  gold:      [0.78, 0.59, 0.34, 0.93],
  mutedGold: [0.55, 0.45, 0.30, 0.72]
};

const body = closed(joinCurves([
  bezier([ 0.18,  0.36], [ 0.29,  0.45], [ 0.47,  0.48], [ 0.61,  0.43]),
  bezier([ 0.61,  0.43], [ 0.74,  0.40], [ 0.81,  0.33], [ 0.84,  0.28]),
  bezier([ 0.84,  0.28], [ 0.90,  0.29], [ 0.96,  0.27], [ 0.95,  0.23]),
  bezier([ 0.95,  0.23], [ 0.94,  0.19], [ 0.88,  0.16], [ 0.79,  0.17]),
  bezier([ 0.79,  0.17], [ 0.69,  0.17], [ 0.60,  0.10], [ 0.53, -0.02]),
  bezier([ 0.53, -0.02], [ 0.45, -0.18], [ 0.29, -0.31], [ 0.09, -0.35]),
  bezier([ 0.09, -0.35], [-0.13, -0.39], [-0.36, -0.30], [-0.52, -0.18]),
  bezier([-0.52, -0.18], [-0.61, -0.11], [-0.69, -0.07], [-0.73, -0.02]),
  bezier([-0.73, -0.02], [-0.77,  0.03], [-0.74,  0.09], [-0.67,  0.12]),
  bezier([-0.67,  0.12], [-0.49,  0.20], [-0.27,  0.31], [-0.07,  0.35]),
  bezier([-0.07,  0.35], [ 0.03,  0.37], [ 0.12,  0.38], [ 0.18,  0.36])
]));

// Hinterflossen
const tailUpper = joinCurves([
  bezier([-0.75, 0.045], [-0.78, 0.035], [-0.86, 0.085], [-0.91, 0.145]),
  bezier([-0.91, 0.145], [-0.94, 0.185], [-0.90, 0.225], [-0.85, 0.205]),
  bezier([-0.85, 0.205], [-0.79, 0.165], [-0.73, 0.105], [-0.72, 0.08])
]);

const tailLower = joinCurves([
  bezier([-0.71, -0.035], [-0.78, -0.075], [-0.85, -0.125], [-0.89, -0.190]),
  bezier([-0.89, -0.190], [-0.91, -0.235], [-0.87, -0.270], [-0.82, -0.245]),
  bezier([-0.82, -0.245], [-0.76, -0.205], [-0.70, -0.145], [-0.64, -0.115])
]);

// Vorderflosse
const frontFlipper = closed(joinCurves([
  bezier([ 0.10, -0.145], [ 0.075, -0.235], [ 0.015, -0.335], [-0.080, -0.385]),
  bezier([-0.080, -0.385], [-0.155, -0.420], [-0.245, -0.375], [-0.250, -0.315]),
  bezier([-0.250, -0.315], [-0.205, -0.245], [-0.125, -0.160], [-0.035, -0.105]),
  bezier([-0.035, -0.105], [ 0.020, -0.105], [ 0.070, -0.120], [ 0.10, -0.145])
]));

// Andeutung zweite Flosse
const farFlipper = joinCurves([
  bezier([-0.22, -0.275], [-0.30, -0.335], [-0.39, -0.355], [-0.46, -0.325]),
  bezier([-0.46, -0.325], [-0.40, -0.285], [-0.32, -0.260], [-0.25, -0.245])
]);

// Augenposition
const eye = circle(0.675, 0.335, 0.025, 0.030, 18);
const nose = closed(circle(0.925, 0.242, 0.019, 0.013, 12, 0.2));
const mouth = joinCurves([
  quadratic([0.914, 0.205], [0.865, 0.169], [0.795, 0.181]),
  quadratic([0.795, 0.181], [0.770, 0.184], [0.750, 0.198])
]);

// Schnurrhaare
const whiskers = [
  quadratic([0.925, 0.205], [0.950, 0.225], [0.990, 0.252]),
  quadratic([0.820, 0.190], [0.905, 0.190], [0.995, 0.190]),
  quadratic([0.814, 0.177], [0.890, 0.150], [0.970, 0.125])
];

// Innere Akzentlinien 
const backAccent = joinCurves([
  bezier([-0.41, 0.205], [-0.18, 0.290], [-0.07, 0.345], [0.10, 0.350]),
  bezier([ 0.10, 0.350], [ 0.19, 0.350], [ 0.26, 0.336], [0.31, 0.318])
]);
const bellyAccent = bezier([-0.42, -0.185], [-0.25, -0.285], [-0.04, -0.325], [0.12, -0.305]);
const neckLine = bezier([0.20, 0.315], [0.35, 0.325], [0.31, 0.225], [0.52, 0.015]);
const flipperDetail = bezier([-0.045, -0.205], [-0.105, -0.275], [-0.165, -0.325], [-0.205, -0.333]);

// Dekoration im Hintergrund
const water1 = wave(-0.66, 0.10, -0.505, 0.014, 1.5, 30, 0.2);
const water2 = wave( 0.22, 0.83, -0.555, 0.012, 1.5, 30, 1.0);
const water3 = wave( 0.32, 0.93, -0.735, 0.012, 1.5, 30, 1.2);
const water4 = wave( -0.80, 0.23, -0.625, 0.014, 1.5, 30, 2.2);
const bubble1 = circle(-0.56, 0.465, 0.025, 0.031, 12);
const bubble2 = circle(-0.43, 0.555, 0.040, 0.047, 16);
const bubble3 = circle(-0.29, 0.475, 0.014, 0.018, 10);
const glints = [
  ...line([0.36, 0.59], [0.36, 0.66]),
  ...line([0.325, 0.625], [0.395, 0.625]),
  ...line([0.48, 0.55], [0.48, 0.595]),
  ...line([0.458, 0.5725], [0.502, 0.5725])
];


const PARTS = [
  { name: 'Wasserlinie links',      mode: 'LINE_STRIP', color: COLORS.mutedGold, pts: water1 },
  { name: 'Wasserlinie rechts',     mode: 'LINE_STRIP', color: COLORS.mutedGold, pts: water2 },
  { name: 'Wasserlinie rechts',     mode: 'LINE_STRIP', color: COLORS.mutedGold, pts: water3 },
  { name: 'Wasserlinie rechts',     mode: 'LINE_STRIP', color: COLORS.mutedGold, pts: water4 },
  { name: 'Luftblase groß',         mode: 'LINE_LOOP',  color: COLORS.mutedGold, pts: bubble2 },
  { name: 'Luftblase klein links',  mode: 'LINE_LOOP',  color: COLORS.mutedGold, pts: bubble1 },
  { name: 'Luftblase klein rechts', mode: 'LINE_LOOP',  color: COLORS.mutedGold, pts: bubble3 },
  { name: 'Glanzlichter',           mode: 'LINES',      color: COLORS.gold,      pts: glints },
  { name: 'Hinterflosse oben',      mode: 'LINE_STRIP', color: COLORS.cream,     pts: tailUpper },
  { name: 'Hinterflosse unten',     mode: 'LINE_STRIP', color: COLORS.cream,     pts: tailLower },
  { name: 'Zweite Vorderflosse',    mode: 'LINE_STRIP', color: COLORS.mutedGold, pts: farFlipper },
  { name: 'Körperkontur',           mode: 'LINE_LOOP',  color: COLORS.cream,     pts: body },
  { name: 'Vorderflosse',           mode: 'LINE_LOOP',  color: COLORS.champagne, pts: frontFlipper },
  { name: 'Rückenakzent',           mode: 'LINE_STRIP', color: COLORS.champagne, pts: backAccent },
  { name: 'Bauchakzent',            mode: 'LINE_STRIP', color: COLORS.champagne, pts: bellyAccent },
  { name: 'Nackenlinie',            mode: 'LINE_STRIP', color: COLORS.mutedGold, pts: neckLine },
  { name: 'Flossenfalte',           mode: 'LINE_STRIP', color: COLORS.gold,      pts: flipperDetail },
  { name: 'Auge',                   mode: 'LINE_LOOP',  color: COLORS.cream,     pts: eye },
  { name: 'Nase',                   mode: 'LINE_LOOP',  color: COLORS.champagne, pts: nose },
  { name: 'Mundlinie',              mode: 'LINE_STRIP', color: COLORS.cream,     pts: mouth },
  { name: 'Schnurrhaar oben',       mode: 'LINE_STRIP', color: COLORS.champagne, pts: whiskers[0] },
  { name: 'Schnurrhaar Mitte',      mode: 'LINE_STRIP', color: COLORS.champagne, pts: whiskers[1] },
  { name: 'Schnurrhaar unten',      mode: 'LINE_STRIP', color: COLORS.champagne, pts: whiskers[2] }
];

/* Vertexbuffer vorbereiten (mit KI Hilfe) */
function buildGeometry(parts, aspect = 1) {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  for (const part of parts) {
    if (!Array.isArray(part.pts) || part.pts.length === 0) {
      throw new Error('Geometrie „' + part.name + '“ enthält keine Punkte.');
    }
    for (const p of part.pts) {
      if (!Array.isArray(p) || p.length !== 2 || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) {
        throw new Error('Ungültiger 2D-Vertex in „' + part.name + '“. Erwartet wird [x, y].');
      }
      minX = Math.min(minX, p[0]);
      minY = Math.min(minY, p[1]);
      maxX = Math.max(maxX, p[0]);
      maxY = Math.max(maxY, p[1]);
    }
  }

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const halfWidth = (maxX - minX) / 2 || 1;
  const halfHeight = (maxY - minY) / 2 || 1;

  const scale = Math.min(0.88 / halfHeight, (0.88 * aspect) / halfWidth);
  const vertexCount = parts.reduce((sum, part) => sum + part.pts.length, 0);
  const data = new Float32Array(vertexCount * 2);
  let vertexOffset = 0;

  for (const part of parts) {
    part.first = vertexOffset;             // Startindex in Vertices
    part.count = part.pts.length;          // Anzahl Vertices, nicht Floats
    for (const p of part.pts) {
      data[vertexOffset * 2] = ((p[0] - centerX) * scale) / aspect;
      data[vertexOffset * 2 + 1] = (p[1] - centerY) * scale;
      vertexOffset++;
    }
  }

  return { data, vertexCount };
}

/* WebGL-Shader und Rendering (mit KI Hilfe) */
const VERTEX_SHADER = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec4 uColor;
  void main() {
    gl_FragColor = uColor;
  }
`;

function compileShader(gl, type, source, label) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error(label + ' konnte nicht angelegt werden.');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || 'Unbekannter Shaderfehler';
    gl.deleteShader(shader);
    throw new Error(label + ': ' + message);
  }
  return shader;
}

function createProgram(gl) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER, 'Vertex-Shader');
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER, 'Fragment-Shader');
  const program = gl.createProgram();
  if (!program) throw new Error('WebGL-Programm konnte nicht angelegt werden.');
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || 'Unbekannter Linkerfehler';
    gl.deleteProgram(program);
    throw new Error('Shader-Programm: ' + message);
  }
  return program;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function showFatal(message) {
  const canvas = document.getElementById('glcanvas');
  const errorBox = document.getElementById('webgl-error');
  if (canvas) canvas.style.display = 'none';
  if (errorBox) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  } else {
    console.error(message);
  }
}

function main() {
  const canvas = document.getElementById('glcanvas');

  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    premultipliedAlpha: false
  });

  const program = createProgram(gl);
  gl.useProgram(program);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  gl.clearColor(0, 0, 0, 0);

  const positionLocation = gl.getAttribLocation(program, 'aPosition');
  const colorLocation = gl.getUniformLocation(program, 'uColor');
  if (positionLocation < 0 || colorLocation === null) {
    throw new Error('Ein benötigtes Shader-Attribut oder Uniform wurde nicht gefunden.');
  }

  const buffer = gl.createBuffer();
  if (!buffer) throw new Error('Vertexbuffer konnte nicht angelegt werden.');
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

  let lastGeometry = null;
  function resizeAndDraw() {
    const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
    const cssWidth = canvas.clientWidth || 640;
    const cssHeight = canvas.clientHeight || cssWidth;
    const width = Math.max(1, Math.round(cssWidth * dpr));
    const height = Math.max(1, Math.round(cssHeight * dpr));
    if (canvas.width !== width) canvas.width = width;
    if (canvas.height !== height) canvas.height = height;

    const aspect = cssWidth / cssHeight || 1;
    lastGeometry = buildGeometry(PARTS, aspect);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, lastGeometry.data, gl.STATIC_DRAW);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    for (const part of PARTS) {
      gl.uniform4fv(colorLocation, part.color);
      gl.drawArrays(gl[part.mode], part.first, part.count);
    }

    const errorCode = gl.getError();
    if (errorCode !== gl.NO_ERROR) {
      console.error('[Seal] WebGL meldet Fehlercode:', errorCode);
    }
  }

  window.addEventListener('resize', resizeAndDraw);
  if (typeof ResizeObserver === 'function') {
    const observer = new ResizeObserver(resizeAndDraw);
    observer.observe(canvas);
  }
  resizeAndDraw();

  const modes = [...new Set(PARTS.map(part => 'gl.' + part.mode))];
  setText('stat-vertices', String(lastGeometry.vertexCount));
  setText('stat-parts', String(PARTS.length));
  setText('stat-draws', String(PARTS.length));
  setText('stat-modes', modes.join(' · '));

  console.info(
    '[Seal] Zeichnung bereit:', lastGeometry.vertexCount, '2D-Vertices,',
    lastGeometry.vertexCount * 2, 'Float-Werte,', PARTS.length,
    'drawArrays()-Aufrufe. Zeichenmodi:', modes.join(', ')
  );
}

try {
  main();
} catch (error) {
  showFatal('Die WebGL-Anwendung konnte nicht gestartet werden: ' + error.message);
  console.error(error);
}

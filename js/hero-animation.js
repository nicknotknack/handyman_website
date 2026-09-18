(function () {
  const wrapper = document.querySelector('.hero-canvas-wrapper');
  const container = document.getElementById('hero-canvas');

  if (!wrapper || !container || typeof THREE === 'undefined') return;

  const imageSources = ['images/hero.png', 'images/expert.png'];

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  container.appendChild(renderer.domElement);

  const loader = new THREE.TextureLoader();
  const textures = imageSources.map((src) => {
    const texture = loader.load(src);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  });

  const material = new THREE.ShaderMaterial({
    uniforms: {
      uFrom: { value: textures[0] },
      uTo: { value: textures[1] },
      uProgress: { value: 0 },
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uFrom;
      uniform sampler2D uTo;
      uniform float uProgress;
      varying vec2 vUv;

      void main() {
        vec2 uvFrom = vUv;
        vec2 uvTo = vUv;

        // subtle zoom + diagonal wipe for a livelier crossfade
        float wipe = smoothstep(uProgress - 0.2, uProgress + 0.2, vUv.x + vUv.y * 0.3 - 0.15);

        float scaleFrom = 1.0 + uProgress * 0.08;
        uvFrom = (uvFrom - 0.5) / scaleFrom + 0.5;

        float scaleTo = 1.08 - uProgress * 0.08;
        uvTo = (uvTo - 0.5) / scaleTo + 0.5;

        vec4 colFrom = texture2D(uFrom, uvFrom);
        vec4 colTo = texture2D(uTo, uvTo);

        gl_FragColor = mix(colFrom, colTo, wipe);
      }
    `,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  function resize() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', resize);
  resize();
  wrapper.classList.add('is-active');

  const holdDuration = 2000;
  const transitionDuration = 900;
  let currentIndex = 0;
  let transitionStart = null;

  function startTransition() {
    const nextIndex = (currentIndex + 1) % textures.length;
    material.uniforms.uFrom.value = textures[currentIndex];
    material.uniforms.uTo.value = textures[nextIndex];
    material.uniforms.uProgress.value = 0;
    transitionStart = performance.now();
    currentIndex = nextIndex;
  }

  setInterval(startTransition, holdDuration);

  function animate(time) {
    requestAnimationFrame(animate);

    if (transitionStart !== null) {
      const elapsed = time - transitionStart;
      const t = Math.min(elapsed / transitionDuration, 1);
      material.uniforms.uProgress.value = t;
      if (t >= 1) transitionStart = null;
    }

    renderer.render(scene, camera);
  }

  requestAnimationFrame(animate);
})();

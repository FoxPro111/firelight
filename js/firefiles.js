"use strict";

(function($) {
  // CONSTANTS
  const particleImage = "image/particle.png";
  const PARTICLES = 5000;

  const RADIUS = 200;
  const display = [];
  const colors = [];
  const alphas = [];
  const alphaDeltas = [];
  const positions = [];
  const sizes = [];
  const WRAPPER = document.getElementById("fireflies-window");

  // VARIABLES
  let camera = null;
  let scene = null;

  let uniforms = null;
  let geometry = null;
  let initialPos = null;
  let particleSystem = null;
  let renderer = null;
  let inc = 0;
  let zoomed = false;
  let xPos = null;
  let yPos = null;

  // var renderer, scene, camera, stats;
  // var particleSystem,
  //   uniforms,
  //   geometry,
  //   ,
  //   initialSizes = [],
  //   colors = [],
  //   ;
  // var controls;

  // var zoomed = false;

  init();
  animate();

  /******************/
  /*****  INIT  *****/
  /******************/
  function init() {
    createParticles();

    // create camera view
    camera = new THREE.PerspectiveCamera(
      40,
      window.innerWidth / window.innerHeight,
      1,
      10000
    );
    camera.position.z = 600;

    // create camera view
    scene = new THREE.Scene();
    uniforms = {
      texture: {
        value: new THREE.TextureLoader().load(particleImage)
      },
      u_mouse: {
        type: "v2",
        value: new THREE.Vector2()
      }
    };

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: document.getElementById("vertexshader").textContent,
      fragmentShader: document.getElementById("fragmentshader").textContent,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true
    });

    geometry = new THREE.BufferGeometry();

    geometry.addAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );

    geometry.addAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.addAttribute("alpha", new THREE.Float32BufferAttribute(alphas, 1));
    geometry.addAttribute(
      "size",
      new THREE.Float32BufferAttribute(sizes, 1).setDynamic(true)
    );

    particleSystem = new THREE.Points(geometry, shaderMaterial);
    scene.add(particleSystem); //particleSystem.rotation.y = -.4
    particleSystem.position.x = 60;

    // add rendered element (wrapper)
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000);
    WRAPPER.appendChild(renderer.domElement);

    // add event listiners
    window.addEventListener("resize", onWindowResize, false);
    window.addEventListener("mousemove", mouseMoveEvent);

    // animate on load
    TweenMax.to(camera.position, 5.0, {
      z: 320
    });

    TweenMax.fromTo(
      camera.rotation,
      5.0,
      {
        z: -1.57
      },
      {
        z: 0
      }
    );
  }

  // function onDocumentMouseMove(event) {
  //   event.preventDefault();

  //   mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //   mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  // }

  function createParticles() {
    for (var i = 0; i < PARTICLES / 2; i++) {
      const pX = (Math.random() * 2 - 1) * RADIUS;
      const pY = Math.random() * 2 * RADIUS;
      const pZ = Math.random() * 160 + (i % 2 == 0 ? 200 : 20);

      positions.push(pX);
      positions.push(pY);
      positions.push(pZ);

      positions.push(pX);
      positions.push(Math.min(-1.5, -pY));
      positions.push(pZ);

      // display.push(Math.round(Math.random()));
      // display.push(Math.round(Math.random()));

      colors.push(0, 0, 0);
      colors.push(0, 0, 0);

      const size1 = Math.random() * 10 + 10;
      const size2 = Math.random() * 8 + 2;

      sizes.push(size1);
      sizes.push(size2);

      alphas.push(Math.random());
      alphas.push(Math.random());

      alphaDeltas.push(Math.random());
      alphaDeltas.push(Math.random());

      // initialSizes.push({
      //   size: size1,
      //   duration: Math.random() * 20 + 2
      // });
      // initialSizes.push({
      //   size: size2,
      //   duration: Math.random() * 20 + 2
      // });
    }
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    const time = Date.now() * 0.005;
    const colors = geometry.attributes.color.array;
    const alphas = geometry.attributes.alpha.array;

    // console.log(colors);
    // var sizes = geometry.attributes.size.array;
    // var positions = geometry.attributes.position.array;

    for (let i = 0; i < PARTICLES; i++) {
      if (i < PARTICLES * 0.33) {
        colors[i * 3] = Math.abs(Math.sin(time / 5));
        colors[i * 3 + 1] = Math.abs(Math.sin(time / 7));
        colors[i * 3 + 2] = Math.abs(Math.sin(time / 11));
      } else if (i >= PARTICLES * 0.33 && i < PARTICLES * 0.66) {
        colors[i * 3] = Math.abs(Math.sin(inc / 7));
        colors[i * 3 + 1] = Math.abs(Math.sin(inc / 11));
        colors[i * 3 + 2] = Math.abs(Math.sin(inc / 5));
      } else {
        colors[i * 3] = Math.abs(Math.sin(inc / 3));
        colors[i * 3 + 1] = Math.abs(Math.sin(inc / 7));
        colors[i * 3 + 2] = Math.abs(Math.sin(inc / 2));
      }

      alphas[i] = Math.sin(alphaDeltas[i] * Math.random()) + 1.2;
    } //particleSystem.position.y = Math.sin(time * .1)
    //particleSystem.position.y = Math.sin(time/10)
    // controls.update()

    geometry.attributes.color.needsUpdate = true;
    geometry.attributes.alpha.needsUpdate = true;
    // geometry.attributes.position.needsUpdate = true;
    inc += 0.01;

    // var geometry = particles.geometry;
    // var attributes = geometry.attributes;
    //
    // raycaster.setFromCamera( mouse, camera );
    //
    // var intersects = raycaster.intersectObject( particles );
    //
    // if ( intersects.length > 0 ) {
    //
    //   if ( INTERSECTED != intersects[ 0 ].index ) {
    //
    //     // attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
    //
    //     INTERSECTED = intersects[ 0 ].index;
    //
    //     attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE * 2;
    //     attributes.size.needsUpdate = true;
    //
    //   }
    //
    // } else if ( INTERSECTED !== null ) {
    //
    //   attributes.size.array[ INTERSECTED ] = PARTICLE_SIZE;
    //   attributes.size.needsUpdate = true;
    //   INTERSECTED = null;
    //
    // }

    renderer.render(scene, camera);
  }

  function disperse(e) {
    const mouseX = parseInt(e.clientX);
    const mouseY = parseInt(e.clientY);
    particleSystem.material.uniforms.u_mouse.value.x = mouseX;
    particleSystem.material.uniforms.u_mouse.value.y = mouseY;
    const positions = geometry.attributes.position.array; // console.log('p => ',positions)

    for (let i = 0; i < positions.length; i += 3) {
      const xDistance = positions[i] - mouseX;
      const yDistance = positions[i + 1] - mouseY;
      const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);

      if (distance < 20) {
        const angle = Math.atan2(yDistance, xDistance);
        positions[i] += Math.cos(angle) * distance;
        positions[i + 1] += Math.sin(angle) * distance;
        positions[i + 2] += Math.sin(angle) * distance;
        positions[i] = positions[i] + 100 - positions[i];
        positions[i + 1] = positions[i + 1] + 100 - positions[i + 1];
      }
    }
  }

  function animateView(e) {
    // var rotY = 0;

    if (!zoomed) {
      xPos = e.clientX / (window.innerWidth * 0.5) - 1;
      yPos = e.clientY / (window.innerHeight * 0.5) - 1;

      //   if (xPos < 0) {
      //     $('#balasa').css('left', '20%');
      //     rotY = 20;
      //   } else {
      //     $('#balasa').css('left', '60%');
      //     rotY = -20;
      //   }
    }

    const tl = new TimelineMax();

    if (zoomed) {
      tl.to(
        camera.position,
        2.5,
        {
          z: 320,
          ease: Power3.easeInOut
        },
        0
      ).to(
        camera.rotation,
        2.5,
        {
          y: "+=" + xPos / 2,
          x: "+=" + yPos,
          ease: Power3.easeInOut
        },
        0
      );
      // .to($('#balasa'), 1.0, {
      //     autoAlpha: 0,
      //     y: '+=10',
      //     rotationY: rotY
      // }, .1);
    } else {
      console.log(xPos);

      tl.to(camera.position, 2.5, {
        z: 200,
        ease: Power3.easeInOut
      }).to(
        camera.rotation,
        2.5,
        {
          y: "-=" + xPos / 2,
          x: "-=" + yPos,
          ease: Power3.easeInOut
        },
        0.05
      );
      // .to($('#balasa'), 1.0, {
      //     autoAlpha: 1,
      //     y: '-=10',
      //     rotationY: rotY
      // }, '-=1.0');
    }

    zoomed = !zoomed;
  }

  window.addEventListener("mousemove", disperse);

  function mouseMoveEvent(e) {
    var mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    var mouseY = -(e.clientY / window.innerHeight) * 2 + 1;

    TweenMax.to(camera.rotation, 1, {
      y: -mouseX / 10,
      x: mouseY / 10,
      ease: Power2.easeOut
    });

    // TweenMax.to(camera.position, 1, {
    //   y: -mouseX * 20,
    //   x: mouseY * 20,
    //   ease: Power2.easeOut
    // });
  }

  // =========================================================================================

  // // USER ACTIONS
  var $fireflies = $(".js-ff");
  // var $firefliesSP = $(".js-ff-sp"); // Prevent default elements
  // var $firefliesArrow = $(".js-ff-arrow");
  // var $firefliesCardClose = $(".js-ff .js-card-quote-close");
  // var ffInitialView = true;

  // function initUserAction() {
  //   $firefliesSP.on("click", function(e) {
  //     e.stopPropagation();
  //   });

  $fireflies.on("click", function(e) {
    // if (ffInitialView) {
    //   hideTitle();
    //   showCards();
    //   ffInitialView = false;
    // } else {
    //   if ($(".js-ff-list").hasClass("hide")) {
    //     showCards();
    //   } else {
    //     hideCards();
    //   }
    // }

    animateView(e);
  });

  //   $firefliesCardClose.on("click", function(e) {
  //     hideCards();
  //     animateView(e);
  //   });

  //   $firefliesArrow.on("click", function(e) {
  //     e.preventDefault();

  //     $(".js-ff-item").stop();

  //     var $firefliesItemActive = $(".js-ff-item.active");
  //     if (!$firefliesItemActive.length) return false;

  //     var length = $(".js-ff-item").length;
  //     var currentIndex = $firefliesItemActive.index();
  //     var loadedIndex;
  //     $(this).hasClass("next")
  //       ? (loadedIndex = currentIndex + 1)
  //       : (loadedIndex = currentIndex - 1);
  //     if (loadedIndex < 0) loadedIndex = length - 1;
  //     if (loadedIndex > length - 1) loadedIndex = 0;

  //     $firefliesItemActive.animate(
  //       {
  //         opacity: 0
  //       },
  //       600,
  //       function() {
  //         $firefliesItemActive.removeClass("active");
  //         $(".js-ff-item")
  //           .eq(loadedIndex)
  //           .css("opacity", 0)
  //           .addClass("active")
  //           .animate(
  //             {
  //               opacity: 1
  //             },
  //             600
  //           );
  //       }
  //     );
  //   });

  //   // setCardsHeight();
  // }

  // function hideTitle() {
  //   if (!$(".js-ff-title").hasClass("hide")) {
  //     $(".js-ff-title").addClass("hide");
  //   }
  // }

  // function showCards() {
  //   $(".js-ff-list").removeClass("hide");
  // }

  // function hideCards() {
  //   $(".js-ff-list").addClass("hide");
  // }

  // LETS GO
  // initUserAction();
})(jQuery);

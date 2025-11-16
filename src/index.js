import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Ensure any styles are imported
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from "three/examples/jsm/libs/stats.module.js";
import gsap from "gsap";

function ThreeScene() {
  const [openDrawer, setOpenDrawer] = useState(null);
  const [drawerContent, setDrawerContent] = useState(null);
  const openDrawerRef = React.useRef(null);
  const cameraRef = React.useRef(null);
  const controlsRef = React.useRef(null);

  const handleCloseDrawer = () => {
    if (openDrawerRef.current && cameraRef.current && controlsRef.current) {
      const drawer = openDrawerRef.current;
      const camera = cameraRef.current;
      const controls = controlsRef.current;

      drawer.userData.isOpen = false;

      // Animate drawer sliding back
      gsap.to(drawer.position, {
        z: drawer.userData.originalZ,
        duration: 0.6,
        ease: "power2.in",
      });

      // Reset camera to default position
      gsap.to(camera.position, {
        x: 8,
        y: 8,
        z: 8,
        duration: 1,
        ease: "power2.inOut",
      });

      gsap.to(controls.target, {
        x: 0,
        y: 0,
        z: 0,
        duration: 1,
        ease: "power2.inOut",
        onUpdate: () => controls.update(),
      });

      setDrawerContent(null);
      setOpenDrawer(null);
      openDrawerRef.current = null;
    }
  };

  useEffect(() => {
    try {
      // Initialize stats
      const stats = new Stats();
      document.body.appendChild(stats.dom);

      // Set up the scene, camera, and renderer
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x663399);

      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      cameraRef.current = camera;

      // Enhanced renderer settings
      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
        alpha: true,
      });
      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      // Append renderer to the 'root' element
      const rootElement = document.getElementById("root");
      if (!rootElement) {
        throw new Error("Root element not found");
      }
      rootElement.appendChild(renderer.domElement);

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
      scene.add(ambientLight);

      // Add directional light
      const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
      dirLight.position.set(4, 4, 4);
      dirLight.castShadow = true;
      dirLight.shadow.mapSize.width = 1024;
      dirLight.shadow.mapSize.height = 1024;
      dirLight.shadow.camera.near = 0.5;
      dirLight.shadow.camera.far = 50;
      scene.add(dirLight);

      // Add a hemisphere light for better ambient lighting
      const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.5);
      hemiLight.position.set(0, 20, 0);
      scene.add(hemiLight);

      // Enhanced orbit controls
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.25;
      controls.enableZoom = true;
      controls.minDistance = 4;
      controls.maxDistance = 16;
      controls.maxPolarAngle = Math.PI / 2;
      controls.minAzimuthAngle = 0;
      controls.maxAzimuthAngle = Math.PI / 2;
      controlsRef.current = controls;

      // Create enhanced materials
      const woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x8b4513,
        roughness: 0.7,
        metalness: 0.1,
      });
      const mattressMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0,
      });

      const floorMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.9,
        metalness: 0,
      });

      const wallMaterial = new THREE.MeshStandardMaterial({
        color: 0x808080,
        roughness: 0.9,
        metalness: 0,
      });

      const drawerMaterial = new THREE.MeshStandardMaterial({
        color: 0xcd853f,
        roughness: 0.6,
        metalness: 0.1,
        emissive: 0x000000,
      });

      // Raycasting setup for interaction
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      let hoveredObject = null;
      const interactiveObjects = [];
      const drawers = [];

      // Portfolio content for each drawer
      const portfolioContent = {
        drawer1: {
          title: "Featured Projects",
          content: `
            <h3>My Best Work</h3>
            <ul>
              <li><strong>Project Alpha</strong> - A full-stack web application built with React and Node.js</li>
              <li><strong>3D Portfolio</strong> - This interactive Three.js experience you're viewing now!</li>
              <li><strong>ML Predictor</strong> - Machine learning model for data analysis</li>
            </ul>
          `,
        },
        drawer2: {
          title: "Technical Skills",
          content: `
            <h3>Technologies & Tools</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
              <div>
                <h4>Frontend</h4>
                <ul>
                  <li>React / JavaScript</li>
                  <li>Three.js / WebGL</li>
                  <li>HTML5 / CSS3</li>
                </ul>
              </div>
              <div>
                <h4>Backend</h4>
                <ul>
                  <li>Node.js / Python</li>
                  <li>REST APIs</li>
                  <li>Databases</li>
                </ul>
              </div>
            </div>
          `,
        },
        drawer3: {
          title: "Experience & Education",
          content: `
            <h3>Background</h3>
            <h4>Work Experience</h4>
            <ul>
              <li><strong>Software Engineer</strong> - Company Name (2022-Present)</li>
              <li><strong>Web Developer</strong> - Previous Company (2020-2022)</li>
            </ul>
            <h4>Education</h4>
            <ul>
              <li>BS in Computer Science</li>
              <li>Various certifications and courses</li>
            </ul>
          `,
        },
        drawer4: {
          title: "Interests & Hobbies",
          content: `
            <h3>Beyond Coding</h3>
            <ul>
              <li>🎮 Game Development & 3D Graphics</li>
              <li>🎨 Digital Art & Design</li>
              <li>📚 Reading Sci-Fi & Tech Books</li>
              <li>🏃 Fitness & Outdoor Activities</li>
            </ul>
            <p><em>I believe creativity and technical skills go hand in hand!</em></p>
          `,
        },
      };

      /**
       * Adds an outline to a given mesh.
       * @param {THREE.Mesh} mesh - The mesh to which the outline will be added.
       */
      function addOutline(mesh) {
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const outlineMaterial = new THREE.LineBasicMaterial({
          color: 0x000000,
        });
        const outline = new THREE.LineSegments(edges, outlineMaterial);
        outline.position.copy(mesh.position);
        outline.rotation.copy(mesh.rotation);
        outline.scale.copy(mesh.scale);
        scene.add(outline);
      }

      /**
       * Initializes the scene with objects and lights.
       */
      function initScene() {
        const bedFrame = createBedFrame();
        const mattress = createMattress();
        createTrundleDrawers(); // Create interactive drawers
        const floor = createFloor();
        const table = createTable();
        const wallLeft = createWallLeft();
        const wallRight = createWallRight();

        // Add outlines
        addOutline(bedFrame);
        addOutline(mattress);
        addOutline(floor);
        addOutline(table);
        addOutline(wallLeft);
        addOutline(wallRight);

        centerCamera();
      }

      /**
       * Creates the bed frame with legs and adds it to the scene.
       * @returns {THREE.Mesh} The bed frame mesh.
       */
      function createBedFrame() {
        const frameGeometry = new THREE.BoxGeometry(2, 0.25, 4);
        const bedFrame = new THREE.Mesh(frameGeometry, woodMaterial);
        bedFrame.position.set(0, 2, 0);
        bedFrame.castShadow = true;
        bedFrame.receiveShadow = true;
        scene.add(bedFrame);

        // Create bed legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2, 16);
        const legPositions = [
          [-0.95, 1, -1.95],
          [0.95, 1, -1.95],
          [-0.95, 1, 1.95],
          [0.95, 1, 1.95],
        ];
        legPositions.forEach((pos) => {
          const leg = new THREE.Mesh(legGeometry, woodMaterial);
          leg.position.set(...pos);
          leg.castShadow = true;
          leg.receiveShadow = true;
          scene.add(leg);
          addOutline(leg); // Add outline to each leg
        });

        return bedFrame;
      }

      /**
       * Creates the mattress and adds it to the scene.
       * @returns {THREE.Mesh} The mattress mesh.
       */
      function createMattress() {
        const mattressGeometry = new THREE.BoxGeometry(2, 0.25, 4);
        const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
        mattress.position.set(0, 2.25, 0);
        mattress.castShadow = true;
        mattress.receiveShadow = true;
        scene.add(mattress);
        return mattress;
      }

      /**
       * Creates a simple table with legs and adds it to the scene.
       * @returns {THREE.Mesh} The table mesh.
       */
      function createTable() {
        const tableGeometry = new THREE.BoxGeometry(2, 0.25, 2);
        const table = new THREE.Mesh(tableGeometry, woodMaterial);
        table.position.set(0, 1, 0); // Position it under the bed frame
        table.castShadow = true;
        table.receiveShadow = true;
        scene.add(table);

        // Create table legs
        const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);
        const legPositions = [
          [-0.95, 0.5, -0.95],
          [0.95, 0.5, -0.95],
          [-0.95, 0.5, 0.95],
          [0.95, 0.5, 0.95],
        ];
        legPositions.forEach((pos) => {
          const leg = new THREE.Mesh(legGeometry, woodMaterial);
          leg.position.set(...pos);
          leg.castShadow = true;
          leg.receiveShadow = true;
          scene.add(leg);
          addOutline(leg); // Add outline to each leg
        });

        return table;
      }

      /**
       * Creates interactive trundle drawers under the bunk bed.
       */
      function createTrundleDrawers() {
        const drawerWidth = 1.8;
        const drawerHeight = 0.35;
        const drawerDepth = 0.9;
        const drawerSpacing = 0.05;

        const drawerNames = ["drawer1", "drawer2", "drawer3", "drawer4"];
        const startY = 0.2;

        for (let i = 0; i < 4; i++) {
          const drawerGeometry = new THREE.BoxGeometry(
            drawerWidth,
            drawerHeight,
            drawerDepth
          );
          const drawer = new THREE.Mesh(drawerGeometry, drawerMaterial.clone());

          drawer.position.set(
            0,
            startY + i * (drawerHeight + drawerSpacing),
            -0.5
          );

          drawer.castShadow = true;
          drawer.receiveShadow = true;

          // Store drawer metadata
          drawer.userData = {
            isDrawer: true,
            drawerName: drawerNames[i],
            isOpen: false,
            originalZ: drawer.position.z,
          };

          scene.add(drawer);
          addOutline(drawer);

          // Add to interactive objects and drawers array
          interactiveObjects.push(drawer);
          drawers.push(drawer);

          // Add handle to drawer
          const handleGeometry = new THREE.BoxGeometry(0.3, 0.05, 0.05);
          const handleMaterial = new THREE.MeshStandardMaterial({
            color: 0x444444,
          });
          const handle = new THREE.Mesh(handleGeometry, handleMaterial);
          handle.position.set(0, 0, drawerDepth / 2 + 0.03);
          drawer.add(handle); // Attach handle as child of drawer
        }
      }

      /**
       * Creates the floor and adds it to the scene.
       * @returns {THREE.Mesh} The floor mesh.
       */
      function createFloor() {
        const floorGeometry = new THREE.PlaneGeometry(8, 8);

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.rotation.x = -Math.PI / 2; // Rotate to be horizontal
        floor.position.y = 0; // Position it at the bottom
        floor.receiveShadow = true;
        scene.add(floor);
        return floor;
      }

      /**
       * Creates the left wall and adds it to the scene.
       * @returns {THREE.Mesh} The left wall mesh.
       */
      function createWallLeft() {
        const wallGeometry = new THREE.PlaneGeometry(8, 8);
        const wallLeft = new THREE.Mesh(wallGeometry, wallMaterial);
        wallLeft.rotation.y = Math.PI / 2; // Rotate to be perpendicular
        wallLeft.position.set(-4, 4, 0); // Positioned to the left
        wallLeft.receiveShadow = true;
        scene.add(wallLeft);

        return wallLeft;
      }

      /**
       * Creates the right wall and adds it to the scene.
       * @returns {THREE.Mesh} The right wall mesh.
       */
      function createWallRight() {
        const wallGeometry = new THREE.PlaneGeometry(8, 8);
        const wallRight = new THREE.Mesh(wallGeometry, wallMaterial);
        wallRight.position.set(0, 4, -4);
        wallRight.receiveShadow = true;
        scene.add(wallRight);

        return wallRight;
      }

      /**
       * Centers the camera initially.
       */
      function centerCamera() {
        camera.position.set(8, 8, 8); // Initial camera position
        controls.target.set(0, 0, 0);
        controls.update();
      }

      /**
       * Handles mouse movement for raycasting and hover effects.
       */
      function onMouseMove(event) {
        // Convert mouse position to normalized device coordinates (-1 to +1)
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update raycaster with camera and mouse position
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections
        const intersects = raycaster.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
          const intersectedObject = intersects[0].object;

          // If hovering over a new object
          if (hoveredObject !== intersectedObject) {
            // Reset previous hovered object
            if (hoveredObject) {
              hoveredObject.material.emissive.setHex(0x000000);
            }

            // Set new hovered object
            hoveredObject = intersectedObject;
            hoveredObject.material.emissive.setHex(0x333333);
            document.body.style.cursor = "pointer";
          }
        } else {
          // No intersection, reset hover state
          if (hoveredObject) {
            hoveredObject.material.emissive.setHex(0x000000);
            hoveredObject = null;
          }
          document.body.style.cursor = "default";
        }
      }

      /**
       * Handles click events on drawers.
       */
      function onClick(event) {
        // Update mouse position
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // Update raycaster
        raycaster.setFromCamera(mouse, camera);

        // Check for intersections
        const intersects = raycaster.intersectObjects(interactiveObjects);

        if (intersects.length > 0) {
          const clickedObject = intersects[0].object;

          if (clickedObject.userData.isDrawer) {
            toggleDrawer(clickedObject);
          }
        }
      }

      /**
       * Toggles a drawer open or closed.
       */
      function toggleDrawer(drawer) {
        const isOpen = drawer.userData.isOpen;

        if (isOpen) {
          // Close this drawer
          closeDrawer(drawer);
        } else {
          // Close all other drawers first
          drawers.forEach((d) => {
            if (d.userData.isOpen && d !== drawer) {
              closeDrawer(d);
            }
          });

          // Open this drawer
          openDrawer(drawer);
        }
      }

      /**
       * Opens a drawer with animation.
       */
      function openDrawer(drawer) {
        drawer.userData.isOpen = true;
        openDrawerRef.current = drawer;

        // Animate drawer sliding forward
        gsap.to(drawer.position, {
          z: drawer.userData.originalZ + 1.5,
          duration: 0.8,
          ease: "power2.out",
        });

        // Animate camera to focus on drawer
        const targetPos = drawer.position.clone();
        gsap.to(camera.position, {
          x: targetPos.x + 4,
          y: targetPos.y + 2,
          z: targetPos.z + 4,
          duration: 1,
          ease: "power2.inOut",
        });

        gsap.to(controls.target, {
          x: targetPos.x,
          y: targetPos.y,
          z: targetPos.z,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: () => controls.update(),
        });

        // Show content overlay
        const content = portfolioContent[drawer.userData.drawerName];
        setDrawerContent(content);
        setOpenDrawer(drawer.userData.drawerName);
      }

      /**
       * Closes a drawer with animation.
       */
      function closeDrawer(drawer) {
        drawer.userData.isOpen = false;

        // Animate drawer sliding back
        gsap.to(drawer.position, {
          z: drawer.userData.originalZ,
          duration: 0.6,
          ease: "power2.in",
        });

        // Reset camera to default position
        gsap.to(camera.position, {
          x: 8,
          y: 8,
          z: 8,
          duration: 1,
          ease: "power2.inOut",
        });

        gsap.to(controls.target, {
          x: 0,
          y: 0,
          z: 0,
          duration: 1,
          ease: "power2.inOut",
          onUpdate: () => controls.update(),
        });

        // Hide content overlay
        setDrawerContent(null);
        setOpenDrawer(null);
      }

      /**
       * Handles window resize events to adjust camera and renderer.
       */
      function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }

      window.addEventListener("resize", onWindowResize);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("click", onClick);

      // Display angles in radians
      const angleDisplay = document.createElement("div");
      angleDisplay.style.position = "absolute";
      angleDisplay.style.bottom = "10px";
      angleDisplay.style.left = "10px";
      angleDisplay.style.color = "white";
      angleDisplay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
      angleDisplay.style.padding = "5px";
      angleDisplay.style.fontFamily = "monospace";
      angleDisplay.style.fontSize = "12px";
      document.body.appendChild(angleDisplay);

      /**
       * Updates the angle display with the current azimuth and polar angles.
       */
      function updateAngleDisplay() {
        const azimuthAngleRad = controls.getAzimuthalAngle();
        const polarAngleRad = controls.getPolarAngle();
        const azimuthAngleDeg = THREE.MathUtils.radToDeg(azimuthAngleRad);
        const polarAngleDeg = THREE.MathUtils.radToDeg(polarAngleRad);

        angleDisplay.innerHTML = `Azimuth Angle: ${azimuthAngleRad.toFixed(
          2
        )} rad (${azimuthAngleDeg.toFixed(
          2
        )}°)<br>Polar Angle: ${polarAngleRad.toFixed(
          2
        )} rad (${polarAngleDeg.toFixed(2)}°)`;
      }

      /**
       * Animates the scene, updating controls, stats, and rendering.
       */
      function animate() {
        requestAnimationFrame(animate);
        controls.update();
        stats.update();
        renderer.render(scene, camera);
        updateAngleDisplay();
      }

      // Initialize and start animation
      initScene();
      animate();

      // Cleanup function
      return () => {
        window.removeEventListener("resize", onWindowResize);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("click", onClick);
      };
    } catch (error) {
      console.error("Error initializing scene:", error);
      // Display error on page
      document.body.innerHTML = `<div style="color: white; padding: 20px;">
        Error initializing scene: ${error.message}
      </div>`;
    }
  }, []);

  return (
    <>
      {drawerContent && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            background: "rgba(255, 255, 255, 0.98)",
            padding: "2rem",
            borderRadius: "15px",
            maxWidth: "600px",
            maxHeight: "80vh",
            overflow: "auto",
            zIndex: 1000,
            boxShadow: "0 10px 50px rgba(0, 0, 0, 0.3)",
            fontFamily: "Arial, sans-serif",
            color: "#333",
          }}
        >
          <button
            onClick={handleCloseDrawer}
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "#663399",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "30px",
              height: "30px",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            ×
          </button>
          <h2 style={{ marginTop: 0, color: "#663399" }}>
            {drawerContent.title}
          </h2>
          <div dangerouslySetInnerHTML={{ __html: drawerContent.content }} />
        </div>
      )}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<ThreeScene />);

import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { isPowerOfTwo } from 'three/src/math/MathUtils';



const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
      //set renderer size to half of page size
      renderer.setSize( window.innerWidth/2, window.innerHeight/2 );
      document.body.appendChild( renderer.domElement );

      //add ambient light
      const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
      scene.add( ambientLight );

      //add directional light
      const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      scene.add( directionalLight );

      //import gltf model from /assets
      const loader = new GLTFLoader();
      loader.load( '/assets/gltf/donut.glb', function ( gltf ) {
        gltf.scene.scale.set(25,25,25);
        gltf.scene.position.set(0,0,0);
        scene.add( gltf.scene );
      }, undefined, function ( error ) {
        console.error( error );
      } );

      //add color picker to change background color
      const colorIndicator = document.getElementById('color-picker');
      const colorPicker = new iro.ColorPicker("#color-picker", {
        width: 200,
        color: "#f00",
      });

      colorPicker.on('color:change', function(color) {
        //select donut glaze
        const donut = scene.getObjectByName('donut');
        donut.material.color.set(color.hexString);

      });
      camera.position.z = 5;

      //add orbit controls
      const controls = new OrbitControls( camera, renderer.domElement );
      controls.enableDamping = true;
      controls.update();

			function animate() {
				requestAnimationFrame( animate );

				renderer.render( scene, camera );
			};

      const apiURL = 'https://donutello-backend.onrender.com/api/v1/donuts';

      //save donut gltb model to backend
      const saveButton = document.getElementById('button');
      saveButton.addEventListener('click', function() {
        const donut = scene.getObjectByName('donut');
        //get color from color picker
        const color = colorPicker.color.hexString;
        //get screenshot of donut
        console.log(renderer.domElement);
        const screenshot = renderer.domElement.toDataURL("image/webp");
        console.log(screenshot);
        //send data to backend
        const data = {
          dough: color,
          image: screenshot,
        };
        fetch(apiURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
      });

			animate();
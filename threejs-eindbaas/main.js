import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { isPowerOfTwo } from 'three/src/math/MathUtils';



const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer({preserveDrawingBuffer: true});
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
        //add function to button randomize
        document.getElementById("random").addEventListener("click", function(){
          gltf.scene.traverse( function ( child ) {
            if ( child.isMesh ) {
              child.material.color.setHex( Math.random() * 0xffffff );
            }
          } );
        } );

        //add logo plane on donut model
        const planeGeometry = new THREE.PlaneGeometry( 1, 1, 32 );
        const planeMaterial = new THREE.MeshBasicMaterial( {color: 0xffff00, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( planeGeometry, planeMaterial );
        plane.position.set(1,1.76,0);
        scene.add( plane );
        //rotate plane to make it look like it is on the donut
        plane.rotation.x = Math.PI / 2;
        plane.rotation.z = math.PI / 2;

        //save uploaded image to plane texture
        const input = document.getElementById('myFile');
        input.addEventListener('change', function(e){
          const reader = new FileReader();
          reader.onload = function(){
            const texture = new THREE.TextureLoader().load(reader.result);
            plane.material.map = texture;
            plane.material.needsUpdate = true;
          }
          reader.readAsDataURL(input.files[0]);
        });



      }, undefined, function ( error ) {
        console.error( error );
      } );
      

      //increase canvas size when window is resized
      window.addEventListener('resize', () => {
        renderer.setSize(window.innerWidth/2, window.innerHeight/2);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
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
        //save input as name
        const name = document.getElementById('name').value;
        console.log(name);
        //send data to backend
        const data = {
          name: name,
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
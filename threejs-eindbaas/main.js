import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'



const scene = new THREE.Scene();
			const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

			const renderer = new THREE.WebGLRenderer();
      //set renderer size to half of page size
      renderer.setSize( window.innerWidth/2, window.innerHeight/2 );

      //add ambient light
      const ambientLight = new THREE.AmbientLight( 0xffffff, 0.5 );
      scene.add( ambientLight );

      //add directional light
      const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
      scene.add( directionalLight );

      //add orbit controls
      const controls = new OrbitControls( camera, renderer.domElement );
      controls.enableDamping = true;

      //import gltf model from /assets
      const loader = new GLTFLoader();
      loader.load( '/assets/gltf/donut.glb', function ( gltf ) {
        gltf.scene.scale.set(25,25,25);
        gltf.scene.position.set(0,0,0);
        scene.add( gltf.scene );
      }, undefined, function ( error ) {
        console.error( error );
      } );

      
			document.body.appendChild( renderer.domElement );


			
			camera.position.z = 5;

			function animate() {
				requestAnimationFrame( animate );

	

				renderer.render( scene, camera );
			};

			animate();
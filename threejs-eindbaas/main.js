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

        });

        //create an array with rgb values for each dropdown option
        const colors = [
          //vanilla
          [249,229,188],
          //chocolate
          [123,63,0],
          //strawberry
          [252,90,141],
        ];

        document.getElementById("flavor").addEventListener("change", function(e){
          //get the value of the dropdown menu
          const flavorColor = e.target.value;
          //select glaze from model
          const glaze = gltf.scene.getObjectByName("glaze");
          //if dropdown is chocolate, set color to chocolate
          if(flavorColor == "chocolate"){
            //set glaze rgb value to colors array chocolate
            glaze.material.color.setRGB(colors[1][0]/255,colors[1][1]/255,colors[1][2]/255);
          }
          //if dropdown is vanilla, set color to vanilla
          if(flavorColor == "vanilla"){
            //set glaze rgb value to colors array vanilla
            glaze.material.color.setRGB(colors[0][0]/255,colors[0][1]/255,colors[0][2]/255);
          }
          //if dropdown is strawberry, set color to strawberry
          if(flavorColor == "strawberry"){
            //set glaze rgb value to colors array strawberry
            glaze.material.color.setRGB(colors[2][0]/255,colors[2][1]/255,colors[2][2]/255);
          }
            
        });

        
        //change topping color according to sprinkles dropdown
        document.getElementById("sprinkles").addEventListener("change", function(e){
          //get the value of the dropdown menu
          const sprinklesColor = e.target.value;
          //select glaze from model
          const sprinkles = gltf.scene.getObjectByName("topping");
          //if dropdown is chocolate, set color to chocolate
          if(sprinklesColor == "chocolate"){
            //set glaze rgb value to colors array chocolate
            sprinkles.material.color.setRGB(colors[1][0]/255,colors[1][1]/255,colors[1][2]/255);
          }
          //if dropdown is rainbow, set color to rainbow
          if(sprinklesColor == "sugar"){
            //set glaze rgb to white color
            sprinkles.material.color.setRGB(1,1,1);

          }
          //if dropdown is crystal, set color to crystal
          if(sprinklesColor == "crystal"){
            //set glaze rgb to very light blue color
            sprinkles.material.color.setRGB(0.9,0.9,1);  
          }
        });

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
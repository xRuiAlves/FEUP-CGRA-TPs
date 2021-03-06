/**
 * MyCrane
 * @constructor
 */
class MyCrane extends CGFobject
{
	constructor(scene)
	{
		super(scene);

		// Components
		this.circle = new MyCircle(scene, 20);
		this.cylinder = new MyCylinder(scene, 20, 20);
		this.quad = new MyUnitCubeQuad(scene);
		this.vehicle = null;

		// Materials
		this.magnetMaterial = new CGFappearance(this.scene);
		this.magnetMaterial.loadTexture("./resources/images/metal.jpg");
		
		this.ropeMaterial = new CGFappearance(this.scene);
		this.ropeMaterial.setTextureWrap('CLAMP_TO_EDGE','CLAMP_TO_EDGE');
    	this.ropeMaterial.loadTexture("./resources/images/rope.jpg");

		this.armMaterial = new CGFappearance(this.scene);
    	this.armMaterial.loadTexture("./resources/images/wood.jpg");

		this.baseAndJointMaterial = new CGFappearance(this.scene);
    	this.baseAndJointMaterial.loadTexture("./resources/images/dashedMetal.jpg");
		
		//Missing magnet material and rope material
		//What is rotating base supposed to use

		// Propreties
		this.baseSize = 0.32;
		this.baseDiameter = 1.4;
		this.articulationSize = 0.7;
		this.baseArmSize = 0.4;
		this.baseArmLength = 8.5;
		this.catchArmSize = this.baseArmSize;
		this.catchArmLength = 7;
		this.ropeLength = 1.1;
		this.ropeRadius = 0.02;
		this.magnetHeight = 0.25;
		this.magnetDiameter = 1.2;
		this.rotatingBaseSize = this.baseSize/1.5;
		this.rotatingBaseDiameter = 1;
		this.x = 0;
		this.z = 0;

		// Animation defines
		this.catchArmSpeed = 20E-5;
		this.craneSpeed = 25E-5;
		this.initialCatchArmAngle = Math.PI/2;
		this.initialCraneAngle = 0;
		this.catchCatchArmAngle = Math.PI/4.37;
		this.dropZoneCraneAngle = Math.PI;

		// Crane Angles
		this.baseArmAngle = Math.PI/12;
		this.catchArmAngle = this.initialCatchArmAngle;
		this.craneAngle = this.initialCraneAngle;

		// Animation
		this.animationState = 'notMoving';
		this.catchPositionX = 6.2;
		this.catchPositionZ = 13.5;
		this.craneHeight = this.baseArmLength*Math.cos(this.baseArmAngle);
		this.craneLengthWhenTurning = this.baseArmLength*Math.sin(this.baseArmAngle) + this.catchArmLength*Math.sin(this.initialCatchArmAngle);
		this.vehicleDropSpeed = 1E-2;

		this.vehicleDropY = 0;

		this.initBuffers();
	};

	setPosition(x, z) {
		this.x = x;
		this.z = z;
	}

	setVehicle(vehicle) {
		this.vehicle = vehicle;
	}

	setCraneAngle(angle) {
		this.craneAngle = angle;
	}

	setBaseArmAngle(angle) {
		this.baseArmAngle = angle;
	}

	setCatchArmAngle(angle) {
		this.catchArmAngle = angle;
	}

	startAnimation() {
		if (this.animationState === 'notMoving') {
			this.animationState = 'catchVehicle';
		}
	}

	animate(deltaTime) {
		switch(this.animationState) {
		case 'catchVehicle':
			this.animateCatchingVehicle(deltaTime);
			break;
		case 'pullUpVehicle':
			this.animatePullUpVehicle(deltaTime);
			break;
		case 'turnToDropZone':
			this.animateTurnToDropZone(deltaTime);
			break;
		case 'dropVehicle':
			this.animateDropVehicle(deltaTime);
			break;
		case 'returnStartingPos':
			this.animateReturnStarting(deltaTime);
			break;
		}
	}

	animateCatchingVehicle(deltaTime) {
		if (this.catchArmAngle > this.catchCatchArmAngle) {
			this.catchArmAngle += (this.catchCatchArmAngle-this.initialCatchArmAngle)*this.catchArmSpeed*deltaTime;
		} else {
			// Catch the Vehicle
			this.catchArmAngle = this.catchCatchArmAngle;
			this.vehicle.z = this.catchPositionZ;
			this.animationState = 'pullUpVehicle';
		}
	}

	animatePullUpVehicle(deltaTime) {
		if (this.catchArmAngle < this.initialCatchArmAngle) {
			this.catchArmAngle += (this.initialCatchArmAngle-this.catchCatchArmAngle)*this.catchArmSpeed*deltaTime;
			this.vehicle.x = this.x - this.baseArmLength*Math.sin(this.baseArmAngle) - this.catchArmLength*Math.sin(this.catchArmAngle);
			this.vehicle.y = this.craneHeight - this.catchArmLength*Math.cos(this.catchArmAngle) - this.ropeLength + this.baseSize/2 - this.vehicle.vehicleHeight;
		} else {
			this.catchArmAngle = this.initialCatchArmAngle;
			this.animationState = 'turnToDropZone';
		}
	}
	
	animateTurnToDropZone(deltaTime) {
		if (this.craneAngle < this.dropZoneCraneAngle) {
			this.craneAngle += (this.dropZoneCraneAngle-this.initialCraneAngle)*this.craneSpeed*deltaTime;	
			this.vehicle.x = this.x + this.craneLengthWhenTurning * Math.cos(Math.PI - this.craneAngle);
			this.vehicle.z = this.z + this.craneLengthWhenTurning * Math.sin(Math.PI -this.craneAngle);
			this.vehicle.direction_angle += this.craneSpeed*Math.PI*deltaTime;
		} else {
			this.craneAngle = this.dropZoneCraneAngle;
			this.animationState = 'dropVehicle';
		}
	}

	animateDropVehicle(deltaTime) {
		if (this.vehicle.y > this.vehicleDropY) {
			this.vehicle.y -= this.vehicleDropSpeed * deltaTime;
		} else {
			this.vehicle.y = this.vehicleDropY;
			this.vehicleDropY += this.vehicle.vehicleHeight;
			//To notify the scene that the car can move again
			this.scene.finishedCraneAnimation();
			this.animationState = 'returnStartingPos'
		}
	}

	animateReturnStarting(deltaTime) {
		if (this.craneAngle > this.initialCraneAngle) {
			this.craneAngle += (this.initialCraneAngle-this.dropZoneCraneAngle)*this.craneSpeed*deltaTime;
		} else {
			this.craneAngle = this.initialCraneAngle;
			this.animationState = 'notMoving';
		}
	}

	display()
	{
		this.scene.translate(this.x, 0, this.z);

		// Base
		this.baseAndJointMaterial.apply();
		this.scene.pushMatrix();
			this.scene.scale(this.baseDiameter, this.baseSize, this.baseDiameter);
			this.scene.rotate(-Math.PI/2, 1, 0 ,0);
			this.cylinder.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.scale(this.baseDiameter, this.baseDiameter, this.baseDiameter);
			this.scene.rotate(Math.PI/2, 1, 0 ,0);
			this.circle.display();
		this.scene.popMatrix();
		this.scene.pushMatrix();
			this.scene.translate(0, this.baseSize, 0);
			this.scene.scale(this.baseDiameter, this.baseDiameter, this.baseDiameter);
			this.scene.rotate(-Math.PI/2, 1, 0 ,0);
			this.circle.display();
		this.scene.popMatrix();

		this.scene.rotate(this.craneAngle, 0, 1, 0);

		// Rotating Base
		this.baseAndJointMaterial.apply();
		this.scene.pushMatrix();
			this.scene.translate(0, this.baseSize, 0);
			this.scene.pushMatrix();
				this.scene.scale(this.rotatingBaseDiameter, this.rotatingBaseSize, this.rotatingBaseDiameter);
				this.scene.rotate(-Math.PI/2, 1, 0 ,0);
				this.cylinder.display();
			this.scene.popMatrix();	
			this.scene.pushMatrix();
				this.scene.translate(0, this.baseSize/2, 0);
				this.scene.scale(this.rotatingBaseDiameter, this.rotatingBaseDiameter, this.rotatingBaseDiameter);
				this.scene.rotate(-Math.PI/2, 1, 0 ,0);
				this.circle.display();
			this.scene.popMatrix();	
		this.scene.popMatrix();			

		// Base Arm
		this.armMaterial.apply();
		this.scene.pushMatrix();
			this.scene.translate(0, this.baseSize/2, 0);
			this.scene.rotate(this.baseArmAngle, 1, 0, 0);
			this.scene.translate(0, this.baseArmLength/2, 0);
			this.scene.scale(this.baseArmSize, this.baseArmLength, this.baseArmSize);
			this.quad.display();
		this.scene.popMatrix();

		// Articulation
		this.baseAndJointMaterial.apply();
		this.scene.pushMatrix();
			this.scene.translate(this.articulationSize/2, this.baseSize/2 + this.baseArmLength*Math.cos(this.baseArmAngle), this.baseArmLength*Math.sin(this.baseArmAngle));
			this.scene.pushMatrix();
				this.scene.scale(this.articulationSize, this.articulationSize, this.articulationSize);
				this.scene.rotate(-Math.PI/2, 0, 1 ,0);
				this.cylinder.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
				this.scene.scale(this.articulationSize, this.articulationSize, this.articulationSize);
				this.scene.rotate(Math.PI/2, 0, 1 ,0);
				this.circle.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
				this.scene.translate(-this.articulationSize, 0, 0);
				this.scene.scale(this.articulationSize, this.articulationSize, this.articulationSize);
				this.scene.rotate(-Math.PI/2, 0, 1 ,0);
				this.circle.display();
			this.scene.popMatrix();
		this.scene.popMatrix();

		// Catch Arm
		this.armMaterial.apply();
		this.scene.pushMatrix();
			this.scene.translate(0, this.baseSize/2 + this.baseArmLength*Math.cos(this.baseArmAngle), this.baseArmLength*Math.sin(this.baseArmAngle));
			this.scene.rotate(-this.catchArmAngle, 1, 0, 0);
			this.scene.translate(0, -this.catchArmLength/2, 0);
			this.scene.scale(this.catchArmSize, this.catchArmLength, this.catchArmSize);
			this.quad.display();
		this.scene.popMatrix();

		// Rope
		this.ropeMaterial.apply();
		this.scene.pushMatrix();
			this.scene.translate(0, 
								 this.baseArmLength*Math.cos(this.baseArmAngle) - this.catchArmLength*Math.cos(this.catchArmAngle) - this.ropeLength + this.baseSize/1.5,
								 this.baseArmLength*Math.sin(this.baseArmAngle) + this.catchArmLength*Math.sin(this.catchArmAngle));

			this.scene.pushMatrix();
				this.scene.scale(this.ropeRadius, this.ropeLength, this.ropeRadius);
				this.scene.rotate(-Math.PI/2, 1, 0 ,0);
				this.cylinder.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
				this.scene.scale(this.ropeRadius, this.ropeRadius, this.ropeRadius);
				this.scene.rotate(Math.PI/2, 1, 0 ,0);
				this.circle.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
				this.scene.translate(0, this.ropeLength, 0);
				this.scene.scale(this.ropeRadius, this.ropeRadius, this.ropeRadius);
				this.scene.rotate(-Math.PI/2, 1, 0 ,0);
				this.circle.display();
			this.scene.popMatrix();
		this.scene.popMatrix();

		// Magnet
		this.magnetMaterial.apply();
		this.scene.pushMatrix();
			this.scene.translate(0, 
								 this.baseArmLength*Math.cos(this.baseArmAngle) - this.catchArmLength*Math.cos(this.catchArmAngle) + this.baseSize/2 - this.ropeLength,
								 this.baseArmLength*Math.sin(this.baseArmAngle) + this.catchArmLength*Math.sin(this.catchArmAngle));

			this.scene.pushMatrix();
				this.scene.scale(this.magnetDiameter, this.magnetHeight, this.magnetDiameter);
				this.scene.rotate(-Math.PI/2, 1, 0 ,0);
				this.cylinder.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
				this.scene.scale(this.magnetDiameter, this.magnetDiameter, this.magnetDiameter);
				this.scene.rotate(Math.PI/2, 1, 0 ,0);
				this.circle.display();
			this.scene.popMatrix();
			this.scene.pushMatrix();
				this.scene.translate(0, this.magnetHeight, 0);
				this.scene.scale(this.magnetDiameter, this.magnetDiameter, this.magnetDiameter);
				this.scene.rotate(-Math.PI/2, 1, 0 ,0);
				this.circle.display();
			this.scene.popMatrix();
		this.scene.popMatrix();
	};
};

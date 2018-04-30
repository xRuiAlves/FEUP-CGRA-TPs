/**
 * MyVehicle
 * @constructor
 */
class MyVehicle extends CGFobject
{
	constructor(scene)
	{
        super(scene);

        this.wheel = new MyWheel(scene, 20);
    };

    update(currTime) {
        this.wheel.setAngle(currTime/1000 * 360/60);
    }

    display() {

		// Tire #1
        this.scene.pushMatrix();
            this.scene.translate(0, 1, 0);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
			this.wheel.display();
        this.scene.popMatrix();

        // Tire #2
        this.scene.pushMatrix();
            this.scene.translate(4, 1, 0);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
			this.wheel.display();
        this.scene.popMatrix();

        // Tire #3
        this.scene.pushMatrix();
            this.scene.translate(0, 1, 6);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
			this.wheel.display();
        this.scene.popMatrix();

        // Tire #4
        this.scene.pushMatrix();
            this.scene.translate(4, 1, 6);
            this.scene.rotate(Math.PI/2, 0, 1, 0);
			this.wheel.display();
        this.scene.popMatrix();

    };
};

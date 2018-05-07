/**
 * MyVehicleHeadLight
 * @constructor
 */
class MyVehicleHeadLight extends CGFobject
{
	constructor(scene, sides)
	{
        super(scene);

		this.body = new MySemiSphere(this.scene, sides, sides);

        this.brandAppearance = new CGFappearance(this.scene);
        this.brandAppearance.loadTexture("./resources/images/headLight.jpg");
    };

    display() {
		this.brandAppearance.apply();

		// Rim #1
        this.scene.pushMatrix();
			this.scene.scale(0.10, 0.08, 0.03);
			this.body.display();
        this.scene.popMatrix();
    };
};
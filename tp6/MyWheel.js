/**
 * MyWheel
 * @constructor
 */
class MyWheel extends CGFobject
{
	constructor(scene, sides)
	{
        super(scene);

        this.body = new MyCylinder(this.scene, sides, 1);
        this.cover = new MyCircle(this.scene, sides);
		this.rim = new MySemiSphere(this.scene, sides, sides);

		this.rimSize = 0.7;

		// Tire material
        this.tireAppearance = new CGFappearance(this.scene);
        this.tireAppearance.loadTexture("./resources/images/tire.jpg");

        this.metalAppearance = new CGFappearance(this.scene);
        this.metalAppearance.loadTexture("./resources/images/metal2.jpeg");

        this.tireSideAppearance = new CGFappearance(this.scene);
        this.tireSideAppearance.loadTexture("./resources/images/tireSide.jpg");
    };

    setAngle(angle) {
        this.angle = -angle * this.ang_to_rad;
    }

    display() {

		// Rim #1
        this.scene.pushMatrix();
			this.scene.translate(0, 1, 1);
			this.scene.scale(this.rimSize, this.rimSize, 0.1);

			this.metalAppearance.apply();
            this.rim.display();
        this.scene.popMatrix();

		// Rim #2
        this.scene.pushMatrix();
			this.scene.translate(0, 1, 0);
			this.scene.scale(this.rimSize, this.rimSize, 0.1);
			this.scene.rotate(Math.PI, 0, 1, 0);

			this.metalAppearance.apply();
            this.rim.display();
        this.scene.popMatrix();

		// Tire Cover #1
        this.scene.pushMatrix();
			this.scene.translate(0, 1, 1);

			this.tireSideAppearance.apply();
            this.cover.display();
        this.scene.popMatrix();

		// Tire Cover #2
        this.scene.pushMatrix();
			this.scene.translate(0, 1, 0);
			this.scene.rotate(Math.PI, 0, 0, 1);
			this.scene.scale(1, -1, 1);

			this.tireSideAppearance.apply();
            this.cover.display();
        this.scene.popMatrix();

		// Tire Body
        this.scene.pushMatrix();
			this.scene.translate(0, 1, 0);

		    this.tireAppearance.apply();
            this.body.display();
        this.scene.popMatrix();
    };
};
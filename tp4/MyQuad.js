/**
 * MyQuad
 * @constructor
 */
class MyQuad extends CGFobject
{
	constructor(scene, minS, maxS, minT, maxT)
	{
		super(scene);

		this.minS = typeof minS !== 'undefined' ? minS : 0;
		this.maxS = typeof maxS !== 'undefined' ? maxS : 1;
		this.minT = typeof minT !== 'undefined' ? minT : 0;
		this.maxT = typeof maxT !== 'undefined' ? maxT : 1;

		this.initBuffers();
	};

	initBuffers()
	{
		this.vertices = [
		-0.5, -0.5, 0,
		0.5, -0.5, 0,
		-0.5, 0.5, 0,
		0.5, 0.5, 0
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
			0, 0, 1
		]

		this.indices = [
		0, 1, 2,
		3, 2, 1
		];

		this.texCoords = [
		this.minS, this.maxT,
		this.maxS, this.maxT,
		this.minS, this.minT,
		this.maxS, this.minT
		];

		this.primitiveType = this.scene.gl.TRIANGLES;
		this.initGLBuffers();
	};
};

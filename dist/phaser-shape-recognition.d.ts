import { Scene } from 'phaser';
interface Point {
    x: number;
    y: number;
}
interface Result {
    hitsRatio: number;
    hits: number;
    fails: number;
}
/**
 * This class provides some utilities for shape and stroke recognition.
 */
export default class ShapeRec {
    private scene;
    constructor(scene: Scene);
    private generatePoints;
    /**
     * Test the proportion of coincidence between two 2d arrays of booleans with the same size.
     * Only that cells on which at least one value is "true" are evaluated.
     * @param {boolean[][]} matrix1 First matrix to compare
     * @param matrix2 Second matrix to compare
     * @param { boolean[][] } checkNeighbors Fail is not added if there are some neighbor cell with "true"
     * @returns { Result } Object {hitsRatio, hits, fails}
     */
    test(matrix1: boolean[][], matrix2: boolean[][], checkNeighbors: boolean): Result | null;
    /**
     * Generates the bounds object with this properties (used in normalization process):
     * * minX : left bound in pixels
     * * minY: top bound in pixels
     * * maxX: right bound in pixels
     * * maxY: bottom bound in pixels
     * * width
     * * height
     * @param { Point[] } points Array of points (point -> { x, y})
     * @returns { Bounds } Bounds of the points group
     */
    private getBounds;
    /**
     * Transforms an array of raw points or an image into a normalized array of booleans
     * @param { string | Point[]} source Can be the string key of a texture or an array of points (Ex: [{x: 2, y:2}, {x:3, y:5}, ...])
     * @param { (string | number) } frame  String or index of the texture frame. Not used if source is an array.
     * @param { number } [resolution = 10] Size of the matrix (default 10x10). High values reduce false positives and increase false negatives in stroke recognition. With low values the opposite occurs.
     * @returns { boolean[][] } Matrix of booleans. Each cell of the matrix represents one sector of the image. If in that sector exists some positive alpha then its value will be "true"
     */
    makeMatrix(source: string | Point[], frame?: string | number, resolution?: number): boolean[][];
}
export {};

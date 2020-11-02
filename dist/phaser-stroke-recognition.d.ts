import { Scene } from 'phaser';
interface Point {
    x: number;
    y: number;
}
interface Stroke {
    name: string;
    matrix: boolean[][];
    resolution: number;
}
interface Result {
    hitsRatio: number;
    hits: number;
    fails: number;
    sampleMatrix: boolean[][];
    modelMatrix: boolean[][];
}
export default class StrokeRec {
    private scene;
    strokes: Map<string, Stroke>;
    constructor(scene: Scene);
    /**
     * Generates a "normalized" array of 10x10 from an image.
     * This image must be a black stroke over a transparent background.
     * @param {string} name Unique name for this stroke
     * @param {string} key The string key of the texture
     * @param {(string | number)} [frame] String or index of the texture frame
     * @param {number} [resolution = 10] Size of the matrix (default 10x10). High values reduce false positives and increase false negatives in stroke recognition. With low values the opposite occurs.
     */
    add(name: string, key: string, frame?: string | number, resolution?: number): void;
    /**
     *
     * @param {Point[]} samplePoints Array of points ({x,y}) of the stroke to compare
     * @param {string} strokeName Name of the model stroke
     * @returns {Result} Object width results data
     */
    checkStroke(samplePoints: Point[], strokeName: string): Result | null;
    /**
     * Generates the bounds object with this properties (used in normalization process):
     * * minX : left bound in pixels
     * * minY: top bound in pixels
     * * maxX: right bound in pixels
     * * maxY: bottom bound in pixels
     * * width
     * * height
     * @param {Point[]} points Array of points (point -> { x, y})
     */
    private generateBounds;
    /**
     * Transforms the array of raw points into a normalized array of booleans (matrix of alphas)
     * Each cell of the matrix represents one sector of the image. If in that sector exists some positive alpha then its value will be "true"
     * @param {Point[]} points Array of points (point -> { x, y})
     * @param {Bounds} bounds Bounds object ({minX, minY, maxX, maxY, width, height})
     * @param {number} [resolution = 10] Size of the matrix(default 10x10).  High values reduce false positives and increase false negatives in stroke recognition. With low values the opposite occurs.
     */
    private generateMatrix;
}
export {};

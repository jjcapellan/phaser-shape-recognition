/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
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

interface Bounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
}

interface Result{
    hitsRatio: number;
    hits: number;
    fails: number;
    sampleMatrix: boolean[][];
    modelMatrix: boolean[][];
}

export default class StrokeRec {
    private scene: Scene;
    strokes = new Map<string, Stroke>();

    constructor(scene: Scene) {
        this.scene = scene;
    }


    /**
     * Generates a "normalized" array of 10x10 from an image.
     * This image must be a black stroke over a transparent background.
     * @param {string} name Unique name for this stroke
     * @param {string} key The string key of the texture
     * @param {(string | number)} [frame] String or index of the texture frame
     * @param {number} [resolution = 10] Size of the matrix (default 10x10). High values reduce false positives and increase false negatives in stroke recognition. With low values the opposite occurs.
     */
    add(name: string, key: string, frame?: string | number, resolution: number = 10) {
        const sc = this.scene;
        const newStroke: Stroke = { name: name, matrix: [], resolution: resolution }


        function generatePoints() {
            const img = sc.textures.getFrame(key, frame);
            const width = img.width;
            const height = img.height;

            let points: Point[] = [];

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    if (sc.textures.getPixelAlpha(x, y, key, frame)) {
                        points.push({ x: x, y: y });
                    }
                }
            }// End 2xfor

            return points;
        }

        const points = generatePoints();
        const bounds = this.generateBounds(points);
        const matrix = this.generateMatrix(points, bounds, resolution);

        newStroke.matrix = matrix;

        this.strokes.set(name, newStroke);
    }

    /**
     * 
     * @param {Point[]} samplePoints Array of points ({x,y}) of the stroke to compare
     * @param {string} strokeName Name of the model stroke
     * @returns {Result} Object width results data
     */
    checkStroke(samplePoints: Point[], strokeName: string): Result | null{
        const stroke = this.strokes.get(strokeName);
        if (!stroke) {
            return null;
        }
        const sampleBounds = this.generateBounds(samplePoints);
        const sampleMatrix = this.generateMatrix(samplePoints, sampleBounds, stroke.resolution);

        let hits = 0;
        let fails = 0;

        stroke.matrix.forEach((row, i) => {

            row.forEach((cell, j) => {
                let sample = sampleMatrix[i][j];
                if (cell && sample) {
                    hits++;
                } else if(cell !== sample){
                    fails++;
                }
            });
        }); // End 2xforEach        

        return {hitsRatio: hits/(hits + fails), hits: hits, fails: fails, sampleMatrix: sampleMatrix, modelMatrix: stroke.matrix};
    }


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
    private generateBounds(points: Point[]): Bounds {
        // Big values ensures them will be adjusted
        const bounds: Bounds = { minX: 100000, minY: 100000, maxX: -100000, maxY: -100000, width: 0, height: 0 };

        points.forEach((point) => {
            if (point.x < bounds.minX) {
                bounds.minX = point.x;
            } else if (point.x > bounds.maxX) {
                bounds.maxX = point.x;
            }
            if (point.y < bounds.minY) {
                bounds.minY = point.y;
            } else if (point.y > bounds.maxY) {
                bounds.maxY = point.y;
            }
        });

        bounds.width = bounds.maxX - bounds.minX;
        bounds.height = bounds.maxY - bounds.minY;

        return bounds;
    }// End generateBounds

    /**
     * Transforms the array of raw points into a normalized array of booleans (matrix of alphas)
     * Each cell of the matrix represents one sector of the image. If in that sector exists some positive alpha then its value will be "true"
     * @param {Point[]} points Array of points (point -> { x, y})
     * @param {Bounds} bounds Bounds object ({minX, minY, maxX, maxY, width, height})
     * @param {number} [resolution = 10] Size of the matrix(default 10x10).  High values reduce false positives and increase false negatives in stroke recognition. With low values the opposite occurs.
     */
    private generateMatrix(points: Point[], bounds: Bounds, resolution: number = 10): boolean[][] {
        function getEmptyArray() {
            let arr = [];
            for (let i = 0; i < resolution; i++) {
                arr.push(new Array(resolution).fill(false));
            }
            return arr;
        }

        const matrix: boolean[][] = getEmptyArray();
        const cellSize = (bounds.width > bounds.height) ? Math.floor(bounds.width / resolution) : Math.floor(bounds.height / resolution);

        points.forEach((point) => {
            let row = Math.floor((point.y - bounds.minY) / cellSize);
            let column = Math.floor((point.x - bounds.minX) / cellSize);
            row = Math.min(row, matrix.length - 1);
            column = Math.min(column, matrix[0].length - 1);
            matrix[row][column] = true;
        });

        return matrix;
    }// End generateMatrix
}
/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
import { Scene } from 'phaser';

interface Point {
    x: number;
    y: number;
}

interface Bounds {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
    width: number;
    height: number;
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

    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;
    }


    private generatePoints(textureKey: string, frame?: string | number): Point[] {
        const img = this.scene.textures.getFrame(textureKey, frame);
        const width = img.width;
        const height = img.height;

        let points: Point[] = [];

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                if (this.scene.textures.getPixelAlpha(x, y, textureKey, frame)) {
                    points.push({ x: x, y: y });
                }
            }
        }// End 2xfor

        return points;
    }


    /**
     * Test the proportion of coincidence between two 2d arrays of booleans with the same size. 
     * Only that cells on which at least one value is "true" are evaluated.
     * @param {boolean[][]} matrix1 First matrix to compare
     * @param matrix2 Second matrix to compare
     * @param { boolean[][] } checkNeighbors Fail is not added if there are some neighbor cell with "true"
     * @returns { Result } Object {hitsRatio, hits, fails}
     */
    test(matrix1: boolean[][], matrix2: boolean[][], checkNeighbors: boolean): Result | null {
        if (!matrix1 || !matrix2) {
            return null;
        }

        function getNeighbors(row: number, col: number): number {
            let m1: boolean[][];
            let m2: boolean[][];

            m1 = matrix1[row][col] ? matrix1 : matrix2;
            m2 = matrix1[row][col] ? matrix2 : matrix1;

            let neighbors = 0;

            for (let dy = -1; dy < 2; dy++) {
                for (let dx = -1; dx < 2; dx++) {
                    let nrow = row + dy;
                    let ncol = col + dx;
                    if (nrow >= 0 && nrow < m2.length && ncol >= 0 && ncol < m2[0].length && (nrow != row || ncol != col)) {
                        neighbors += m2[nrow][ncol] ? 1 : 0;
                    }
                }
            }

            return neighbors;

        }

        let hits = 0;
        let fails = 0;

        matrix1.forEach((row, i) => {

            row.forEach((value1, j) => {
                let value2 = matrix2[i][j];
                if (value1 && value2) {
                    hits++;
                } else if (value1 !== value2) {
                    fails++;
                    if (checkNeighbors) {
                        let neighbors = getNeighbors(i, j);
                        if (neighbors) {
                            fails--;
                            hits += neighbors / 8;
                        }
                    }
                }
            });
        }); // End 2xforEach        

        return { hitsRatio: hits / (hits + fails), hits: hits, fails: fails };
    }


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
    private getBounds(points: Point[]): Bounds {
        // Big values ensures them will be adjusted
        const bounds: Bounds = { minX: 1000000, minY: 1000000, maxX: -1000000, maxY: -1000000, width: 0, height: 0 };

        points.forEach((point) => {
            if (point.x < bounds.minX) {
                bounds.minX = point.x;
            }
            if (point.y < bounds.minY) {
                bounds.minY = point.y;
            }
        })

        points.forEach((point) => {
            if (point.x > bounds.maxX) {
                bounds.maxX = point.x;
            }
            if (point.y > bounds.maxY) {
                bounds.maxY = point.y;
            }
        });

        bounds.width = bounds.maxX - bounds.minX;
        bounds.height = bounds.maxY - bounds.minY;

        return bounds;
    }// End getBounds


    /**
     * Transforms an array of raw points or an image into a normalized array of booleans
     * @param { string | Point[]} source Can be the string key of a texture or an array of points (Ex: [{x: 2, y:2}, {x:3, y:5}, ...])
     * @param { (string | number) } frame  String or index of the texture frame. Not used if source is an array.
     * @param { number } [resolution = 10] Size of the matrix (default 10x10). High values reduce false positives and increase false negatives in stroke recognition. With low values the opposite occurs.
     * @returns { boolean[][] } Matrix of booleans. Each cell of the matrix represents one sector of the image. If in that sector exists some positive alpha then its value will be "true"
     */
    makeMatrix(source: string | Point[], frame?: string | number, resolution: number = 10): boolean[][] {
        function getEmptyArray() {
            let arr = [];
            for (let i = 0; i < resolution; i++) {
                arr.push(new Array(resolution).fill(false));
            }
            return arr;
        }

        const points = (typeof source == 'string') ? this.generatePoints(source, frame) : source;
        const bounds = this.getBounds(points);
        this.normalizeAspectRatio(points, bounds);

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
    }// End makeMatrix

    private normalizeAspectRatio(points: Point[], bounds: Bounds){
        const width = bounds.width;
        const height = bounds.height;
        
        if(width/height < 1/3 || width/height > 3 || width == height){
            return;
        }

        if(width > height){
            points.forEach((point) => {point.y *= (width/height)});
        } else {
            points.forEach((point) => {point.x *= (height/width)});
        }

        bounds = this.getBounds(points);
    }
}
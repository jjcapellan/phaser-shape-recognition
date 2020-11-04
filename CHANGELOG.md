## v1.2.0
### New Features
 * Normalization of aspect ratio: The image is adjusted to an aspect ratio of 1:1 (square). This improves the recognition. This correction present problems with extreme aspec ratios, so is limited to aspect ratios up to 1:3.
 ---
## v1.1.0
### New Features
 * **checkNeighbors**: new optional param of **test()** function. Fail is not added if there are some neighbor cell with "true".
### Fixes and little improvements
 * Fixed: getBounds() returns wrong bounds if points goes from max to min values(rigth to left, bottom to top).
---
## v1.0.1
### Fixes and little improvements
* Minor fix: Format error in the readme.
## v1.0.0
### First version
* After a lot of changes of direction here is the first version.
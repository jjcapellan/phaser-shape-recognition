var t=function(){function t(t){this.scene=t}var n=t.prototype;return n.generatePoints=function(t,n){for(var r=this.scene.textures.getFrame(t,n),i=r.width,e=r.height,a=[],h=0;h<e;h++)for(var o=0;o<i;o++)this.scene.textures.getPixelAlpha(o,h,t,n)&&a.push({x:o,y:h});return a},n.test=function(t,n,r){if(!t||!n)return null;var i=0,e=0;return t.forEach(function(a,h){a.forEach(function(a,o){var f=n[h][o];if(a&&f)i++;else if(a!==f&&(e++,r)){var u=function(r,i){var e;e=t[r][i]?n:t;for(var a=0,h=-1;h<2;h++)for(var o=-1;o<2;o++){var f=r+h,u=i+o;f>=0&&f<e.length&&u>=0&&u<e[0].length&&(f!=r||u!=i)&&(a+=e[f][u]?1:0)}return a}(h,o);u&&(e--,i+=u/8)}})}),{hitsRatio:i/(i+e),hits:i,fails:e}},n.getBounds=function(t){var n={minX:1e6,minY:1e6,maxX:-1e6,maxY:-1e6,width:0,height:0};return t.forEach(function(t){t.x<n.minX?n.minX=t.x:t.x>n.maxX&&(n.maxX=t.x),t.y<n.minY?n.minY=t.y:t.y>n.maxY&&(n.maxY=t.y)}),n.width=n.maxX-n.minX,n.height=n.maxY-n.minY,n},n.makeMatrix=function(t,n,r){void 0===r&&(r=10);var i="string"==typeof t?this.generatePoints(t,n):t,e=this.getBounds(i),a=function(){for(var t=[],n=0;n<r;n++)t.push(new Array(r).fill(!1));return t}(),h=e.width>e.height?Math.floor(e.width/r):Math.floor(e.height/r);return i.forEach(function(t){var n=Math.floor((t.y-e.minY)/h),r=Math.floor((t.x-e.minX)/h);n=Math.min(n,a.length-1),r=Math.min(r,a[0].length-1),a[n][r]=!0}),a},t}();export default t;

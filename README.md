gulpfile-boilerplate
====================
Usage:
place following gulpfile.js in root:

```javascript
require('./builder')(require('gulp'));
```

Then you can use **gulp dev** for development.

You can declare new tasks before you've inited builder, they will be picked automatically.
E.G. **build-scripts-coffee** will be automatically included in **build-scripts**, which is included in **build**.
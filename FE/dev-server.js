var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

//-----------------------------------------------------------------------------

// check working directory
process.chdir('FE');
console.log(process.cwd());

//-----------------------------------------------------------------------------

/**
 * Refer static pages from the /app directory
 */
app.use(express.static('app'));

//-----------------------------------------------------------------------------
app.listen(port);
console.log('server running on port ' + port);

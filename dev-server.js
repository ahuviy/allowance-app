var express = require('express');
var app = express();

var port = process.env.PORT || 3000;

//-----------------------------------------------------------------------------

// change working directory
//process.chdir('FE');
//console.log(process.cwd());

//-----------------------------------------------------------------------------

/**
 * Refer static pages from the /FE/app directory
 */
app.use(express.static('FE/app'));

//-----------------------------------------------------------------------------
app.listen(port);
console.log('server running on port ' + port);

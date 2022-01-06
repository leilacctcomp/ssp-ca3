const { Console } = require('console');
const http = require('http'), //We need this module to create the HTTP server
      path = require('path'), //This module provides the path to the files we need to work with
      express = require('express'), //We need this module to respond to the requests made to the server
      fs = require('fs'), // We need this module to read and write on the files we're working with
      xmlParse = require('xslt-processor').xmlParse, //This is the module to parses the XML file
      xsltProcess = require('xslt-processor').xsltProcess, //We need this module to work out the XSL transformations
      xml2js = require('xml2js'); // We need this module to convert XML file into JSON file and vice versa

      const router = express(),
            server = http.createServer(router);

      router.get('/', function(req, res){
            res._writeHead(200, {'Content-Type' : 'text/html'}); //This tell the browser to wait for the content which will be the HTML type
            
            let xml = fs.readFileSync('BeautyShoppingList.xml', 'utf8'), //The variable let is needed to read the XML and XSL files
                xsl =   fs.readFileSync('BeautyShoppingList.xsl', 'utf8');

            let doc = xmlParse(xml), //We need this to parse the files (that became string after being read) to turn them  into objects that we can work with
                stylesheet = xmlParse(xsl);
                
            let result = xsltProcess(doc, stylesheet); //Aplying the transformation after getting the objects
            
            res.end(result.toString()); //This is needed to transform the xml to string to serve it back as HTML page

      });
      
      server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
            const addr = server.address();
            Console.log("server listening at", addr.address + ":" + addr.port)
            
      });
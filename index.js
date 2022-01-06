/*This project coding was developed during the server side programing lectures
given by the lecturer Mikhail(https://github.com/mikhail-cct/ssp-practical)*/
//const { Console } = require('console');
const http = require('http'), //We need this module to create the HTTP server
      path = require('path'), //This module provides the path to the files we need to work with
      express = require('express'), //We need this module to respond to the requests made to the server
      fs = require('fs'), // We need this module to read and write on the files we're working with
      xmlParse = require('xslt-processor').xmlParse, //This is the module to parses the XML file
      xsltProcess = require('xslt-processor').xsltProcess, //We need this module to work out the XSL transformations
      xml2js = require('xml2js'); // We need this module to convert XML file into JSON file and vice versa

const router = express(),
      server = http.createServer(router);

router.use(express.static(path.resolve(__dirname, 'views'))); //We serve static content from "views" folder
router.use(express.urlencoded({ extended: true })); //We allow the data sent from the client to be encoded in a URL targeting our end point
router.use(express.json()); //We include support for JSON

// Function to read in XML file and convert it to JSON
function XMLtoJSON(filename, cb) {
      var filepath = path.normalize(path.join(__dirname, filename));
      fs.readFile(filepath, 'utf8', function (err, xmlStr) {
            if (err) throw (err);
            xml2js.parseString(xmlStr, {}, cb);
      });
};

//Function to convert JSON to XML and save it
function JSONtoXML(filename, obj, cb) {
      var filepath = path.normalize(path.join(__dirname, filename));
      var builder = new xml2js.Builder();
      var xml = builder.buildObject(obj);
      fs.unlinkSync(filepath);
      fs.writeFile(filepath, xml, cb);
};

router.get('/get/html', function (req, res) {
      res.writeHead(200, { 'Content-Type': 'text/html' }); //This tell the browser to wait for the content which will be the HTML type

      let xml = fs.readFileSync('BeautyShoppingList.xml', 'utf8'), //The variable let is needed to read the XML and XSL files
          xsl = fs.readFileSync('BeautyShoppingList.xsl', 'utf8');

      let doc = xmlParse(xml), //We need this to parse the files (that became string after being read) to turn them  into objects that we can work with
          stylesheet = xmlParse(xsl);

      let result = xsltProcess(doc, stylesheet); //Aplying the transformation after getting the objects

      res.end(result.toString()); //This is needed to transform the xml to string to serve it back as HTML page

});

router.post('/post/json', function (req, res) {

      //This is the function which adds an item to the list
      function appendJSON(obj) {

            console.log(obj)
            //Converting XML to JASON
            XMLtoJSON('BeautyShoppingList.xml', function (err, result) {
                  if (err) throw (err);

                  result.shoppingList.section[obj.sec_n].listType.push({ 'item': obj.item, 'price': obj.price });

                  console.log(JSON.stringify(result, null, "  "));

                  //Converting back JASON to XML     
                  JSONtoXML('BeautyShoppingList.xml', result, function (err) {
                        if (err) console.log(err);
                  });
            });
      };
      appendJSON(req.body);

      res.redirect('back');

});

router.post('/post/delete', function (req, res) {

      //This is the function which deletes an item from the list
      function deleteJSON(obj) {

            console.log(obj)

            XMLtoJSON('BeautyShoppingList.xml', function (err, result) {
                  if (err) throw (err);

                  delete result.shoppingList.section[obj.section].listType[obj.entree];

                  console.log(JSON.stringify(result, null, "  "));

                  JSONtoXML('BeautyShoppingList.xml', result, function (err) {
                        if (err) console.log(err);
                  });
            });
      };

      deleteJSON(req.body);

      res.redirect('back');
});
//This allows the server to listen to the requests
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
      const addr = server.address();
      console.log("Server listening at", addr.address + ":" + addr.port)
});
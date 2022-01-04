const http = require('http'), //We need this module to create the HTTP server
      path = require('path'), //This module provides the path to the files we need to work with
      express = require('express'), //We need this module to respond to the requests made to the server
      fs = require('fs'), // We need this module to read and write on the files we're working with
      xmlParse = require('xslt-processor').xmlParse, //This is the module to parses the XML file
      xsltProcess = require('xslt-processor').xsltProcess, //We need this module to work out the XSL transformations
      xml2js = require('xml2js') // We need this module to convert XML file into JSON file and vice versa
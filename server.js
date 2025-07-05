// Generic node.js express init:
const express = require('express');
const app = express();
app.use(express.static('public'));

//
// These next lines allow us to use "response.render" with handlebars files!
// https://www.npmjs.com/package/express-handlebars
//
const hbs = require('hbs');

//
// The partials directory hold additional files that we're allowed to use inside of 
// our other templates using the partials syntax, e.g.: {{< head}}
// see http://handlebarsjs.com/partials.html
//
hbs.registerPartials(__dirname + '/views/partials');

//
// This next pair of lines teaches Express that if I ask to render a file, say "index",
// it's allowed to use any file named "index" that ends with 'hbs' and is contained in 
// the "views" folder
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

//
// Ok, now let's handle requests but render a handlebars file instead of the normal index.html!
//
app.get("/", (request, response) => {
  // The old code here did this:
  //   response.sendFile(__dirname + '/views/index.html');
  // We can still do that if we want (mixing and matching is fine),
  // but now we can use `response.render(templateName, data)` instead.
  // "templateName" should match up to the prefix of our .handlebars file, e.g. "index".

  // Here's some data that the our server knows:
  let dt = new Date();
  let data = {
    pets:[
      {
        name:"Fido",
        species:"Dog",
        age: 6,
      },
      {
        name:"Max",
        species:"Cat",
        age: 3,
      },  
    ],
    projectName: process.env.PROJECT_DOMAIN,
    luckyNumber: Math.floor(Math.random()*1000),
    serverTime: new Date(),
    ip: (request.headers["x-forwarded-for"]||"").split(",")[0]
    
  };

  // This next thing we do -- JSONing the output and appending it to itself -- is unusual.
  // I'm doing it here because helps us see what data we send to the client :-)
  // It can be a handy debugging trick, but in general it should be removed
  // from production uses since it doubles the payload.
  data.json = JSON.stringify(data, null, 2);
  
  // Now we render 'views/index.handlebars' with our data object.
  // There are a lot of other ways to call handlebars, too.
  // see http://handlebarsjs.com/
  response.render('index', data);
});


// And we end with some more generic node stuff -- listening for requests :-)
let listener = app.listen(process.env.PORT, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});

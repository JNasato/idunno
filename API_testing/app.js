require('dotenv').config()

const axios = require('axios')
const express = require('express')
const app = express()
const port = 3000
const bodyParser = require("body-parser")

const API_KEY = process.env.API_KEY

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.render('index'))

app.post('/', async (req, res) => {
  const area = req.body.area;
  const radius = req.body.radius;
  let price;
  if (req.body['$'] === 'on') {
    price = 0;
  } else if (req.body['$$'] === 'on') {
    price = 2;
  } else {
    price = 4;
  }
  const placesRequest = await axios.get(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${area}&key=${API_KEY}&type=restaurant&radius=${radius}&minprice=${price}&maxprice=${price + 1}`);
  const results = placesRequest.data.results;

  res.render('show', { results, API_KEY })
});

app.get('/show', (req, res) => res.render('show'))

app.get('/details/:id', async (req, res) => {
  const detailsRequest = await axios.get(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${req.params.id}&key=${API_KEY}`)
  details = detailsRequest.data.result
  review = details.reviews[0]
  res.render('details', { details, review })
})

app.listen(port, () => console.log(`Listening at http://localhost:${port}`))

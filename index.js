const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const PORT = 5000;

const app = express();

const resources = [
  {
    name: 'cityam',
    address:
      'https://www.cityam.com/london-must-become-a-world-leader-on-climate-change-action/',
    base: '',
  },
  {
    name: 'thetimes',
    address: 'https://www.thetimes.co.uk/environment/climate-change',
    base: '',
  },
  {
    name: 'guardian',
    address: 'https://www.theguardian.com/environment/climate-crisis',
    base: '',
  },
  {
    name: 'telegraph',
    address: 'https://www.telegraph.co.uk/climate-change',
    base: 'https://www.telegraph.co.uk',
  },
  {
    name: 'nyt',
    address: 'https://www.nytimes.com/international/section/climate',
    base: '',
  },
  {
    name: 'latimes',
    address: 'https://www.latimes.com/environment',
    base: '',
  },
  {
    name: 'smh',
    address: 'https://www.smh.com.au/environment/climate-change',
    base: 'https://www.smh.com.au',
  },
  {
    name: 'un',
    address: 'https://www.un.org/climatechange',
    base: '',
  },
  {
    name: 'bbc',
    address: 'https://www.bbc.co.uk/news/science_and_environment',
    base: 'https://www.bbc.co.uk',
  },
  {
    name: 'es',
    address: 'https://www.standard.co.uk/topic/climate-change',
    base: 'https://www.standard.co.uk',
  },
  {
    name: 'sun',
    address: 'https://www.thesun.co.uk/topic/climate-change-environment/',
    base: '',
  },
  {
    name: 'dm',
    address:
      'https://www.dailymail.co.uk/news/climate_change_global_warming/index.html',
    base: '',
  },
  {
    name: 'nyp',
    address: 'https://nypost.com/tag/climate-change/',
    base: '',
  },
];

const articles = [];

resources.forEach(async (resource) => {
  const response = await axios.get(resource.address);
  const html = response.data;
  const $ = cheerio.load(html);

  $('a:contains("climate")', html).each(function () {
    const title = $(this).text().trim();
    const url = $(this).attr('href');

    articles.push({
      title,
      url: resource.base + url,
      source: resource.name,
    });
  });
});

app.get('/', (req, res) => {
  res.json('welcome to the startup news api');
});

app.get('/news', async (req, res) => {
  res.status(200).json({ success: true, data: articles });
});

app.get('/news/:resourceId', async (req, res) => {
  const resourceId = req.params.resourceId;

  const resourceAddress = resources.filter(
    (resource) => resource.name == resourceId
  )[0].address;
  const resourceBase = resources.filter(
    (resource) => resource.name == resourceId
  )[0].base;

  const response = await axios.get(resourceAddress);
  const html = response.data;
  const $ = cheerio.load(html);
  const specificArticles = [];

  $('a:contains("climate")', html).each(function () {
    const title = $(this).text();
    const url = $(this).attr('href');
    specificArticles.push({
      title,
      url: resourceBase + url,
      source: resourceId,
    });
  });
  res.json(specificArticles);
});

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

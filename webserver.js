const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 5500;

function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
}


async function getCity(ip) {
    try {
        const response = await axios.get('http://ip-api.com/json/${ip}');
        return response.data.city;
    } catch (error) {
        console.error(error);
        return 'Unknown';
    }
}

async function getTemperature(city) {
    const apiKey ='weatherapi.com';
    try {
        const response = await axios.get('http://api.weatherapi.com=${city}&units=metric&appid=${apiKey}');
        return response.data.main.temp;
    } catch (error) {
        console.error(error);
        return 'Unknown';
    }
}

app.get('/api/hello', async (req, res) => {
    const visitorName = req.query.visitor_name || 'Guest';
    const clientIp = getClientIp(req);
    const city = await getCity(clientIp);
    const temperature = await getTemperature(city);

    res.json({
        client_ip: clientIp,
        location: city,
        greeting: 'Hello, ${visitorName}!', 'the temperature is ${temperature}':' degrees Celsius in ${city}'
    });
});

app.listen(5500, () => {
    console.log('Server is running on port ${5500}');
});


{
    "version"; 2,
    "builds"; [
      {
        "src": "index.js",
        "use": "@vercel/node"
      }
    ],
    "routes"; [
      {
        "src": "/api/hello",
        "dest": "/index.js"
      }
    ]
  }
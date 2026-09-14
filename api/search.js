const fetch = require('node-fetch');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false,
  checkServerIdentity: () => undefined
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const searchQuery = req.query.query || req.query.search;

  if (!searchQuery) {
    return res.status(400).json({
      success: false,
      developer: "RAJA X DEVELOPER",
      channel: "https://whatsapp.com/channel/0029Vb8CIl36buMHcPt7a40D",
      message: "Please provide a 'query' parameter."
    });
  }

  try {
    const bodyParams = new URLSearchParams();
    bodyParams.append('action', 'elementor_pro_forms_send_form');
    bodyParams.append('post_id', '413');
    bodyParams.append('form_id', '5e17544');
    bodyParams.append('queried_id', '413');
    bodyParams.append('form_fields[search]', searchQuery.trim());
    bodyParams.append('referrer', 'https://simownership.org/search/');

    const response = await fetch('https://188.114.96.6/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: {
        'Host': 'simownership.org',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Origin': 'https://simownership.org',
        'Referer': 'https://simownership.org/search/',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache'
      },
      body: bodyParams.toString(),
      agent: agent
    });

    const responseText = await response.text();

    let rawData;
    try {
      rawData = JSON.parse(responseText);
    } catch (e) {
      return res.status(403).json({
        success: false,
        developer: "RAJA X DEVELOPER",
        channel: "https://whatsapp.com/channel/0029Vb8CIl36buMHcPt7a40D",
        error: "Cloudflare blocked IP on CNIC query."
      });
    }

    let resultsArray = [];
    if (rawData && rawData.data) {
      if (rawData.data.data && Array.isArray(rawData.data.data.results)) {
        resultsArray = rawData.data.data.results;
      } else if (Array.isArray(rawData.data.results)) {
        resultsArray = rawData.data.results;
      } else if (Array.isArray(rawData.data)) {
        resultsArray = rawData.data;
      }
    } else if (rawData && Array.isArray(rawData.results)) {
      resultsArray = rawData.results;
    }

    return res.status(200).json({
      success: true,
      developer: "RAJA X DEVELOPER",
      channel: "https://whatsapp.com/channel/0029Vb8CIl36buMHcPt7a40D",
      count: resultsArray.length,
      data: {
        results: resultsArray
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      developer: "RAJA X DEVELOPER",
      channel: "https://whatsapp.com/channel/0029Vb8CIl36buMHcPt7a40D",
      error: error.message
    });
  }
};

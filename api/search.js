const fetch = require('node-fetch');
const https = require('https');

const agent = new https.Agent({
  rejectUnauthorized: false
});

module.exports = async (req, res) => {
  // CORS Headers
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
    const formData = new URLSearchParams();
    formData.append('action', 'elementor_pro_forms_send_form');
    formData.append('post_id', '413');
    formData.append('form_id', '5e17544');
    formData.append('queried_id', '413');
    formData.append('form_fields[search]', searchQuery.trim());
    formData.append('referrer', 'https://simownership.org/search/');

    // Request using direct domain to prevent Cloudflare direct-IP HTML blocking
    const response = await fetch('https://simownership.org/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Origin': 'https://simownership.org',
        'Referer': 'https://simownership.org/search/',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      body: formData.toString(),
      agent: agent
    });

    // Extract text first to check if response is HTML or JSON
    const responseText = await response.text();

    let rawData;
    try {
      rawData = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({
        success: false,
        developer: "RAJA X DEVELOPER",
        channel: "https://whatsapp.com/channel/0029Vb8CIl36buMHcPt7a40D",
        error: "Server returned non-JSON response (Cloudflare/HTML block or invalid query)."
      });
    }

    // Extract multi-data array dynamically
    let resultsArray = [];

    if (rawData && rawData.data) {
      if (rawData.data.data && Array.isArray(rawData.data.data.results)) {
        resultsArray = rawData.data.data.results;
      } else if (Array.isArray(rawData.data.results)) {
        resultsArray = rawData.data.results;
      } else if (Array.isArray(rawData.data)) {
        resultsArray = rawData.data;
      }
    } else if (Array.isArray(rawData.results)) {
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

const fetch = require('node-fetch');
const https = require('https');

// Custom Agent for IP resolution (188.114.96.6) without changing Host header behavior
const customAgent = new https.Agent({
  rejectUnauthorized: false,
  lookup: (hostname, options, callback) => {
    if (hostname === 'simownership.org') {
      return callback(null, '188.114.96.6', 4);
    }
    return require('dns').lookup(hostname, options, callback);
  }
});

module.exports = async (req, res) => {
  // 1. Handling CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Pre-flight request for CORS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Input Parameter: GET query (e.g. /api/search?query=03123168814 or CNIC)
  const searchQuery = req.query.query || req.query.search;

  if (!searchQuery) {
    return res.status(400).json({
      success: false,
      message: "Please provide a 'query' parameter (Mobile Number or CNIC)."
    });
  }

  try {
    // Exact Payload & Form Data setup
    const formData = new URLSearchParams();
    formData.append('action', 'elementor_pro_forms_send_form');
    formData.append('post_id', '413');
    formData.append('form_id', '5e17544');
    formData.append('queried_id', '413');
    formData.append('form_fields[search]', searchQuery);
    formData.append('referrer', 'https://simownership.org/search/');

    // Exact Request Matching given cURL
    const response = await fetch('https://simownership.org/wp-admin/admin-ajax.php', {
      method: 'POST',
      headers: {
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Origin': 'https://simownership.org',
        'Referer': 'https://simownership.org/search/',
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      body: formData.toString(),
      agent: customAgent
    });

    const rawData = await response.json();

    // Handling multiple CNIC/Mobile results dynamically
    let resultsArray = [];
    if (rawData && rawData.data && rawData.data.data && Array.isArray(rawData.data.data.results)) {
      resultsArray = rawData.data.data.results;
    } else if (rawData && rawData.data && Array.isArray(rawData.data.results)) {
      resultsArray = rawData.data.results;
    }

    // Standardized Response Format
    return res.status(200).json({
      success: true,
      developer: "Ramzan Ahsan",
      channel: "https://chat.whatsapp.com/FiZBn0BykHX47d1iHLOay1",
      count: resultsArray.length,
      data: {
        results: resultsArray
      }
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      developer: "Ramzan Ahsan",
      group: "https://chat.whatsapp.com/FiZBn0BykHX47d1iHLOay1",
      error: error.message
    });
  }
};

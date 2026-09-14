const { exec } = require('child_process');

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

  // Sanitize input for security
  const safeQuery = String(searchQuery).replace(/[^0-9]/g, '');

  // Exact cURL command execution using system binary
  const curlCommand = `curl -s --resolve simownership.org:443:188.114.96.6 'https://simownership.org/wp-admin/admin-ajax.php' \
    -H 'Accept: application/json, text/javascript, */*; q=0.01' \
    -H 'Origin: https://simownership.org' \
    -H 'Referer: https://simownership.org/search/' \
    -H 'X-Requested-With: XMLHttpRequest' \
    --data 'action=elementor_pro_forms_send_form&post_id=413&form_id=5e17544&queried_id=413&form_fields[search]=${safeQuery}&referrer=https://simownership.org/search/'`;

  exec(curlCommand, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({
        success: false,
        developer: "RAJA X DEVELOPER",
        channel: "https://whatsapp.com/channel/0029Vb8CIl36buMHcPt7a40D",
        error: "Execution error: " + error.message
      });
    }

    let rawData;
    try {
      rawData = JSON.parse(stdout);
    } catch (e) {
      return res.status(403).json({
        success: false,
        developer: "RAJA X DEVELOPER",
        channel: "https://whatsapp.com/channel/0029Vb8CIl36buMHcPt7a40D",
        error: "Non-JSON response from target server."
      });
    }

    // Dynamic Multi-Result Handling for CNIC & Single Mobile
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
  });
};

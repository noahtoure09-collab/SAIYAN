// ==================== commands/antitagall.js ====================
export default {
  name: "antitagall",
  alias: ["antitag"],
  description: "Protection contre les tags massifs (Non-Admins)",
  category: "Sécurité",

  run: async (sock, m, args) => {
    const chatId = m.chat;
    const action = args[0]?.toLowerCase();

    // Initialisation dans les globals de ton handler pour la persistance
    global.antitagStatus ??= {}; 

    if (action === "on") {
      global.antitagStatus[chatId] = true;
      return sock.sendMessage(chatId, { text: "🛡️ SYSTÈME : Protection Anti-Tag activée." });
    } else if (action === "off") {
      global.antitagStatus[chatId] = false;
      return sock.sendMessage(chatId, { text: "🛡️ SYSTÈME : Protection Anti-Tag désactivée." });
    } else {
      return sock.sendMessage(chatId, { text: "Utilisation : .antitagall on/off" });
    }
  },

  // Appelé automatiquement par ton handler.js à chaque message (ligne 146)
  detect: async (sock, m) => {
    try {
      // 1. Vérifications : Groupe, pas le bot, et protection activée
      if (!m.isGroup || m.fromMe || !global.antitagStatus?.[m.chat]) return;

      const mentions = m.mentionedJid || [];
      
      // Déclenchement si plus de 5 personnes sont taguées
      if (mentions.length > 5) {
        const groupMetadata = await sock.groupMetadata(m.chat);
        const participants = groupMetadata.participants;
        
        // Identification de l'envoyeur et du bot dans les participants réels
        const sender = participants.find(p => p.id === m.sender);
        const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
        const bot = participants.find(p => p.id === botId);

        const isSenderAdmin = sender?.admin === 'admin' || sender?.admin === 'superadmin';
        const isBotAdmin = bot?.admin === 'admin' || bot?.admin === 'superadmin';

        // Si c'est un non-admin qui tag et que le bot est admin
        if (!isSenderAdmin && isBotAdmin) {
          // 2. Suppression du message fautif
          await sock.sendMessage(m.chat, { delete: m.key });

          const warnMsg = `
+---------------------------------------+
|        SYSTÈME : DISCIPLINE           |
+---------------------------------------+
|                                       |
| CIBLE : @${m.sender.split('@')[0]}
| ACTION : TAG MASSIF DÉTECTÉ           |
|                                       |
| "TON ÉNERGIE EST TROP BRUYANTE.       |
| LE RÉSEAU PURGE TON MESSAGE."         |
|                                       |
+---------------------------------------+
STATUT : NETTOYAGE EFFECTUÉ`;

          // 3. Envoi de ta nouvelle photo
          await sock.sendMessage(m.chat, { 
            image: { url: "https://files.catbox.moe/iw4tzb.jpg" },
            caption: warnMsg,
            mentions: [m.sender] 
          });
        }
      }
    } catch (err) {
      console.error("❌ Erreur Antitagall :", err);
    }
  }
};

// ==================== commands/antitag.js ====================
import config from '../config.js';

export default {
  name: "antitag",
  alias: ["anti-tag"],
  description: "Configure le système Anti-Tag",
  category: "GROUPE",

  run: async (sock, m, args) => {
    try {
      const chatId = m.chat;

      if (!m.isGroup) return;

      // 1. Récupération des données du groupe pour vérification admin
      const groupMetadata = await sock.groupMetadata(chatId);
      const participants = groupMetadata.participants;
      
      // Utilisation du formatage de sender de ton handler
      const senderId = m.sender.split(':')[0] + "@s.whatsapp.net";
      const user = participants.find(p => p.id.includes(senderId.split('@')[0]));
      
      const isMomo = m.fromMe;
      const isAdmin = user?.admin === 'admin' || user?.admin === 'superadmin';

      if (!isMomo && !isAdmin) {
        return sock.sendMessage(chatId, { text: "🚫 ACCÈS REFUSÉ : Seul un Admin peut configurer la protection." });
      }

      const action = args[0]?.toLowerCase();

      // Initialisation du mode si inexistant
      global.botModes.antitag ??= {};

      if (!action) {
        return sock.sendMessage(chatId, {
          text: `🚫 *SYSTÈME ANTI-TAG*
          
.antitag on  -> Active la protection
.antitag off -> Désactive la protection

*Effet : Supprime automatiquement les tentatives de tagall non autorisées.*`
        });
      }

      if (action === "on") {
        global.botModes.antitag[chatId] = true;
        return sock.sendMessage(chatId, { 
            image: { url: "https://files.catbox.moe/v7zea2.jpg" },
            caption: "✅ *PROTECTION ACTIVÉE*\n\nLes saiyans surveille désormais les mentions de ce groupe." 
        });
      } else if (action === "off") {
        global.botModes.antitag[chatId] = false;
        return sock.sendMessage(chatId, { 
            text: "❌ *PROTECTION DÉSACTIVÉE*" 
        });
      }

    } catch (err) {
      console.error("Erreur Antitag :", err);
    }
  },

  // 🛡️ DÉTECTION PASSIVE (Ajouté selon ton handler.js ligne 144)
  detect: async (sock, m) => {
    if (!m.isGroup || !global.botModes.antitag?.[m.chat]) return;

    // Détection des tags massifs (@everyone ou plus de 10 mentions)
    const isTagAll = m.body.includes('@everyone') || m.body.includes('@here') || m.mentionedJid?.length > 10;

    if (isTagAll && !m.fromMe) {
      // Suppression du message
      await sock.sendMessage(m.chat, { delete: m.key }).catch(() => {});
    }
  }
};

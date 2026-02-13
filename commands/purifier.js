// ==================== commands/purifier.js ====================
export default {
  name: "purifier",
  alias: ["exorcisme", "purge"],
  description: "Prière de purification aléatoire contre les marabouts",
  category: "ADMINISTRATION",

  run: async (sock, m, args) => {
    try {
      const chatId = m.chat;

      if (!m.isGroup) return sock.sendMessage(chatId, { text: "Le rituel ne peut avoir lieu qu'en groupe." });

      let cible = null;
      if (m.message.extendedTextMessage?.contextInfo?.participant) {
        cible = m.message.extendedTextMessage.contextInfo.participant;
      } else if (m.mentionedJid && m.mentionedJid.length > 0) {
        cible = m.mentionedJid[0];
      }

      if (!cible) {
        return sock.sendMessage(chatId, { text: "Désignez l'imposteur à purifier." });
      }

      // --- 🖼️ Liste de tes images Catbox ---
      const images = [
        "https://files.catbox.moe/smaa9g.jpg",
        "https://files.catbox.moe/a2sivk.jpg",
        "https://files.catbox.moe/teyy91.jpg",
        "https://files.catbox.moe/0gskrs.jpg",
        "https://files.catbox.moe/h7729z.jpg",
        "https://files.catbox.moe/37z9ek.jpg"
      ];

      // --- 📜 Liste des Prières de Purification ---
      const prieres = [
        `+---------------------------------------+\n|       ORATION DE PURIFICATION         |\n+---------------------------------------+\n\n@${cible.split('@')[0]}\nTES SORTILÈGES SONT NULS DEVANT LE SAIYAN.\nLE FEU DU RÉSEAU TE CONSOMME.\n\nJE VAIS TE FAIRE GOÛTER AU VRAI POUVOIR.`,
        
        `+---------------------------------------+\n|        EXORCISME DU SYSTÈME           |\n+---------------------------------------+\n\n@${cible.split('@')[0]}\nJE BANNIS TES ARNAQUES DE CE GROUPE.\nTON EXISTENCE EST UNE ERREUR DE LA NATURE JUSTE UNE CAPOTE QUI C'EST DÉCHIRÉ TROP TÔT.\n\nEXTENSION DU TERRITOIRE PURGE TOTALE .`,
        
        `+---------------------------------------+\n|       LE VERDICT DU SOUVERAIN         |\n+---------------------------------------+\n\n@${cible.split('@')[0]}\nTON ÉNERGIE MARABOUTIQUE EST DÉTECTÉE.\nLE PROTOCOLE DE NETTOYAGE EST ACTIVÉ.\n\nDISPARAÎT DANS LE NÉANT DU CLOUD.`,
        
        `+---------------------------------------+\n|        SAINT SIÈGE : PURGE            |\n+---------------------------------------+\n\n@${cible.split('@')[0]}\nUN AUTRE NÉE FOU QUE DIEU TE PARDONNE POUR TOUT SE QUE TU FAIT.\nET TE COUPE LA BITE POUR TOUT SE QUE TU NE FAIT PAS BIEN.\n\nL'ÉQUILIBRE EST RESTAURÉ.`
      ];

      // Sélection aléatoire
      const randomImage = images[Math.floor(Math.random() * images.length)];
      const randomPriere = prieres[Math.floor(Math.random() * prieres.length)];

      // 1. Envoi de l'image et du texte aléatoire
      await sock.sendMessage(chatId, {
        image: { url: randomImage },
        caption: randomPriere,
        mentions: [cible]
      });

      // 2. Pause pour l'effet (2 secondes)
      await new Promise(res => setTimeout(res, 2000));

      // 3. Suppression du marabout
      await sock.groupParticipantsUpdate(chatId, [cible], "remove");

      await sock.sendMessage(chatId, { text: "SUCEUR DE BITE ÉLIMINER TERRITOIRE NETTOYER." });

    } catch (error) {
      console.error("Erreur purification :", error);
      await sock.sendMessage(chatId, { text: "LES CONNARDS NE VEULENT PAS DISPARAÎTRE (Vérifie mes droits admin)." });
    }
  }
};

// ==================== commands/kickall.js ====================
export default {
  name: "kickall",
  alias: ["purge"],
  description: "Expulsion massive avec son style GIF",
  category: "ADMINISTRATION",

  run: async (sock, m, args) => {
    try {
      const chatId = m.chat;

      if (!m.isGroup) return;

      // 🔄 Mise à jour des données
      const groupMetadata = await sock.groupMetadata(chatId);
      const participants = groupMetadata.participants;

      // Vérification MOMO / Admin
      const senderId = m.sender.split(':')[0] + "@s.whatsapp.net";
      const user = participants.find(p => p.id.includes(senderId.split('@')[0]));
      
      const isMomo = m.fromMe;
      const isAdmin = user?.admin === 'admin' || user?.admin === 'superadmin';

      if (!isMomo && !isAdmin) {
        return sock.sendMessage(chatId, { text: "🚫 ACCÈS REFUSÉ : t'es pas un saiyan ou un admis." });
      }

      const targets = participants.filter(p => !p.admin).map(p => p.id);
      if (targets.length === 0) return;

      const kickMsg = `
⚔️ *SYSTÈME : EXTRACTION DES SAIYANS* ⚔️
━━━━━━━━━━━━━━━━━━━━━━
👤 *AUTORITÉ* : MR GOJO 
🎯 *CIBLES* : ${targets.length}

*"Les Saiyans  n'accepte que les plus forts. Les faibles n'ont plus leur place ici."*
━━━━━━━━━━━━━━━━━━━━━━
🥷 *STATUT* : NETTOYAGE...`;

      // 1. Envoi de l'image
      await sock.sendMessage(chatId, { 
        image: { url: "https://files.catbox.moe/ghumqx.jpg" },
        caption: kickMsg 
      });

      // 2. 🔊 ENVOI DU SON (Méthode GIF - Flux direct)
      // On utilise la même structure que ton message vidéo/gif
      await sock.sendMessage(chatId, { 
        audio: { url: "https://files.catbox.moe/zssz9l.mp3" }, 
        mimetype: 'audio/mp4', // Mimetype compatible Baileys
        ptt: true 
      }, { url: "https://files.catbox.moe/zssz9l.mp3" }); 

      // 3. Purge
      for (const targetJid of targets) {
        await sock.groupParticipantsUpdate(chatId, [targetJid], "remove");
        await new Promise(res => setTimeout(res, 1000));
      }

      await sock.sendMessage(chatId, { text: "🏁 *PURGE TERMINÉE.*" });

    } catch (err) {
      console.error("Erreur Kickall :", err);
    }
  }
};

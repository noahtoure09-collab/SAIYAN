// ==================== commands/add.js ====================
export default {
  name: "add",
  alias: ["ajouter", "inviter"],
  description: "Ajoute un membre au groupe",
  category: "ADMINISTRATION",

  run: async (sock, m, args) => {
    try {
      const chatId = m.chat;

      // 1. Vérification Groupe
      if (!m.isGroup) return sock.sendMessage(chatId, { text: "Cette action nécessite un groupe." });

      // 2. Vérification des droits (Admin ou Owner)
      const groupMetadata = await sock.groupMetadata(chatId);
      const participants = groupMetadata.participants;
      const user = participants.find(p => p.id === m.sender);
      
      // On retire le !m.fromMe pour que MOMO puisse commander son bot
      if (!(user?.admin === 'admin' || user?.admin === 'superadmin')) {
        return sock.sendMessage(chatId, { text: "ACCÈS REFUSÉ : Seul les saiyans ou un Admin peut invoquer de nouvelles humains." });
      }

      // 3. Extraction du numéro
      if (!args[0]) {
        return sock.sendMessage(chatId, { text: "Usage : .add 243XXXXXXXXX" });
      }

      const number = args[0].replace(/\D/g, '');
      if (number.length < 8) {
        return sock.sendMessage(chatId, { text: "Numéro invalide détecté dans la matrice." });
      }

      const jid = `${number}@s.whatsapp.net`;

      // 4. Message de bienvenue du Monarque MOMO
      const addMsg = `
+---------------------------------------+
|       INVOCATION DES SAIYANS          |
+---------------------------------------+
|                                       |
| CIBLE : +${number}                    |
|                                       |
| "LES SAIYANS T'OUVRES LES PORTES DU GROUPE.   |
| NE GASPILLE PAS CETTE CHANCE."        |
|                                       |
+---------------------------------------+
STATUT : AJOUT EN COURS...`;

      await sock.sendMessage(chatId, { 
        image: { url: "https://files.catbox.moe/iw4tzb.jpg" }, 
        caption: addMsg 
      });

      // 5. Ajout du participant
      await sock.groupParticipantsUpdate(chatId, [jid], 'add');

    } catch (err) {
      console.error('❌ ADD ERROR:', err);
      await sock.sendMessage(m.chat, { 
        text: "Échec de l'ajout. (Compte privé ou déjà présent)." 
      });
    }
  }
};

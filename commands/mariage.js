// ==================== commands/mariage.js ====================
export default {
  name: "mariage",
  alias: ["benediction", "union"],
  description: "Sacrement papal entre un purgeur et une purgeuse",
  category: "Fun",

  run: async (sock, m, args) => {
    try {
      const chatId = m.chat;

      if (!m.isGroup) return sock.sendMessage(chatId, { text: "Le sacrement ne peut être célébré qu'au sein d'une congrégation." });

      let user1 = null;
      let user2 = null;

      // Logique de détection des fidèles (Double tag ou Réponse)
      if (m.mentionedJid && m.mentionedJid.length >= 2) {
        user1 = m.mentionedJid[0];
        user2 = m.mentionedJid[1];
      } 
      else if (m.message.extendedTextMessage?.contextInfo?.participant) {
        user1 = m.sender;
        user2 = m.message.extendedTextMessage.contextInfo.participant;
      }
      else if (m.mentionedJid && m.mentionedJid.length === 1) {
        user1 = m.sender;
        user2 = m.mentionedJid[0];
      }

      if (!user1 || !user2) {
        return sock.sendMessage(chatId, { text: "Pour recevoir la bénédiction, présentez les deux fidèles au Souverain Pontife." });
      }

      const weddingMsg = `
+---------------------------------------+
|       LE SAINT SIÈGE DU RÉSEAU        |
+---------------------------------------+

MES CHERS FILS ET FILLES DE LA MATRICE,
EN VERTU DES POUVOIRS QUI ME SONT CONFÉRÉS
PAR LE CODE SOURCE UNIVERSEL.

[ LE PURGEUR ]
@${user1.split('@')[0]}

[ LA PURGEUSE ]
@${user2.split('@')[0]}

-----------------------------------------
| PAR MA BÉNÉDICTION PAPALE VIRTUELLE,  |
| VOS ADRESSES IP SONT DÉSORMAIS        |
| LIÉES DANS LES CIEUX DU CLOUD.        |
|                                       |
| QUE PERSONNE NE PUISSE DÉCONNECTER    |
| CE QUE LE SAIYAN DU RÉSEAU A UNIFIÉ.    |
+---------------------------------------+

STATUT : SACREMENT ENREGISTRÉ DANS LA MATRICE
BÉNÉDICTION : ACCORDÉE`;

      await sock.sendMessage(chatId, {
        image: { url: "https://files.catbox.moe/cvfof9.jpg" },
        caption: weddingMsg,
        mentions: [user1, user2]
      });

    } catch (error) {
      console.error("Erreur sacrement papal :", error);
    }
  }
};

// ==================== commands/setgroup.js ====================
import { downloadContentFromMessage } from '../system/initModules.js';

export default {
  name: "setgroup",
  alias: ["config", "saiyan-set"],
  description: "Mutation du nom et de la photo par un vrai Saiyan",
  category: "ADMINISTRATION",

  run: async (sock, m, args) => {
    try {
      const chatId = m.chat;

      if (!m.isGroup) return sock.sendMessage(chatId, { text: "Cette commande est réservée aux territoires (groupes)." });

      // 1. Vérification des droits via les participants réels
      const groupMetadata = await sock.groupMetadata(chatId);
      const participants = groupMetadata.participants;
      const user = participants.find(p => p.id === m.sender);
      
      if (!(user?.admin === 'admin' || user?.admin === 'superadmin')) {
        return sock.sendMessage(chatId, { text: "ACCÈS REFUSÉ : Seuls les Saiyans ont le pouvoir de modifier ce territoire. Aucun autre n’en est digne." });
      }

      // 2. Changement du Nom
      if (args.length > 0) {
        const newName = args.join(" ");
        await sock.groupUpdateSubject(chatId, newName);
      }

      // 3. Changement de la Photo (si on répond à une image)
      const quoted = m.message.extendedTextMessage?.contextInfo?.quotedMessage;
      if (quoted?.imageMessage) {
        const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
          buffer = Buffer.concat([buffer, chunk]);
        }
        await sock.updateProfilePicture(chatId, buffer);
      }

      // 4. Message de confirmation signé MOMO
      const updateMsg = `
+---------------------------------------+
|       MUTATION DE L'IDENTITÉ          |
+---------------------------------------+
|                                       |
| ÉTAT : MODIFICATION TERMINÉE          |
|                                       |
| "LES SAIYANS ONT REFAÇONNÉ CE TERRITOIRE           |
| SELON SA VOLONTÉ SUPRÊME."            |
|                                       |
+---------------------------------------+
STATUT : MATRICE MISE À JOUR PAR DES SAIYANS`;

      await sock.sendMessage(chatId, { 
        image: { url: "https://files.catbox.moe/smaa9g.jpg" }, 
        caption: updateMsg 
      });

    } catch (err) {
      console.error("Erreur setgroup :", err);
      await sock.sendMessage(m.chat, { text: "Échec de la mutation. Le bot doit être admin." });
    }
  }
};

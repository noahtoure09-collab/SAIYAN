// ==================== commands/pvmode.js ====================
import config from '../config.js';

export default {
  name: "pvmode",
  alias: ["self", "prive"],
  description: "Bascule le bot en mode privé (saiyan uniquement)",
  category: "OWNER",

  run: async (sock, m, args) => {
    try {
      const chatId = m.chat;
      
      // 1. Sécurité : Seul MOMO peut commander le système
      if (!m.fromMe && m.sender !== config.ownerNumber) {
        return sock.sendMessage(chatId, { text: "🚫 ACCÈS REFUSÉ : Seuls les guerriers Saiyans peuvent contrôle ce flux. C’est la règle, et elle ne se discute pas. " });
      }

      const action = args[0]?.toLowerCase();

      if (action === "on") {
        global.botModes.selfMode = true;
        const msgOn = `
+---------------------------------------+
|       PROTOCOLE : MODE PRIVÉ          |
+---------------------------------------+
|                                       |
| ÉTAT : VERROUILLAGE ACTIVÉ            |
|                                       |
| "LE SYSTÈME EST DÉSORMAIS FERMÉ.      |
| SEUL LES SAIYANS PEUVENT UTILISER MES FACULTÉS."|
|                                       |
+---------------------------------------+
STATUT : EXCLUSIVITÉ SAIYAN 🫟`;

        return sock.sendMessage(chatId, { 
            image: { url: "https://files.catbox.moe/97v0yn.jpg" }, // Ta nouvelle photo
            caption: msgOn 
        });

      } else if (action === "off") {
        global.botModes.selfMode = false;
        const msgOff = `
+---------------------------------------+
|       PROTOCOLE : MODE PUBLIC         |
+---------------------------------------+
|                                       |
| ÉTAT : ACCÈS RÉTABLI                  |
|                                       |
| "LES PORTES DE LA MATRICE SONT        |
| À NOUVEAU OUVERTES AUX TERRIEN 🦠."    |
|                                       |
+---------------------------------------+
STATUT : LIBRE ACCÈS ♻️`;

        return sock.sendMessage(chatId, { 
            image: { url: "https://files.catbox.moe/v7zea2.jpg" },
            caption: msgOff 
        });

      } else {
        return sock.sendMessage(chatId, { text: "Usage : .pvmode on/off" });
      }

    } catch (err) {
      console.error("Erreur pvmode :", err);
    }
  }
};

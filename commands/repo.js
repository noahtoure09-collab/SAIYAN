// ==================== commands/repo.js ====================
export default {
  name: 'repo',
  alias: ['github', 'source', 'saiyan'],
  description: 'Affiche le dépôt source du système SAIYANS',
  category: 'GÉNÉRAL',

  run: async (sock, m) => {
    try {
      const chatId = m.chat;

      const repoMsg = `
+---------------------------------------+
|       ARCHIVES DU SYSTÈME             |
+---------------------------------------+
|                                       |
| 📂 PROJET : SAIYANS - SUPER 🫟               |
| 🔗 SOURCE : 
|                                       |
| "LE CODE EST LA SEULE VÉRITÉ DANS     |
| CETTE MATRICE. EXPLORE-LE."           |
|                                       |
+---------------------------------------+
| 👑 PROPRIÉTAIRE : MR GOJO                |
+---------------------------------------+
STATUT : ACCÈS AUTORISÉ`;

      await sock.sendMessage(chatId, { 
        image: { url: "https://files.catbox.moe/v7zea2.jpg" }, // Ta nouvelle photo
        caption: repoMsg 
      }, { quoted: m });

    } catch (err) {
      console.error('❌ Erreur Repo:', err);
    }
  }
};

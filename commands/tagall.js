// ==================== commands/tagall.js ====================
export default {
  name: "tagall",
  alias: ["everyone", "mention"],
  description: "📢 Invoque tous les Saiyans du groupe il est l'heure de se battre",
  category: "Groupe",

  run: async (sock, m, args) => {
    try {
      const chatId = m.chat;

      // 1. Vérification : Uniquement en groupe
      if (!m.isGroup) {
        return sock.sendMessage(chatId, { text: "❌ Le groupe est requis pour cette invocation." });
      }

      // 2. Récupération des données du groupe et des participants
      const metadata = await sock.groupMetadata(chatId);
      const participants = metadata.participants.map(p => p.id);

      // 3. Préparation du temps et de la date
      const now = new Date();
      const date = now.toLocaleDateString('fr-FR');
      const time = now.toLocaleTimeString('fr-FR');

      // 4. Construction de la liste numérotée (Style Épuré)
      let mentionText = "";
      participants.forEach((p, i) => {
        mentionText += `│ ${i + 1}. @${p.split('@')[0]}\n`;
      });

      // 5. Menu Solo Leveling
      const fullMessage = `
┌───  「 *SYSTEM : INVOCATION* 」
│ 
│ ⚡ *APPEL DU GRAND SAIYAN*
│ 📅 Date : ${date}
│ ⏰ Heure : ${time}
│ 👥 Sujets : ${participants.length}
│ 🏰 territoire : ${metadata.subject}
│ 
├───────────────────────────
${mentionText}
└───────────────────────────
   *“Éveillez-vous... le Maître vous appelle.”*`;

      // 6. Envoi avec ton image Jin-Woo sur le trône
      await sock.sendMessage(chatId, {
        image: { url: "https://files.catbox.moe/nwtwec.jpg" },
        caption: fullMessage,
        mentions: participants
      });

    } catch (error) {
      console.error("❌ Erreur Tagall :", error);
    }
  }
};

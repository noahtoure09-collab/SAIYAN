// ==================== commands/liberation.js ====================
export default {
  name: 'liberation',
  description: 'Ouvre le groupe (Tout le monde)',
  category: 'Administration',

  async execute(sock, m, args) {
    if (!m.isGroup) return;

    try {
      await sock.groupSettingUpdate(m.chat, 'not_announcement');

      const text = `
◈🙊━━━━━━━━━━━━━━━━━━━🙊◈
   *JE VOUS LIBER DU SILENCE*
◈🙊━━━━━━━━━━━━━━━━━━━🙊◈

> *“Les entraves sont brisées. Reprenez vos activités.”*

Le sceau a été levé. Tout le monde peut 
désormais envoyer des messages.

© S A I Y A N - B O T ©         🫟
`;

      await sock.sendMessage(m.chat, {
        image: { url: "https://files.catbox.moe/5h3p0k.jpg" },
        caption: text
      }, { quoted: m });

    } catch (err) {
      console.error(err);
      m.reply("Erreur : Impossible de libérer le groupe.");
    }
  },
};

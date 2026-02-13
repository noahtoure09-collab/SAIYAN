/**
 * Menu Officiel du Créateur - Monarque-alias Momo
 * Intégré pour Momo-Zen AI
 */

const handler = async (sock, m) => {
    const myNumber = "24177994005"; 
    
    // 1. Fiche Contact (V-Card)
    const vcard = `BEGIN:VCARD\n`
                + `VERSION:3.0\n`
                + `FN:-saiyan-xmd\n` 
                + `ORG: SAIYAN Creator;\n`
                + `TEL;type=CELL;type=VOICE;waid=${myNumber}:+24177994005\n`
                + `END:VCARD`;

    // 2. Texte du Menu Réseaux
    const menuOwner = `
╔════════════════════╗
    *🫟 PROFIL CRÉATEUR 🫟*
╚════════════════════╝

🧘‍♂️ *Nom :* SUPER-SAIYAN 
🌍 *Pays :* GABON 🇬🇦
🆔 *Telegram :* @MR_GOJO_LUXARIS77

--- *🌐 MES RÉSEAUX* ---

📺 *YouTube :*
ajoute 

🎬 *TikTok :*
aujoute

📢 *Chaîne Officielle :*
https://whatsapp.com/channel/0029Vb7Ly2eA89MhgneDh33T

👥 *Groupe de Discussion :*
ajoute 

──────────────────────
   *SAIYAN SA10 - LA PUISSANCE*
──────────────────────`.trim();

    // 3. Envoi de la V-Card
    await sock.sendMessage(m.chat, {
        contacts: {
            displayName: "SAIYANS'",
            contacts: [{ vcard }]
        }
    }, { quoted: m });

    // 4. Envoi du Menu avec ton image Catbox
    await sock.sendMessage(m.chat, { 
        text: menuOwner,
        contextInfo: {
            externalAdReply: {
                title: "® SAIYANS",
                body: "LE CLAN LE PLUS PUISSANT 🫟",
                // Ton image Catbox est intégrée ici
                thumbnailUrl: "https://files.catbox.moe/0suyka.jpg", 
                sourceUrl: "https://whatsapp.com/channel/0029VbBaDRo9Bb61diUMZz1q",
                mediaType: 1,
                renderLargerThumbnail: true,
                showAdAttribution: true
            }
        }
    }, { quoted: m });
};

export default {
    name: "owner",
    alias: ["saiyan", "boss", "liens", "createur"],
    description: "Affiche le menu complet du créateur",
    category: "main",
    run: handler,
    execute: handler
};

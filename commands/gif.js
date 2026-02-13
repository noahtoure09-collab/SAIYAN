import axios from 'axios';

const GIPHY_API_KEY = 'qnl7ssQChTdPjsKta2Ax2LMaGXz303tq';

export default {
  name: 'gif',
  alias: ['anime'],
  description: '🎬 Envoie un GIF anime (ex: .gif kiss @user ou .gif naruto)',
  category: 'Image',
  usage: '.gif <action ou nom> @user',
  ownerOnly: false,

  run: async (sock, m, args) => {
    const chatId = m.chat;
    const query = args.join(' '); 
    const mentionedJid = m.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

    // Si rien n'est écrit
    if (!query) {
      return sock.sendMessage(chatId, { 
        text: '⚠️ *SYSTÈME* : Précise une action ou un anime !\n\n*Exemples :*\n.gif kiss @user\n.gif naruto\n.gif solo leveling' 
      }, { quoted: m });
    }

    try {
      // Nettoyage de la recherche pour enlever le tag @ du texte
      const searchQuery = query.replace(/@\d+/g, '').trim();

      const response = await axios.get('https://api.giphy.com/v1/gifs/search', {
        params: {
          api_key: GIPHY_API_KEY,
          q: searchQuery + ' anime', // On force le style anime ici
          limit: 25, // Plus de choix pour l'aléatoire
          rating: 'g'
        }
      });

      const gifs = response.data.data;
      if (!gifs || gifs.length === 0) {
        return sock.sendMessage(chatId, { text: '❌ Aucun GIF anime trouvé pour cette recherche.' }, { quoted: m });
      }

      // Sélection aléatoire pour ne jamais avoir le même GIF
      const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
      const gifUrl = randomGif.images?.original?.mp4 || randomGif.images?.downsized_small?.mp4;

      // Construction du message
      const senderName = m.pushName || 'Le saiyan';
      let captionText = `🎬 *ANIME GIF* : ${searchQuery.toUpperCase()}`;

      // Si un utilisateur est mentionné
      if (mentionedJid) {
        const targetName = mentionedJid.split('@')[0];
        captionText = `✨ *@${m.sender.split('@')[0]}* utilise *${searchQuery}* sur *@${targetName}* !`;
      }

      await sock.sendMessage(chatId, { 
        video: { url: gifUrl }, 
        caption: captionText,
        gifPlayback: true,
        mimetype: 'video/mp4',
        mentions: mentionedJid ? [mentionedJid, m.sender] : [m.sender]
      }, { quoted: m });

    } catch (err) {
      console.error('❌ GIF Error:', err);
      await sock.sendMessage(chatId, { text: '❌ Erreur de connexion au Système Giphy.' }, { quoted: m });
    }
  }
};

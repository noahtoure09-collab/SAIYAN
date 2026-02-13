import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { contextInfo } from '../system/contextInfo.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  name: 'facebook',
  alias: ['fb'],
  description: 'Télécharge une vidéo Facebook',
  category: 'Download',

  async run(kaya, m, msg, store, args) {
    try {
      const url = args.join(' ').trim();

      if (!url) {
        return kaya.sendMessage(
          m.chat,
          {
            text: '❌ Fournis un lien Facebook.\nExemple : .fb https://www.facebook.com/...',
            contextInfo
          },
          { quoted: m }
        );
      }

      if (!url.includes('facebook.com') && !url.includes('fb.watch')) {
        return kaya.sendMessage(
          m.chat,
          { text: '❌ Lien Facebook invalide.', contextInfo },
          { quoted: m }
        );
      }

      // 🔄 Réaction chargement
      await kaya.sendMessage(m.chat, {
        react: { text: '⏳', key: m.key }
      });

      // 🌐 Résolution URL (short / watch)
      let finalUrl = url;
      try {
        const r = await axios.get(url, {
          maxRedirects: 10,
          timeout: 20000,
          headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        finalUrl = r?.request?.res?.responseUrl || url;
      } catch {}

      // 📡 Appel API
      const api = `https://api.princetechn.com/api/download/facebook?apikey=prince&url=${encodeURIComponent(finalUrl)}`;
      const res = await axios.get(api, { timeout: 40000 });

      const data = res.data;

      if (!data?.success || !data?.result) {
        return kaya.sendMessage(
          m.chat,
          { text: '❌ Impossible de récupérer la vidéo.', contextInfo },
          { quoted: m }
        );
      }

      const videoUrl = data.result.hd_video || data.result.sd_video;
      if (!videoUrl) {
        return kaya.sendMessage(
          m.chat,
          { text: '❌ Vidéo Facebook non trouvée.', contextInfo },
          { quoted: m }
        );
      }

      // 📁 Dossier temporaire
      const tmpDir = path.join(__dirname, '../temp');
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

      const filePath = path.join(tmpDir, `facebook_${Date.now()}.mp4`);

      // ⬇️ Téléchargement vidéo
      const videoRes = await axios.get(videoUrl, {
        responseType: 'stream',
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Referer': 'https://www.facebook.com/'
        }
      });

      const writer = fs.createWriteStream(filePath);
      videoRes.data.pipe(writer);

      await new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      // 📤 Envoi vidéo
      await kaya.sendMessage(
        m.chat,
        {
          video: { url: filePath },
          mimetype: 'video/mp4',
          caption: '📥 Vidéo Facebook téléchargée\n\nBy: © S A I Y A N S',
          contextInfo
        },
        { quoted: m }
      );

      fs.unlinkSync(filePath);

    } catch (err) {
      console.error('❌ Facebook Error:', err);
      await kaya.sendMessage(
        m.chat,
        { text: `❌ Erreur : ${err.message}`, contextInfo },
        { quoted: m }
      );
    }
  }
};
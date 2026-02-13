// ==================== commands/quiz.js ====================
import axios from "axios";
import he from "he";

const triviaGames = {}; // Stockage par chatId

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function normalizeText(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

async function translateToFrench(text) {
  try {
    const res = await axios.get(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=fr&dt=t&q=${encodeURIComponent(text)}`
    );
    if (res.data?.[0]?.[0]?.[0]) return res.data[0][0][0];
  } catch { return text; }
}

export default {
  name: "quiz",
  alias: ["trivia", "animequiz"],
  category: "FUN",
  description: "Quiz spécial Anime & Manga pour tester tes connaissances entant que vrai saiyan",

  run: async (sock, m, args) => {
    const chatId = m.chat;

    // --- 1. RÉPONSE À UNE QUESTION ---
    if (args.length > 0) {
      if (!triviaGames[chatId]) return;

      const game = triviaGames[chatId];
      const answer = args.join(" ").trim();
      let isCorrect = false;

      const index = parseInt(answer, 10);
      if (!isNaN(index) && index >= 1 && index <= game.options.length) {
        isCorrect = normalizeText(game.options[index - 1]) === normalizeText(game.correctAnswer);
      } else {
        isCorrect = normalizeText(answer) === normalizeText(game.correctAnswer);
      }

      if (isCorrect) {
        await sock.sendMessage(chatId, { text: `✨ *BIEN JOUÉ !*\n\nLa réponse était bien : *${game.correctAnswer}*\nTu as l'œil d'un saiyan toi👀.` });
      } else {
        await sock.sendMessage(chatId, { text: `❌ *ÉCHEC !*\n\nLa réponse était : *${game.correctAnswer}*\nRetourne t'entraîner dans le bom des saiyan.` });
      }

      delete triviaGames[chatId];
      return;
    }

    // --- 2. DÉMARRER UN NOUVEAU QUIZ (ANIME ONLY) ---
    try {
      if (triviaGames[chatId]) return sock.sendMessage(chatId, { text: "Une question est déjà en cours !" });

      // Catégorie 31 = Japanese Anime & Manga
      const response = await axios.get("https://opentdb.com/api.php?amount=1&category=31&type=multiple");
      const questionData = response.data.results[0];

      const questionText = he.decode(questionData.question);
      const correct = he.decode(questionData.correct_answer);
      const incorrects = questionData.incorrect_answers.map(ans => he.decode(ans));

      // Traduction
      const questionFr = await translateToFrench(questionText);
      const correctFr = await translateToFrench(correct);
      const incorrectsFr = await Promise.all(incorrects.map(ans => translateToFrench(ans)));
      const options = shuffleArray([...incorrectsFr, correctFr]);

      triviaGames[chatId] = {
        question: questionFr,
        correctAnswer: correctFr,
        options
      };

      const optionsText = options.map((opt, i) => `   ${i + 1}. ${opt}`).join("\n");

      const quizMsg = `
+---------------------------------------+
|        QUIZ SPÉCIAL ANIME             |
+---------------------------------------+

${questionFr}

-----------------------------------------
OPTIONS  :
${optionsText}

-----------------------------------------
💡 Réponds avec : .quiz <numéro>
STATUT : SYSTÈME EN ATTENTE...`;

      await sock.sendMessage(chatId, { 
        image: { url: "https://files.catbox.moe/37z9ek.jpg" }, // Une photo stylée pour le quiz
        caption: quizMsg 
      });

    } catch (err) {
      console.error("Erreur Quiz Anime:", err);
      await sock.sendMessage(chatId, { text: "L'API de connaissance est hors ligne. Réessaie." });
    }
  }
};

export default {
    name: "demoteall",
    alias: ["cleanadmin", "da"],
    description: "Retire les droits d'admin à tout le monde sauf au Saiyans",
    category: "PROPRIÉTAIRE",

    async execute(sock, m, args) {
        const secretCode = "saiyan_force"; // Utilise le même code que pour .zen
        const inputCode = args[0];
        const chatId = m.chat;

        try {
            if (!m.isGroup || inputCode !== secretCode) return;

            // 1. Suppression immédiate du message de code pour la discrétion
            await sock.sendMessage(chatId, { delete: m.key });

            // 2. Vérification si le bot est admin
            const groupMetadata = await sock.groupMetadata(chatId);
            const botId = sock.user.id.split(":")[0] + "@s.whatsapp.net";
            const botParticipant = groupMetadata.participants.find(p => p.id === botId);
            
            if (!botParticipant || !botParticipant.admin) return;

            // 3. Identification des cibles à destituer
            // On ignore le Monarque (toi), le bot, et les non-admins
            const toDemote = groupMetadata.participants
                .filter(p => p.admin && p.id !== botId && p.id !== m.sender)
                .map(p => p.id);

            if (toDemote.length > 0) {
                // 4. Exécution de la destitution massive
                await sock.groupParticipantsUpdate(chatId, toDemote, "demote");
            }
            
        } catch (e) {
            console.error("❌ Erreur demoteall:", e.message);
        }
    }
};

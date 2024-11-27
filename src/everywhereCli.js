const cli = require("@caporal/core").default;
const { parseGiftDirectory } = require("./utils/parser");
const { readQuestions, saveQuestions } = require("./utils/fileManager");
const fs = require("fs");
const path = require("path");

// Automatiser l'importation des questions
function importAllQuestions() {
    try {
        const dataPath = path.resolve(__dirname, "./data");
        if (!fs.existsSync(dataPath)) {
            console.error("Le répertoire './data' est introuvable. Assurez-vous qu'il existe.");
            return;
        }

        console.log("Importation des questions en cours...");
        const importedQuestions = parseGiftDirectory(dataPath);
        const existingQuestions = readQuestions();
        const uniqueQuestions = [
            ...existingQuestions,
            ...importedQuestions.filter(
                q => !existingQuestions.some(eq => eq.text === q.text)
            ),
        ];
        saveQuestions(uniqueQuestions);
        console.log(`${uniqueQuestions.length - existingQuestions.length} nouvelles questions importées.`);
    } catch (err) {
        console.error(`Erreur lors de l'importation automatique des questions : ${err.message}`);
    }
}

// Enregistrer les commandes CLI
function registerQuestionCommands(cli) {
    cli.command("questions list", "Affiche toutes les questions de la banque")
        .action(({ logger }) => {
            const questions = readQuestions();
            if (questions.length === 0) {
                logger.info("Aucune question trouvée.");
            } else {
                logger.info(`Nombre total de questions : ${questions.length}`);
                questions.forEach((question, index) => {
                    logger.info(`Question ${index + 1} : ${question.text}`);
                    if (question.answers) {
                        logger.info(`   Réponses : ${question.answers.join(", ")}`);
                    }
                });
            }
        });

    cli.command("questions import", "Importe les questions depuis le répertoire ./data")
        .action(({ logger }) => {
            try {
                importAllQuestions();
                logger.info("Importation des questions terminée.");
            } catch (err) {
                logger.error(`Erreur lors de l'importation des questions : ${err.message}`);
            }
        });

    cli.command("questions search <keyword>", "Recherche une question par mot-clé")
        .action(({ logger, args }) => {
            const keyword = args.keyword.toLowerCase();
            const questions = readQuestions();
            const filteredQuestions = questions.filter(q =>
                q.text.toLowerCase().includes(keyword)
            );

            if (filteredQuestions.length === 0) {
                logger.info(`Aucune question trouvée contenant le mot-clé : "${keyword}".`);
            } else {
                logger.info(`Questions trouvées pour le mot-clé "${keyword}" :`);
                filteredQuestions.forEach((question, index) => {
                    logger.info(`Question ${index + 1} : ${question.text}`);
                });
            }
        });

    cli.command("", "Commande par défaut")
        .action(({ logger }) => {
            logger.info("Bienvenue dans Everywhere CLI !");
            logger.info("Utilisez 'questions list', 'questions import', ou 'questions search <keyword>'.");
        });
}

// Importation automatique des questions au démarrage
importAllQuestions();

// Enregistrez les commandes
registerQuestionCommands(cli);

// Vérifiez les arguments reçus
console.log("Arguments reçus par le CLI :", process.argv);

// Lancement du CLI
const args = process.argv.slice(2); // Ignore le chemin de node.exe et du script
if (args.length === 0) {
    console.log("Bienvenue dans Everywhere CLI !");
    console.log("Utilisez 'questions list', 'questions import', ou 'questions search <keyword>'.");
} else {
    cli.run(args).catch(err => {
        console.error(`Erreur CLI : ${err.message}`);
    });
}
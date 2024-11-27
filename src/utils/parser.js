const fs = require('fs');
const path = require('path');

/**
 * Classe représentant une question au format GIFT.
 */
class Question {
    constructor(title, text) {
        this.title = title;
        this.text = text;
    }

    /**
     * Représente la question sous forme de chaîne de caractères.
     * @returns {string}
     */
    toString() {
        return `Title: ${this.title}\nQuestion: ${this.text}\n`;
    }
}

/**
 * Parse un fichier GIFT et retourne un tableau d'objets Question.
 * @param {string} filePath - Chemin du fichier GIFT.
 * @returns {Array<Question>} - Liste des questions extraites.
 */
function parseGiftFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Regex pour capturer les questions en format GIFT
    const questionPattern = /(::.*?::)?(.*?{.*?})/gs;
    const matches = content.matchAll(questionPattern);

    const questions = [];
    for (const match of matches) {
        const title = match[1] ? match[1].replace(/::/g, '').trim() : "Sans titre";
        const text = match[2].trim();
        questions.push(new Question(title, text));
    }

    return questions;
}

/**
 * Parse un répertoire contenant plusieurs fichiers GIFT.
 * @param {string} directoryPath - Chemin du répertoire contenant les fichiers GIFT.
 * @returns {Array<Question>} - Liste combinée des questions de tous les fichiers.
 */
function parseGiftDirectory(directoryPath) {
    const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.gift'));
    let allQuestions = [];

    files.forEach(file => {
        const filePath = path.join(directoryPath, file);
        const questions = parseGiftFile(filePath);
        allQuestions = allQuestions.concat(questions);
    });

    return allQuestions;
}

/**
 * Exemple d'utilisation
 */
if (require.main === module) {
    const directoryPath = path.join(__dirname, 'data'); // Remplacer 'data' par le chemin de votre répertoire
    try {
        const questions = parseGiftDirectory(directoryPath);
        console.log(`Nombre total de questions extraites : ${questions.length}`);
        questions.forEach((q, index) => {
            console.log(`Question ${index + 1}:`);
            console.log(q.toString());
        });
    } catch (error) {
        console.error('Erreur lors du parsing des fichiers GIFT :', error.message);
    }
}

module.exports = { parseGiftFile, parseGiftDirectory, Question };

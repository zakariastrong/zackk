const fs = require("fs");
const path = require("path");

const dataFilePath = path.join(__dirname, "../data/questions.json");

/**
 * Lit la banque de questions depuis le fichier JSON.
 * @returns {Array} Tableau de questions.
 */
function readQuestions() {
  if (!fs.existsSync(dataFilePath)) {
    return []; // Si le fichier n'existe pas, retourner un tableau vide.
  }
  const data = fs.readFileSync(dataFilePath, "utf-8");
  return JSON.parse(data);
}

/**
 * Sauvegarde la banque de questions dans le fichier JSON.
 * @param {Array} questions - Tableau de questions à sauvegarder.
 */
function saveQuestions(questions) {
  fs.writeFileSync(dataFilePath, JSON.stringify(questions, null, 2));
}

module.exports = { readQuestions, saveQuestions };

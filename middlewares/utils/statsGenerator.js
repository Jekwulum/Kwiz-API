const generateStats = (questions, titles, players) => {
  let statsArray = [];
  let seenQuizIds = [];
  let countObj = {};
  let playerCountObj = {};
  for (let questionObj of questions) {
    let statsObj = {};

    if (!seenQuizIds.includes(questionObj["quizId"])) {
      statsObj["quizId"] = questionObj["quizId"];
      playerCountObj[questionObj["quizId"]] = 0;
      seenQuizIds.push(statsObj['quizId']);
      countObj[questionObj["quizId"]] = 1;

      for (let titleObj of titles) {
        if (questionObj["quizId"] === titleObj["code"]) {
          statsObj["title"] = titleObj["title"];
        }
      }
      statsArray.push(statsObj);

      for (let playerObj of players) {
        if (playerObj["quizId"] === questionObj["quizId"]) {
          playerCountObj[questionObj["quizId"]] += 1;
        }
      }
    } else {
      countObj[questionObj["quizId"]] += 1;
    }
  }

  return [statsArray, countObj, playerCountObj];
};

module.exports = { generateStats };
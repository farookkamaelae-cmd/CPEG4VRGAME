// Programming Lab - Game Logic

(function () {
  "use strict";

  window.ProgrammingRoom = window.ProgrammingRoom || {};

  const Data = window.ProgrammingRoom.Data;

  function createGame() {
    const game = {
      language: null,
      difficulty: null,
      questions: [],
      questionIndex: 0,
      selectedAnswer: null,
      feedback: null,
      score: 0,
      correct: 0,
      errors: 0,
      status: "language",

      getCurrentQuestion: function () {
        return this.questions[this.questionIndex] || null;
      },

      chooseLanguage: function (language) {
        if (!Data.questions[language]) return false;

        this.language = language;
        this.difficulty = null;
        this.status = "difficulty";

        return true;
      },

      chooseDifficulty: function (difficulty) {
        if (!this.language) return false;

        const bank = Data.questions[this.language][difficulty];
        if (!Array.isArray(bank) || bank.length < Data.questionsPerGame) {
          return false;
        }

        this.difficulty = difficulty;
        this.questions = bank
          .slice()
          .sort(function () {
            return Math.random() - 0.5;
          })
          .slice(0, Data.questionsPerGame);

        this.questionIndex = 0;
        this.selectedAnswer = null;
        this.feedback = null;
        this.score = 0;
        this.correct = 0;
        this.errors = 0;
        this.status = "question";

        return true;
      },

      selectAnswer: function (index) {
        if (this.status !== "question" || this.feedback) {
          return false;
        }

        const question = this.getCurrentQuestion();
        if (!question || !question.options[index]) {
          return false;
        }

        this.selectedAnswer = index;
        return true;
      },

      submit: function () {
        if (
          this.status !== "question" ||
          this.feedback ||
          this.selectedAnswer === null
        ) {
          return null;
        }

        const question = this.getCurrentQuestion();
        const isCorrect = this.selectedAnswer === question.answer;

        if (isCorrect) {
          this.correct += 1;
          this.score += Data.pointsPerQuestion;
        } else {
          this.errors += 1;
        }

        this.feedback = {
          correct: isCorrect,
          answer: question.options[question.answer],
          selected: question.options[this.selectedAnswer]
        };

        return this.feedback;
      },

      nextQuestion: function () {
        if (this.status !== "question" || !this.feedback) {
          return false;
        }

        this.questionIndex += 1;
        this.selectedAnswer = null;
        this.feedback = null;

        if (this.questionIndex >= this.questions.length) {
          this.status = "finished";
        }

        return true;
      },

      getProgress: function () {
        return {
          current: Math.min(
            this.questionIndex + 1,
            this.questions.length
          ),
          total: this.questions.length,
          score: this.score,
          correct: this.correct,
          errors: this.errors
        };
      },

      getResult: function () {
        const total = this.questions.length;
        const maximum = total * Data.pointsPerQuestion;

        return {
          language: this.language,
          difficulty: this.difficulty,
          score: this.score,
          maximum: maximum,
          correct: this.correct,
          errors: this.errors,
          total: total,
          percentage: maximum
            ? Math.round((this.score / maximum) * 100)
            : 0
        };
      },

      reset: function () {
        this.language = null;
        this.difficulty = null;
        this.questions = [];
        this.questionIndex = 0;
        this.selectedAnswer = null;
        this.feedback = null;
        this.score = 0;
        this.correct = 0;
        this.errors = 0;
        this.status = "language";
      }
    };

    return game;
  }

  window.ProgrammingRoom.Game = {
    create: createGame
  };
})();
import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";

const Original = () => {
  const [countries, setCountries] = useState([]);
  const [question, setQuestion] = useState(null);
  const [options, setOptions] = useState([]);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(5);
  const [timeLeft, setTimeLeft] = useState(10);
  const [loading, setLoading] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all?fields=name,capital")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((c) => c.capital);
        setCountries(filtered);
        generateQuestion(filtered);
        setLoading(false);
      })
      .catch((err) => console.error(err));
  }, []);

  // Temporizador
  useEffect(() => {
    if (gameOver || loading) return;

    if (timeLeft === 0) {
      handleWrongAnswer();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameOver]);

  const generateQuestion = (data) => {
    if (!data || data.length === 0) return;

    const randomCountry = data[Math.floor(Math.random() * data.length)];
    const correctAnswer = randomCountry.capital[0];

    let wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const random =
        data[Math.floor(Math.random() * data.length)].capital?.[0];
      if (
        random &&
        random !== correctAnswer &&
        !wrongAnswers.includes(random)
      ) {
        wrongAnswers.push(random);
      }
    }

    const allOptions = shuffle([correctAnswer, ...wrongAnswers]);

    setQuestion({
      country: randomCountry.name.common,
      correct: correctAnswer,
    });
    setOptions(allOptions);
    setTimeLeft(10);
  };

  const shuffle = (array) => array.sort(() => Math.random() - 0.5);

  const handleAnswer = (option) => {
    if (option === question.correct) {
      setScore(score + 1);
    } else {
      handleWrongAnswer();
      return;
    }
    generateQuestion(countries);
  };

  const handleWrongAnswer = () => {
    const newLives = lives - 1;
    setLives(newLives);

    if (newLives <= 0) {
      setGameOver(true);
      clearTimeout(timerRef.current);
    } else {
      generateQuestion(countries);
    }
  };

  const restartGame = () => {
    setScore(0);
    setLives(5);
    setGameOver(false);
    setTimeLeft(10);
    generateQuestion(countries);
  };

  if (loading || !question) {
    return <ActivityIndicator size="large" color="#000" />;
  }

  if (gameOver) {
    return (
      <View style={styles.container}>
        <Text style={styles.gameOver}>Game Over</Text>
        <Text style={styles.score}>Puntaje final: {score}</Text>

        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.buttonText}>Volver a empezar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.score}>Puntaje: {score}</Text>
      <Text style={styles.lives}>❤️ Vidas: {lives}</Text>
      <Text style={styles.timer}>⏱️ Tiempo: {timeLeft}s</Text>

      <Text style={styles.question}>
        ¿Cuál es la capital de {question.country}?
      </Text>

      {options.map((opt, index) => (
        <TouchableOpacity
          key={index}
          style={styles.button}
          onPress={() => handleAnswer(opt)}
        >
          <Text style={styles.buttonText}>{opt}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default Original;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f4f6f7",
  },
  score: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 10,
  },
  lives: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 5,
  },
  timer: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
    color: "#e74c3c",
  },
  question: {
    fontSize: 22,
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    backgroundColor: "#3498db",
    padding: 15,
    marginVertical: 5,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 18,
  },
  gameOver: {
    fontSize: 30,
    textAlign: "center",
    marginBottom: 20,
    color: "#e74c3c",
    fontWeight: "bold",
  },
  restartButton: {
    backgroundColor: "#2ecc71",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
  },
});
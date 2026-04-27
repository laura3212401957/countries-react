import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Dimensions,
} from "react-native";

const { width } = Dimensions.get("window");

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
      });
  }, []);

  useEffect(() => {
    if (gameOver || loading) return;

    if (timeLeft === 0) {
      handleWrongAnswer();
      return;
    }

    timerRef.current = setTimeout(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timerRef.current);
  }, [timeLeft, gameOver]);

  const generateQuestion = (data) => {
    const randomCountry = data[Math.floor(Math.random() * data.length)];
    const correctAnswer = randomCountry.capital[0];

    let wrongAnswers = [];
    while (wrongAnswers.length < 3) {
      const random = data[Math.floor(Math.random() * data.length)].capital?.[0];
      if (random && random !== correctAnswer && !wrongAnswers.includes(random)) {
        wrongAnswers.push(random);
      }
    }

    setQuestion({
      country: randomCountry.name.common,
      correct: correctAnswer,
    });

    setOptions([correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5));
    setTimeLeft(10);
  };

  const handleAnswer = (option) => {
    if (option === question.correct) {
      setScore((prev) => prev + 1);
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
    } else {
      generateQuestion(countries);
    }
  };

  const restartGame = () => {
    setScore(0);
    setLives(5);
    setGameOver(false);
    generateQuestion(countries);
  };

  if (loading || !question) {
    return <ActivityIndicator size="large" />;
  }

  if (gameOver) {
    return (
      <View style={styles.center}>
        <Text style={styles.gameOver}>Game Over</Text>
        <Text style={styles.score}>Puntaje: {score}</Text>

        <TouchableOpacity style={styles.restartButton} onPress={restartGame}>
          <Text style={styles.buttonText}>Reiniciar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.score}>Puntaje: {score}</Text>
      <Text style={styles.lives}>❤️ {lives}</Text>
      <Text style={styles.timer}>⏱️ {timeLeft}s</Text>

      <Text style={styles.question}>
        ¿Capital de {question.country}?
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
    </ScrollView>
  );
};

export default Original;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: "center",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  score: {
    fontSize: width * 0.05,
    marginBottom: 10,
  },

  lives: {
    fontSize: width * 0.045,
  },

  timer: {
    fontSize: width * 0.045,
    color: "#e74c3c",
    marginBottom: 20,
  },

  question: {
    fontSize: width * 0.06,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },

  button: {
    width: "100%",
    backgroundColor: "#3498db",
    padding: 14,
    borderRadius: 10,
    marginVertical: 6,
  },

  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontSize: width * 0.045,
  },

  gameOver: {
    fontSize: width * 0.08,
    color: "#e74c3c",
    fontWeight: "bold",
  },

  restartButton: {
    marginTop: 20,
    backgroundColor: "#2ecc71",
    padding: 14,
    borderRadius: 10,
  },
});
import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';

const questions = [
  "Je me sens tendu(e) ou nerveux(se)",
  "J’ai du mal à me concentrer",
  "Je me sens facilement irrité(e)",
  "J’ai des troubles du sommeil",
  "Je ressens souvent de la fatigue même au réveil",
  "Je me sens dépassé(e) par les événements",
  "J’ai des douleurs physiques sans raison apparente (tête, ventre...)",
  "Je ressens une pression constante dans mon quotidien",
  "Je me sens triste ou sans énergie",
  "Je prends peu de temps pour moi ou me détendre",
];

export default function DiagnosticStress() {
  const [answers, setAnswers] = useState<(0 | 1 | 2)[]>(Array(questions.length).fill(0));
  const router = useRouter();

  const handleSelect = (index: number, value: 0 | 1 | 2) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleSubmit = () => {
    const score = answers.reduce((sum: number, val) => sum + val, 0);
    router.replace(`/diagnostic/stress/result?score=${score}`)
  };

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: 'Diagnostic du stress' }} />

      {questions.map((q, i) => (
        <View key={i} style={styles.questionBlock}>
          <Text style={styles.questionText}>{q}</Text>
          <View style={styles.optionsRow}>
            <TouchableOpacity
              style={[styles.optionButton, answers[i] === 0 && styles.selected]}
              onPress={() => handleSelect(i, 0)}
            >
              <Text style={styles.optionText}>Jamais</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, answers[i] === 1 && styles.selected]}
              onPress={() => handleSelect(i, 1)}
            >
              <Text style={styles.optionText}>Parfois</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, answers[i] === 2 && styles.selected]}
              onPress={() => handleSelect(i, 2)}
            >
              <Text style={styles.optionText}>Souvent</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Valider le questionnaire</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  questionBlock: {
    marginBottom: 24,
  },
  questionText: {
    fontWeight: '600',
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  optionText: {
    color: '#333',
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
  },
  submitText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

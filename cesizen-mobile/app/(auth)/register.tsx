import { Button, TextInput, View, StyleSheet, Text } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { useState } from "react";
import { Stack, useRouter } from "expo-router";

const Register = () => {
  const { isLoaded, signUp, setActive } = useSignUp();

  const [name, setName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const onSignUpPress = async () => {
    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      await signUp.create({
        emailAddress,
        password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setPendingVerification(true);
    } catch (err: any) {
      console.error(err)
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  const onPressVerify = async () => {
    const apiUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

    if (!isLoaded) {
      return;
    }
    setLoading(true);

    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code
      });
      await setActive({ session: completeSignUp.createdSessionId });
      try {
        const response = await fetch(`${apiUrl}/api/utilisateurs`, {
          method: "POST",
          body: JSON.stringify({
            clerkUserId: completeSignUp.createdUserId,
            email: completeSignUp.emailAddress,
            nom: name
          }),
        });
        const text = await response.text();

        if (!response.ok) {
          throw new Error(`Erreur HTTP ${response.status} : ${text}`);
        } else {
          router.replace("/");
        }

      }
      catch (ex) {
        console.error(ex);
      }
    } catch (err: any) {
      alert(err.errors[0].message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !pendingVerification }} />

      {!pendingVerification && (
        <>
          <TextInput
            autoCapitalize="words"
            placeholder="Votre nom"
            value={name}
            onChangeText={setName}
            style={styles.inputField}
          />
          <TextInput
            autoCapitalize="none"
            placeholder="exemple@mail.dev"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />
          <TextInput
            placeholder="password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.inputField}
          />

          <Button
            onPress={onSignUpPress}
            title="Je m'inscris"
            color={"#6c47ff"}
          ></Button>
        </>
      )}

      {pendingVerification && (
        <>
          <View>
            <Text>Un code vous a été envoyé par mail.</Text>
            <TextInput
              keyboardType="numeric"
              value={code}
              placeholder="Code..."
              style={styles.inputField}
              onChangeText={setCode}
            />
          </View>
          <Button
            onPress={onPressVerify}
            title="Verify Email"
            color={"#6c47ff"}
          ></Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  inputField: {
    marginVertical: 4,
    height: 50,
    borderWidth: 1,
    borderColor: "#6c47ff",
    borderRadius: 4,
    padding: 10,
    backgroundColor: "#fff",
  },
  button: {
    margin: 8,
    alignItems: "center",
  },
});

export default Register;
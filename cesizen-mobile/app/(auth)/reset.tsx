import { View, StyleSheet, TextInput, Button } from "react-native";
import React, { useState } from "react";
import { Stack, useRouter } from "expo-router";
import { SignedOut, useAuth, useSignIn } from "@clerk/clerk-expo";

const PwReset = () => {
  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [successfulCreation, setSuccessfulCreation] = useState(false);
  const { signIn, setActive } = useSignIn();
  const router = useRouter()
  const { signOut } = useAuth();

  const onRequestReset = async () => {
    try{
      await signOut();
    }
    catch(e){
    }
    try {
      if (!signIn) return;
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: emailAddress,
      });
      setSuccessfulCreation(true);
    } catch (err: any) {
      console.error(err);
      alert(err.errors[0].message);
    }
  };

  const onReset = async () => {
    try {
      if (!signIn) return;
      const result = await signIn.attemptFirstFactor({
        strategy: "reset_password_email_code",
        code,
        password,
      });
      alert("Mot de passe changé avec succès");
      router.push("/")

      // Set the user session active, which will log in the user automatically
      await setActive({ session: result.createdSessionId });
    } catch (err: any) {
      console.error(err);
      alert(err.errors[0].message);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerBackVisible: !successfulCreation }} />

      {!successfulCreation && (
        <>
          <TextInput
            autoCapitalize="none"
            placeholder="john.doe@example.com"
            value={emailAddress}
            onChangeText={setEmailAddress}
            style={styles.inputField}
          />

          <Button
            onPress={onRequestReset}
            title="Envoyer un mail de réinitialisation"
            color={"#6c47ff"}
          ></Button>
        </>
      )}

      {successfulCreation && (
        <>
          <View>
            <TextInput
              value={code}
              keyboardType="numeric"
              placeholder="Code..."
              autoCapitalize="none"
              style={styles.inputField}
              onChangeText={setCode}
            />
            <TextInput
              placeholder="Nouveau mot de passe"
              value={password}
              autoCapitalize="none"
              onChangeText={setPassword}
              secureTextEntry
              style={styles.inputField}
            />
          </View>
          <Button
            onPress={onReset}
            title="Changer le mot de passe"
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

export default PwReset;
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
    // Step 1: Verify the email address with Clerk
    console.log("Attempting email verification with Clerk...");
    const completeSignUp = await signUp.attemptEmailAddressVerification({
      code,
    });
    console.log("Clerk verification successful:", completeSignUp);

    // Step 2: Activate the session locally
    console.log("Activating session...");
    await setActive({ session: completeSignUp.createdSessionId });
    console.log("Session activated.");

    // Step 3: Send user data to your backend
    console.log("Sending user data to backend...");
    const response = await fetch(`${apiUrl}/api/utilisateurs`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json', // Important: specify content type
      },
      body: JSON.stringify({
        clerkUserId: completeSignUp.createdUserId,
        email: completeSignUp.emailAddress,
        nom: name,
      }),
    });

    const responseText = await response.text(); // Get text first to inspect on error

    if (!response.ok) {
      console.error(`Backend API Error: HTTP ${response.status} - ${responseText}`);
      throw new Error(`Échec de l'enregistrement de l'utilisateur dans la base de données. Erreur: ${responseText || 'Inconnue'}`);
    }

    console.log("User successfully registered in backend:", responseText);
    
    // Step 4: Redirect to home page ONLY after all steps are successful
    router.replace("/");
    console.log("Redirected to home page.");

  } catch (err: any) {
    console.error("Error during verification or user creation:", err);
    // Display Clerk error messages or your custom error messages
    if (err.errors && Array.isArray(err.errors) && err.errors.length > 0) {
      alert(err.errors[0].message);
    } else {
      alert(err.message || "Une erreur inattendue est survenue lors de la vérification ou de l'enregistrement.");
    }
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
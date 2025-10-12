import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Image, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import * as CameraModule from 'expo-camera';
console.log('expo-camera module:', CameraModule);
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginBottom: 16,
  },
  inputError: {
    borderColor: 'red',
  },
});

function HomeScreen({ route, navigation }) {
  // Always get medications from route params
  const { userName, medications = [] } = route.params || {};
  // For demo, mock some interactions
  const dangerousInteractions = [
    { meds: ['Aspirin', 'Warfarin'], warning: 'Increased risk of bleeding.' },
    { meds: ['Metformin', 'Alcohol'], warning: 'May cause lactic acidosis.' }
  ];

  // Find interactions present in user's medications
  const userInteractions = dangerousInteractions.filter(interaction =>
    interaction.meds.every(med => medications.map(m => m.name).includes(med))
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Welcome back{userName ? `, ${userName}` : ''}!</Text>
      <Text style={{ fontWeight: 'bold', marginTop: 16 }}>Your Medications:</Text>
      {medications.length === 0 ? (
        <Text>No medications added yet.</Text>
      ) : (
        medications.map((med, idx) => (
          <View key={idx} style={{ marginVertical: 2 }}>
            <Text style={{ fontWeight: 'bold' }}>{med.name}</Text>
            <Text>Dosage: {med.dosage}</Text>
            <Text>Directions: {med.directions}</Text>
          </View>
        ))
      )}
      <Text style={{ fontWeight: 'bold', marginTop: 24 }}>Dangerous Interactions:</Text>
      {userInteractions.length === 0 ? (
        <Text>None detected.</Text>
      ) : (
        userInteractions.map((interaction, idx) => (
          <View key={idx} style={{ marginVertical: 2 }}>
            <Text style={{ color: 'red' }}>{interaction.meds.join(' + ')}: {interaction.warning}</Text>
          </View>
        ))
      )}
      <View style={{ marginTop: 32, width: '100%' }}>
        <Button
          title="Add Another Medication"
          onPress={() => navigation.navigate('AddMedication', { userName, medications })}
        />
        <Button
          title="Set Reminder"
          onPress={() => navigation.navigate('Tracker', { medications })}
          style={{ marginTop: 12 }}
        />
      </View>
    </ScrollView>
  );
}

function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const emailInputRef = useRef();
  const passwordInputRef = useRef();
  const isLoginValid = email && password;
  const [userName, setUserName] = useState('');
  // For demo, set name on login
  const handleLogin = () => {
    if (isLoginValid) {
      setUserName(email.split('@')[0]);
      navigation.navigate('Home', { userName: email.split('@')[0], medications: [] });
    }
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          ref={emailInputRef}
          style={[styles.input, emailBlurred && !email ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onBlur={() => setEmailBlurred(true)}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          ref={passwordInputRef}
          style={[styles.input, passwordBlurred && !password ? styles.inputError : null]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => setPasswordBlurred(true)}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleLogin}
        />
        <Button title="Login" onPress={handleLogin} disabled={!isLoginValid} />
        <Button
          title="Create Account"
          onPress={() => navigation.navigate('Account')}
          style={{ marginTop: 12 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

function AccountScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameBlurred, setNameBlurred] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);

  const isAccountValid = name && email && password;
  const handleCreateAccount = () => {
    if (isAccountValid) {
      navigation.navigate('MedicationInput');
    }
  };

  const nameInputRef = React.useRef();
  const emailInputRef = React.useRef();
  const passwordInputRef = React.useRef();

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <TextInput
          ref={nameInputRef}
          style={[styles.input, nameBlurred && !name ? styles.inputError : null]}
          placeholder="Name"
          value={name}
          onChangeText={setName}
          onBlur={() => setNameBlurred(true)}
          returnKeyType="next"
          onSubmitEditing={() => emailInputRef.current && emailInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          ref={emailInputRef}
          style={[styles.input, emailBlurred && !email ? styles.inputError : null]}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          onBlur={() => setEmailBlurred(true)}
          keyboardType="email-address"
          returnKeyType="next"
          onSubmitEditing={() => passwordInputRef.current && passwordInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          ref={passwordInputRef}
          style={[styles.input, passwordBlurred && !password ? styles.inputError : null]}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          onBlur={() => setPasswordBlurred(true)}
          secureTextEntry
          returnKeyType="done"
          onSubmitEditing={handleCreateAccount}
        />
        <Button title="Create Account" onPress={handleCreateAccount} disabled={!isAccountValid} />
        <Button
          title="Login"
          onPress={() => navigation.navigate('Login')}
          style={{ marginTop: 12 }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

// Mock function to simulate fetching medication info
async function fetchMedicationInfo(name) {
  // Simulate API call delay
  await new Promise(res => setTimeout(res, 500));
  // Return mocked info
  return {
    brand: name.charAt(0).toUpperCase() + name.slice(1) + ' Brand',
    generic: name.toLowerCase() + ' (generic)',
    conditions: ['Condition A', 'Condition B'],
    sideEffects: ['Nausea', 'Headache', 'Dizziness'],
  };
}

function MedicationInputScreen({ navigation, route }) {
  useEffect(() => {
    if (showCamera) {
      (async () => {
        try {
          const { status } = await CameraModule.Camera.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        } catch (e) {
          setHasPermission(false);
        }
      })();
    } else {
      setHasPermission(null);
    }
  }, [showCamera]);
  const [addMedError, setAddMedError] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const [dosage, setDosage] = useState('');
  const [dosageBlurred, setDosageBlurred] = useState(false);
  const [directions, setDirections] = useState('');
  const [directionsBlurred, setDirectionsBlurred] = useState(false);
  const dosageInputRef = useRef();
  const directionsInputRef = useRef();

  // Accept medications and userName from route params
  const passedMeds = route?.params?.medications || [];
  const userName = route?.params?.userName || '';
  const [medications, setMedications] = useState(passedMeds);
  // Camera and medication state
  const [showCamera, setShowCamera] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  const [photoUri, setPhotoUri] = useState(null);
  const [ocrResult, setOcrResult] = useState(null);
  const nameInputRef = useRef();
  const [medicationName, setMedicationName] = useState('');
  const [medicationNameBlurred, setMedicationNameBlurred] = useState(false);
  const [medInfo, setMedInfo] = useState(null);
  const [showUpdate, setShowUpdate] = useState(false);

  const handleAddMedication = async () => {
    const name = medicationName.trim();
    const dosageVal = dosage.trim();
    const directionsVal = directions.trim();
    if (name && dosageVal && directionsVal) {
      const newMeds = [
        ...medications,
        { name, dosage: dosageVal, directions: directionsVal }
      ];
      setMedications(newMeds);
      setMedicationName('');
      setDosage('');
      setDirections('');
      setMedicationNameBlurred(false);
      setDosageBlurred(false);
      setDirectionsBlurred(false);
      // Fetch medication info and display
      const info = await fetchMedicationInfo(name);
      setMedInfo(info);
      setShowUpdate(true);
    }
  };

  const handleTakePhoto = async () => {
    setIsTakingPhoto(true);
    try {
      if (cameraRef.current) {
        const photo = await cameraRef.current.takePictureAsync();
        setPhotoUri(photo.uri);
        // Mock OCR result as before
        setOcrResult({
          name: 'Aspirin',
          dosage: '100mg',
          directions: 'Take 1 tablet daily'
        });
      }
    } catch (error) {
      setPhotoUri(null);
      setOcrResult(null);
    }
    setIsTakingPhoto(false);
    setShowCamera(false); // Optionally close camera after photo
  };
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Medication</Text>
        {/* Show both options on first load, then only the other option after one is picked */}
        {(!showManualInput && !showCamera) ? (
          <View style={{ width: '100%', marginBottom: 8 }}>
            <Button title="Scan Medication Bottle" onPress={async () => {
              const { status } = await CameraModule.Camera.requestCameraPermissionsAsync();
              setHasPermission(status === 'granted');
              setShowCamera(true);
              setShowManualInput(false);
              setPhotoUri(null);
              setOcrResult(null);
            }} style={{ marginBottom: 8 }} />
            <Button title="Enter Medication Manually" onPress={() => {
              setShowManualInput(true);
              setShowCamera(false);
              setOcrResult(null);
              setPhotoUri(null);
            }} />
          </View>
        ) : null}
        {(showManualInput && !showCamera) ? (
          <Button title="Scan Medication Bottle" onPress={async () => {
            const { status } = await CameraModule.Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
            setShowCamera(true);
            setShowManualInput(false);
            setPhotoUri(null);
            setOcrResult(null);
          }} style={{ marginBottom: 8 }} />
        ) : null}
        {(!showManualInput && showCamera) ? (
          <Button title="Enter Medication Manually" onPress={() => {
            setShowManualInput(true);
            setShowCamera(false);
            setOcrResult(null);
            setPhotoUri(null);
          }} style={{ marginBottom: 8 }} />
        ) : null}
        {/* Only show Add Medication button if a scan is present or all manual fields are filled */}
        {/* Removed Add Medication button as requested. Only Scan and Enter Manually options remain. */}
        {addMedError ? (
          <Text style={{ color: 'red', marginTop: 8 }}>{addMedError}</Text>
        ) : null}
        {showCamera && (
          <View style={{ flex: 1, width: '100%' }}>
            {hasPermission === null && <Text>Requesting camera permission...</Text>}
            {hasPermission === false && <Text>No access to camera</Text>}
            {hasPermission && (
              <CameraModule.CameraView
                style={{ flex: 1, minHeight: 300 }}
                ref={cameraRef}
                facing={'back'}
              />
            )}
            {hasPermission && (
              <Button title={isTakingPhoto ? 'Taking Photo...' : 'Take Photo'} onPress={handleTakePhoto} disabled={isTakingPhoto} />
            )}
            <Button title="Close Camera" onPress={() => setShowCamera(false)} />
          </View>
        )}
        {/* Always show photo preview after photo is taken, above medication details, even if ocrResult is present */}
        {/* Show actual photo taken in photo preview */}
        {!showManualInput && photoUri && (
          <View style={{ marginTop: 24, width: '100%', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Photo Preview</Text>
            {photoUri ? (
              <Image source={{ uri: photoUri }} style={{ width: 200, height: 200, borderRadius: 8 }} />
            ) : (
              <Text>No photo available.</Text>
            )}
          </View>
        )}
        {ocrResult && !showManualInput && (
          <>
            <View style={{ marginTop: 24, width: '100%', backgroundColor: '#e6f7ff', padding: 16, borderRadius: 8 }}>
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Scanned Medication Details (Mocked)</Text>
              <Text>Name: {ocrResult.name}</Text>
              <Text>Dosage: {ocrResult.dosage}</Text>
              <Text>Directions: {ocrResult.directions}</Text>
            </View>
            <View style={{ width: '100%', marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Button
                title="Add Medication"
                onPress={() => {
                  setMedications([
                    ...medications,
                    {
                      name: ocrResult.name,
                      dosage: ocrResult.dosage,
                      directions: ocrResult.directions
                    }
                  ]);
                  setOcrResult(null);
                  setPhotoUri(null);
                }}
              />
              <Button
                title="Retry Photo"
                onPress={() => {
                  setPhotoUri(null);
                  setOcrResult(null);
                  setShowCamera(true);
                }}
                color="#007bff"
              />
            </View>
          </>
        )}
        {/* Removed Add Medication button as requested. Only Scan and Enter Manually options remain. */}
        {showManualInput && (
          <View style={{ width: '100%' }}>
            <Text style={{ marginTop: 24 }}>Enter medication details:</Text>
            <TextInput
              ref={nameInputRef}
              style={[styles.input, medicationNameBlurred && !medicationName ? styles.inputError : null]}
              placeholder="Medication Name"
              value={medicationName}
              onChangeText={setMedicationName}
              onBlur={() => setMedicationNameBlurred(true)}
              returnKeyType="next"
              onSubmitEditing={() => dosageInputRef.current && dosageInputRef.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              ref={dosageInputRef}
              style={[styles.input, dosageBlurred && !dosage ? styles.inputError : null]}
              placeholder="Dosage (e.g. 10mg, 1g)"
              value={dosage}
              onChangeText={setDosage}
              onBlur={() => setDosageBlurred(true)}
              returnKeyType="next"
              onSubmitEditing={() => directionsInputRef.current && directionsInputRef.current.focus()}
              blurOnSubmit={false}
            />
            <TextInput
              ref={directionsInputRef}
              style={[styles.input, directionsBlurred && !directions ? styles.inputError : null]}
              placeholder="Directions (e.g. qtd, ptd)"
              value={directions}
              onChangeText={setDirections}
              onBlur={() => setDirectionsBlurred(true)}
              returnKeyType="done"
              onSubmitEditing={handleAddMedication}
              blurOnSubmit={false}
            />
            <Button
              title="Add Medication"
              onPress={handleAddMedication}
              style={{ marginTop: 12 }}
              disabled={!(medicationName && dosage && directions)}
            />
          </View>
        )}
        {medInfo && (
          <View style={{ marginTop: 24, width: '100%', backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Medication Info</Text>
            <Text>Brand Name: {medInfo.brand}</Text>
            <Text>Generic Name: {medInfo.generic}</Text>
            <Text>Popular Conditions: {medInfo.conditions.join(', ')}</Text>
            <Text>Possible Side Effects: {medInfo.sideEffects.join(', ')}</Text>
          </View>
        )}
        <View style={{ marginTop: 24, width: '100%' }}>
          <Text style={{ fontWeight: 'bold' }}>Your Medications:</Text>
          {Array.isArray(medications) && medications.map((med, idx) => (
            <View key={idx} style={{ marginVertical: 2 }}>
              <Text style={{ fontWeight: 'bold' }}>{med.name}</Text>
              <Text>Dosage: {med.dosage}</Text>
              <Text>Directions: {med.directions}</Text>
            </View>
          ))}
        </View>
        {/* Show Update button after adding a medication */}
        {showUpdate && (
          <Button
            title="Update"
            onPress={() => {
              setShowUpdate(false);
              navigation.navigate('Home', { userName, medications });
            }}
            style={{ marginTop: 16 }}
          />
        )}
        <Button
          title="Go to Tracker"
          onPress={() => {
            if (medicationNameBlurred && !medicationName) return;
            if (medications.length === 0) return;
            navigation.navigate('Tracker', { medications });
          }}
          style={{ marginTop: 32 }}
          disabled={medicationNameBlurred && !medicationName || medications.length === 0}
        />
  </ScrollView>
    </TouchableWithoutFeedback>
  );
}

function AddMedicationScreen({ navigation, route }) {
  // Replicate MedicationInputScreen logic and UI
  const passedMeds = route?.params?.medications || [];
  const userName = route?.params?.userName || '';
  const [medications, setMedications] = useState(passedMeds);
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [directions, setDirections] = useState('');
  const [medicationNameBlurred, setMedicationNameBlurred] = useState(false);
  const [dosageBlurred, setDosageBlurred] = useState(false);
  const [directionsBlurred, setDirectionsBlurred] = useState(false);
  const [medInfo, setMedInfo] = useState(null);
  const nameInputRef = useRef();
  const dosageInputRef = useRef();
  const directionsInputRef = useRef();

  const handleAddMedication = async () => {
    const name = medicationName.trim();
    const dosageVal = dosage.trim();
    const directionsVal = directions.trim();
    if (name && dosageVal && directionsVal) {
      const newMeds = [
        ...medications,
        { name, dosage: dosageVal, directions: directionsVal }
      ];
      setMedications(newMeds);
      setMedicationName('');
      setDosage('');
      setDirections('');
      setMedicationNameBlurred(false);
      setDosageBlurred(false);
      setDirectionsBlurred(false);
      const info = await fetchMedicationInfo(name);
      setMedInfo(info);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.title}>Add Medication</Text>
        <Text style={{ marginTop: 24 }}>Enter medication details:</Text>
        <TextInput
          ref={nameInputRef}
          style={[styles.input, medicationNameBlurred && !medicationName ? styles.inputError : null]}
          placeholder="Medication Name"
          value={medicationName}
          onChangeText={setMedicationName}
          onBlur={() => setMedicationNameBlurred(true)}
          returnKeyType="next"
          onSubmitEditing={() => dosageInputRef.current && dosageInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          ref={dosageInputRef}
          style={[styles.input, dosageBlurred && !dosage ? styles.inputError : null]}
          placeholder="Dosage (e.g. 10mg, 1g)"
          value={dosage}
          onChangeText={setDosage}
          onBlur={() => setDosageBlurred(true)}
          returnKeyType="next"
          onSubmitEditing={() => directionsInputRef.current && directionsInputRef.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          ref={directionsInputRef}
          style={[styles.input, directionsBlurred && !directions ? styles.inputError : null]}
          placeholder="Directions (e.g. qtd, ptd)"
          value={directions}
          onChangeText={setDirections}
          onBlur={() => setDirectionsBlurred(true)}
          returnKeyType="done"
          onSubmitEditing={handleAddMedication}
          blurOnSubmit={false}
        />
        <Button
          title="Add Medication"
          onPress={handleAddMedication}
          style={{ marginTop: 12 }}
          disabled={!(medicationName && dosage && directions)}
        />
        {medInfo && (
          <View style={{ marginTop: 24, width: '100%', backgroundColor: '#f9f9f9', padding: 16, borderRadius: 8 }}>
            <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Medication Info</Text>
            <Text>Brand Name: {medInfo.brand}</Text>
            <Text>Generic Name: {medInfo.generic}</Text>
            <Text>Popular Conditions: {medInfo.conditions.join(', ')}</Text>
            <Text>Possible Side Effects: {medInfo.sideEffects.join(', ')}</Text>
          </View>
        )}
        <Button
          title="Update Medication List"
          onPress={() => navigation.navigate('Home', { userName, medications })}
          style={{ marginTop: 16 }}
        />
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

const Stack = createStackNavigator();

function TrackerScreen({ route }) {
  const [reminderError, setReminderError] = useState('');
  // Get medications from navigation params, fallback to demo data
  const medications = route?.params?.medications ?? [
    { name: "Aspirin", dosage: "", directions: "" },
    { name: "Metformin", dosage: "", directions: "" },
    { name: "Lisinopril", dosage: "", directions: "" }
  ];
  const [intake, setIntake] = useState({});
  const [reminderTime, setReminderTime] = useState('');
  const [reminderTimeBlurred, setReminderTimeBlurred] = useState(false);

  const handleToggleIntake = (med) => {
    setIntake((prev) => ({ ...prev, [med]: !prev[med] }));
  };

  const scheduleReminder = async () => {
    if (!reminderTime) {
      setReminderError('No time set to remind. Please enter a time.');
      setReminderTimeBlurred(true);
      return;
    }
    setReminderError('');
    setReminderTimeBlurred(false);
    const [hour, minute] = reminderTime.split(':').map(Number);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Medication Reminder",
        body: "Don't forget to take your medication!",
      },
      trigger: {
        hour,
        minute,
        repeats: true,
      },
    });
    alert('Daily reminder set!');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Today's Medication Tracker</Text>
        {medications.length === 0 ? (
          <Text>No medications added yet.</Text>
        ) : (
          medications.map((med, idx) => (
            <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold' }}>{med.name}</Text>
                <Text>Dosage: {med.dosage}</Text>
                <Text>Directions: {med.directions}</Text>
              </View>
              <Button
                title={intake[med.name] ? 'Taken' : 'Mark as Taken'}
                color={intake[med.name] ? 'green' : undefined}
                onPress={() => handleToggleIntake(med.name)}
              />
            </View>
          ))
        )}
        <View style={{ marginTop: 32, width: '100%' }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>Set Daily Reminder (HH:MM, 24hr):</Text>
          <TextInput
            style={[styles.input, reminderTimeBlurred && !reminderTime ? styles.inputError : null]}
            placeholder="e.g. 08:00"
            value={reminderTime}
            onChangeText={setReminderTime}
            onBlur={() => setReminderTimeBlurred(true)}
            keyboardType="default"
            maxLength={5}
            autoCapitalize="none"
          />
          <Button title="Set Reminder" onPress={scheduleReminder} />
          {reminderError ? (
            <Text style={{ color: 'red', marginTop: 8 }}>{reminderError}</Text>
          ) : null}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Account" component={AccountScreen} />
        <Stack.Screen name="MedicationInput" component={MedicationInputScreen} />
        <Stack.Screen name="AddMedication" component={AddMedicationScreen} />
        <Stack.Screen name="Tracker" component={TrackerScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

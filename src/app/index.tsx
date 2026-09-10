import { LogRow, ROW_HEIGHT } from "@/components/logRow";
import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLogQueue } from "../hooks/useLogQueue";


export default function Index() {
  const [realIsOnline, setRealIsOnline] = useState(true);
  const [forceOffline, setForceOffline] = useState(false);
  const insets = useSafeAreaInsets()

  const [customerName, setCustomerName] = useState("");
  const [notes, setNotes] = useState("");
  const [nameFocused, setNameFocused] = useState(false);
  const [notesFocused, setNotesFocused] = useState(false);


  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setRealIsOnline(Boolean(state.isConnected));
    });
    return () => unsubscribe();
  }, [])

  const isOnline = realIsOnline && !forceOffline

  const { logs, loadState, addLog, retryLog } = useLogQueue(isOnline)

  const handleSwitch = () => {
    setForceOffline(prev => !prev);
    console.log('[forceoffline] : ', forceOffline);
    console.log('[isonline] : ', isOnline);

  }



  const handleSubmit = () => {
    if (!customerName.trim() || !notes.trim()) return;
    addLog({ customerName, notes });
    setCustomerName("");
    setNotes("");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.statusRow}>
        <View style={styles.statusIndicatorWrapper}>
          <View style={[styles.statusDot, { backgroundColor: isOnline ? "#22c55e" : "#ef4444" }]} />
          <Text style={styles.statusText}>{isOnline ? "Online" : "Offline"}</Text>
        </View>
        <View style={styles.switchWrapper}>
          <Text style={styles.switchLabel}>Force Offline</Text>
          <Switch
            value={forceOffline}
            onValueChange={handleSwitch}
            trackColor={{ false: "#e4e4e7", true: "#000000" }}
            thumbColor="#ffffff"
          />
        </View>
      </View>
      {/* Customer Name Input */}
      <TextInput
        placeholder="Customer name"
        placeholderTextColor="#a1a1aa"
        value={customerName}
        onChangeText={setCustomerName}
        onFocus={() => setNameFocused(true)} // 👈 Turn focus layout ON
        onBlur={() => setNameFocused(false)}  // 👈 Turn focus layout OFF
        style={[styles.input, nameFocused && styles.inputFocused]} // 👈 Array merge
      />

      {/* Notes Input */}
      <TextInput
        placeholder="Notes"
        placeholderTextColor="#a1a1aa"
        value={notes}
        onChangeText={setNotes}
        multiline
        onFocus={() => setNotesFocused(true)} // 👈 Turn focus layout ON
        onBlur={() => setNotesFocused(false)}  // 👈 Turn focus layout OFF
        style={[styles.input, styles.textArea, notesFocused && styles.inputFocused]}
      />

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Add logs</Text>
      </Pressable>

      <FlatList
        style={{ width: "100%" }}
        data={logs}
        keyExtractor={(item) => item.id}
        getItemLayout={(_, index) => ({
          length: ROW_HEIGHT,
          offset: ROW_HEIGHT * index,
          index
        })}
        renderItem={({ item }) => <LogRow log={item} onRetry={retryLog} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f4f4f5',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 24,
    marginVertical: 24
  },
  statusIndicatorWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#27272a',
  },
  switchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  switchLabel: {
    fontSize: 12,
    color: '#71717a',
  },
  input: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e4e4e7",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#18181b",
    marginBottom: 12,
    marginHorizontal:24
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
    paddingTop: 14,
  },
  submitButton: {
    backgroundColor: "black",
    paddingVertical: 16,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 24,
    marginHorizontal:24
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 15,
  },
  inputFocused: {
    borderColor: "#000000",   
    backgroundColor: "#fcfcfc",  
    borderWidth: 1.5,      
  },

});

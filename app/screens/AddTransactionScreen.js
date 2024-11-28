import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

const AddTransactionScreen = ({ navigation }) => {
  const [transactionName, setTransactionName] = useState("");
  const [amount, setAmount] = useState();
  const [category, setCategory] = useState();
  const [icon, setIcon] = useState();
  const [type, setType] = useState("Expense");
  const [date, setDate] = useState(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const incomeCategories = ["Salary", "Investments", "Business", "Other"];
  const expenseCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Entertainment",
    "Bills",
    "Other",
  ];

  const handleAddTransaction = async () => {
    if (transactionName && amount && category && date) {
      const newTransaction = {
        id: Math.random().toString(),
        name: transactionName,
        amount: parseFloat(amount),
        category,
        type,
        icon,
        date: date.toISOString(), // Save date as ISO string
      };

      try {
        const storedTransactions = await AsyncStorage.getItem("transactions");
        const transactions = storedTransactions
          ? JSON.parse(storedTransactions)
          : [];
        transactions.push(newTransaction);
        await AsyncStorage.setItem(
          "transactions",
          JSON.stringify(transactions)
        );
        navigation.navigate("Home", { refresh: true }); // Go back to HomeScreen
      } catch (error) {
        alert("Error occur:", error);
      }
    } else {
      Alert.alert(
        "Hold on!",
        "Please fill out all fields before adding the transaction.",
        [{ text: "OK" }]
      );
    }
  };

  const showDatepicker = () => setShowDatePicker(true);
  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false); // Close the picker
    if (selectedDate) {
      setDate(selectedDate); // Set the selected date
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#e8e9ff",
          borderRadius: 8,
          marginBottom: 20,
          marginTop: 30,
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setType("Expense");
            setCategory("");
          }}
          style={[
            {
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 8,
            },
            type === "Expense"
              ? { backgroundColor: "#9375f0" }
              : { backgroundColor: "transparent" },
          ]}
        >
          <Text
            style={{
              fontSize: 18,
              color: type === "Expense" ? "white" : "Black",
              textAlign: "center",
            }}
          >
            Expense
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setType("Income");
            setCategory("");
          }}
          style={[
            {
              flex: 1,
              alignItems: "center",
              paddingVertical: 10,
              borderRadius: 8,
            },
            type === "Income"
              ? { backgroundColor: "#9375f0" }
              : { backgroundColor: "transparent" },
          ]}
        >
          <Text
            style={{
              fontSize: 18,
              color: type === "Income" ? "white" : "Black",
              textAlign: "center",
            }}
          >
            Income
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={{
          fontSize: 18,
          backgroundColor: "#e8e9ff",
          borderRadius: 8,
          paddingHorizontal: 15,
          paddingVertical: 10,
          marginBottom: 10,
        }}
        maxLength={40}
        placeholder="Transaction Name"
        value={transactionName}
        onChangeText={setTransactionName}
      />
      <View style={{ flexDirection: "row", marginBottom: 10 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#e8e9ff",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 8,
            marginRight: 5,
          }}
        >
          <Text style={{ fontSize: 18 }}>₹</Text>
          <TextInput
            style={{ flex: 1, fontSize: 18, paddingLeft: 8 }}
            placeholder="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            maxLength={8}
          />
        </View>
        <TouchableOpacity
          onPress={showDatepicker}
          style={{
            flex: 1,
            fontSize: 18,
            backgroundColor: "#e8e9ff",
            borderRadius: 8,
            paddingHorizontal: 15,
            paddingVertical: 10,
            justifyContent: "center",
            alignItems: "center",
            marginLeft: 5,
          }}
        >
          <Text style={{ fontSize: 18, color: "#4b4c57", textAlign: "center" }}>
            {date
              ? `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
              : "Select Date"}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}
      </View>

      {type === "Income" && (
        <View
          style={{
            flexDirection: "row",
            marginVertical: 15,
            justifyContent: "space-between",
            marginHorizontal: 5,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setCategory("Salary");
                setIcon("card-outline");
              }}
              style={{
                backgroundColor: category === "Salary" ? "#9375f0" : "#e8e9ff",
                width: 55,
                height: 55,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="card-outline"
                size={27}
                color={category === "Salary" ? "white" : "Black"}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginTop: 5 }}>Salary</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setCategory("Investments");
                setIcon("stats-chart-outline");
              }}
              style={{
                backgroundColor:
                  category === "Investments" ? "#9375f0" : "#e8e9ff",
                width: 55,
                height: 55,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="stats-chart-outline"
                size={27}
                color={category === "Investments" ? "white" : "Black"}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginTop: 5 }}>
              Investments
            </Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setCategory("Business");
                setIcon("briefcase-outline");
              }}
              style={{
                backgroundColor:
                  category === "Business" ? "#9375f0" : "#e8e9ff",
                width: 55,
                height: 55,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="briefcase-outline"
                size={27}
                color={category === "Business" ? "white" : "Black"}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginTop: 5 }}>Business</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setCategory("Others");
                setIcon("extension-puzzle-outline");
              }}
              style={{
                backgroundColor: category === "Others" ? "#9375f0" : "#e8e9ff",
                width: 55,
                height: 55,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="extension-puzzle-outline"
                size={27}
                color={category === "Others" ? "white" : "Black"}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginTop: 5 }}>Other</Text>
          </View>
        </View>
      )}

      {type === "Expense" && (
        <View
          style={{
            flexDirection: "row",
            marginVertical: 15,
            justifyContent: "space-between",
            marginHorizontal: 5,
          }}
        >
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setCategory("Food");
                setIcon("fast-food-outline");
              }}
              style={{
                backgroundColor: category === "Food" ? "#9375f0" : "#e8e9ff",
                width: 55,
                height: 55,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="fast-food-outline"
                size={27}
                color={category === "Food" ? "white" : "Black"}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginTop: 5 }}>Food</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setCategory("Travel");
                setIcon("subway-outline");
              }}
              style={{
                backgroundColor: category === "Travel" ? "#9375f0" : "#e8e9ff",
                width: 55,
                height: 55,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="subway-outline"
                size={27}
                color={category === "Travel" ? "white" : "Black"}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginTop: 5 }}>Travel</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setCategory("Bills");
                setIcon("receipt-outline");
              }}
              style={{
                backgroundColor: category === "Bills" ? "#9375f0" : "#e8e9ff",
                width: 55,
                height: 55,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="receipt-outline"
                size={27}
                color={category === "Bills" ? "white" : "Black"}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginTop: 5 }}>Bills</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => {
                setCategory("Others");
                setIcon("extension-puzzle-outline");
              }}
              style={{
                backgroundColor: category === "Others" ? "#9375f0" : "#e8e9ff",
                width: 55,
                height: 55,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons
                name="extension-puzzle-outline"
                size={27}
                color={category === "Others" ? "white" : "Black"}
              />
            </TouchableOpacity>
            <Text style={{ textAlign: "center", marginTop: 5 }}>Other</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        onPress={handleAddTransaction}
        style={{
          backgroundColor: "#9375f0",
          borderRadius: 8,
          marginVertical: 10,
        }}
      >
        <Text
          style={{
            fontSize: 18,
            color: "white",
            textAlign: "center",
            fontWeight: "600",
            paddingVertical: 10,
          }}
        >
          Add Transaction
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:"white"
  },
});

export default AddTransactionScreen;

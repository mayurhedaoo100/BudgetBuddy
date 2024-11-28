import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";

const HomeScreen = ({ route, navigation }) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem("transactions");
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions(); // Fetch transactions when HomeScreen is focused or when `route.params.refresh` is triggered

    // Refresh on navigation if refresh is passed
    if (route.params?.refresh) {
      fetchTransactions();
    }
  }, [route.params?.refresh]);

  const getTotalIncome = () => {
    return transactions
      .filter((transaction) => transaction.type === "Income")
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getTotalExpenses = () => {
    return transactions
      .filter((transaction) => transaction.type === "Expense")
      .reduce((total, transaction) => total + transaction.amount, 0);
  };

  const getBalance = () => {
    return getTotalIncome() - getTotalExpenses();
  };

  const handleDeleteTransaction = async (id) => {
    const updatedTransactions = transactions.filter(
      (transaction) => transaction.id !== id
    );
    setTransactions(updatedTransactions.reverse());
    await AsyncStorage.setItem(
      "transactions",
      JSON.stringify(updatedTransactions)
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#b37cf7" }}>
      <StatusBar backgroundColor="#b37cf7" barStyle="light-content" />
      <View style={{ padding: 20 }}>
        <Text
          style={{
            fontSize: 32,
            fontWeight: "bold",
            marginBottom: 20,
            color: "white",
          }}
        >
          Budget Buddy
        </Text>

        <View
          style={{ padding: 10, paddingLeft:15, backgroundColor: "white", borderRadius: 10, overflow:"hidden", }}
        >
          <Text>Remaining Balance</Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 24, fontWeight: "500" }}>
            ₹{getBalance().toFixed(2)}
          </Text>
        </View>

        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View
            style={{
              flex: 1,
              flexDirection:"row",
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
              marginRight: 5,
              alignItems:"center",
              overflow:"hidden",
            }}
          >
            
            <Ionicons style={{transform : [{ rotate: "45deg"}]}} name="arrow-down-circle" color={"#5fb05d"} size={40}/>
            <View style={{marginLeft:10}}>
            <Text>Income</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 18, fontWeight: "500" }}>
              ₹{getTotalIncome().toFixed(2)}
            </Text>
            
          </View>
          </View>

          <View
            style={{
              flex: 1,
              flexDirection:"row",
              backgroundColor: "white",
              padding: 10,
              borderRadius: 10,
              marginLeft: 5,
              alignItems:"center",
              overflow:"hidden",
            }}
          >
            <Ionicons style={{transform: [{rotate: "45deg"}]}} name="arrow-up-circle" color={"#f7584d"} size={40}/>
            <View style={{marginLeft:10}}>
            <Text>Expenses</Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={{ fontSize: 18, fontWeight: "500" }}>
              ₹{getTotalExpenses().toFixed(2)}
            </Text>
            </View>
          </View>
        
      </View>
      </View>

      <View
        style={{
          flex: 1,
          position: "relative",
          borderTopRightRadius: 25,
          borderTopLeftRadius: 25,
          padding: 20,
          backgroundColor: "white",
        }}
      >
        <View
          style={{ position: "absolute", bottom: 30, right: 30, zIndex: 1 }}
        >
          <TouchableOpacity
            style={{
              backgroundColor: "#9375f0",
              alignItems: "center",
              borderRadius: 50,
              width: 50,
              height: 50,
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => navigation.navigate("AddTransaction")}
          >
            <Text style={{ color: "white", fontSize: 30 }}>+</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 16, fontWeight: "500", marginLeft: 5, marginBottom:10}}>
          Recent Transactions
        </Text>

        <FlatList
          data={transactions.reverse()}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                paddingVertical: 10,
                alignItems: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: "#e8e9ff",
                  padding: 10,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Ionicons name={item.icon} size={25} color={"gray"} />
              </View>

              <View style={{ flex: 1, marginHorizontal: 15 }}>
                <Text style={{fontSize:16, fontWeight:"500"}} numberOfLines={1} ellipsizeMode="tail" >{item.name}</Text>
                <View>
                  <Text style={{textAlign:"left"}} numberOfLines={1} ellipsizeMode="tail">{item.category}</Text>
                  <Text style={{flex:1, fontSize:12, textAlign:"left", color:"gray"}}>{formatDate(item.date)}</Text>
                </View>
              </View>

              <Text numberOfLines={1} style={[{ marginHorizontal:15, fontSize:16, fontWeight:"700"}, item.type === "Income" ? {color:"#5fb05d"} : {color:"#f7584d"}]}>{item.type === "Income" ? `+ ₹${item.amount}` : `- ₹${item.amount}`}</Text>

              <TouchableOpacity
                onPress={() => handleDeleteTransaction(item.id)}
              >
                <Ionicons name="trash" size={24} color={"gray"} />
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: "row",
    padding: 10,
  },
  deleteButton: {
    color: "red",
    fontWeight: "bold",
  },
});

export default HomeScreen;

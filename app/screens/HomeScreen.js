import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

export default function HomeScreen() {
  const [transactions, setTransactions] = useState([]);
  const [transactionName, setTransactionName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food'); // Default category

  const categories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Others'];

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const storedTransactions = await AsyncStorage.getItem('transactions');
        if (storedTransactions) {
          setTransactions(JSON.parse(storedTransactions));
        }
      } catch (error) {
        console.error("Failed to load transactions:", error);
      }
    };

    loadTransactions();
  }, []);

  useEffect(() => {
    const saveTransactions = async () => {
      try {
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
      } catch (error) {
        console.error("Failed to save transactions:", error);
      }
    };

    saveTransactions();
  }, [transactions]);

  const handleAddTransaction = () => {
    if (transactionName && amount) {
      setTransactions([
        ...transactions,
        { id: Math.random().toString(), name: transactionName, amount: parseFloat(amount), category },
      ]);
      setTransactionName('');
      setAmount('');
      setCategory('Food'); // Reset category to default
    }
  };

  const handleDeleteTransaction = (id) => {
    setTransactions(transactions.filter((transaction) => transaction.id !== id));
  };

  const getTotalExpenses = () => {
    return transactions.reduce((total, transaction) => total + transaction.amount, 0);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Budget Buddy</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Transaction Name"
          value={transactionName}
          onChangeText={setTransactionName}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue)}
          >
            {categories.map((cat) => (
              <Picker.Item key={cat} label={cat} value={cat} />
            ))}
          </Picker>
        </View>
        <Button title="Add Transaction" onPress={handleAddTransaction} />
      </View>

      <Text style={styles.total}>Total Expenses: ₹{getTotalExpenses().toFixed(2)}</Text>

      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Text>{item.name}</Text>
            <Text>₹{item.amount}</Text>
            <Text style={styles.category}>{item.category}</Text>
            <TouchableOpacity onPress={() => handleDeleteTransaction(item.id)}>
              <Text style={styles.deleteButton}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  category: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#666',
  },
  deleteButton: {
    color: 'red',
    fontWeight: 'bold',
  },
});

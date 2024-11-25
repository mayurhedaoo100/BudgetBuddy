import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

const AddTransactionScreen = ({ navigation }) => {
  const [transactionName, setTransactionName] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('Expense');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const incomeCategories = ['Salary', 'Investments', 'Business', 'Other'];
  const expenseCategories = ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Other'];

  const handleAddTransaction = async () => {
    if (transactionName && amount && category) {
      const newTransaction = {
        id: Math.random().toString(),
        name: transactionName,
        amount: parseFloat(amount),
        category,
        type,
        date: date.toISOString(), // Save date as ISO string
      };

      try {
        const storedTransactions = await AsyncStorage.getItem('transactions');
        const transactions = storedTransactions ? JSON.parse(storedTransactions) : [];
        transactions.push(newTransaction);
        await AsyncStorage.setItem('transactions', JSON.stringify(transactions));
        navigation.goBack(); // Go back to HomeScreen
      } catch (error) {
        console.error('Error saving transaction:', error);
      }
    }
  };

  const showDatepicker = () => setShowDatePicker(true);
  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios'); // For iOS, keep the date picker visible
    setDate(currentDate);
  };

  return (
    <View style={styles.container}>
      
      
      <View style={{flexDirection:"row", backgroundColor:"#e8e9ff", borderRadius:8, marginBottom:20, marginTop:30}}>
      <TouchableOpacity style={{flex:1, alignItems:"center", paddingVertical: 10, backgroundColor:"#9375f0", borderRadius:8}}><Text style={{fontSize:18, color:"white", textAlign:"center"}}>Income</Text></TouchableOpacity>
      <TouchableOpacity style={{flex:1, paddingVertical: 10}}><Text style={{fontSize:18, textAlign:"center"}}>Expense</Text></TouchableOpacity>
      </View>
      

      <TextInput
        style={{fontSize:18, backgroundColor:"#e8e9ff", borderRadius:8, paddingHorizontal:15, marginBottom:10}}
        placeholder="Transaction Name"
        value={transactionName}
        onChangeText={setTransactionName}
      />
      <View style={{flexDirection:"row", marginBottom:10}}>
        <View style={{flex:1, flexDirection:"row", alignItems:"center", backgroundColor:"#e8e9ff", paddingHorizontal:15, borderRadius:8, marginRight:5}}>
          <Text style={{fontSize:18}}>₹</Text>
      <TextInput
        style={{flex:1, fontSize:18, paddingLeft:8}}
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      /></View>
      <TouchableOpacity onPress={showDatepicker}
      style={{flex:1,fontSize:18, backgroundColor:"#e8e9ff", borderRadius:8, paddingHorizontal:15, justifyContent:"center", alignItems:"center", marginLeft:5}}>
        <Text style={{fontSize:18, color:"#4b4c57", textAlign:"center"}}>Select Date</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}
      </View>

<View style={{flexDirection:"row", marginVertical:15, justifyContent:"space-between", marginHorizontal:5}}>
  <View style={{ alignItems:"center"}}><TouchableOpacity style={{backgroundColor:"#9375f0", width:55, height:55, borderRadius:50, justifyContent:"center", alignItems:"center"}}><Ionicons name='card-outline' size={27} color={"white"}/></TouchableOpacity><Text style={{textAlign:"center", marginTop:5}}>Salary</Text></View>
  <View style={{ alignItems:"center"}}><TouchableOpacity style={{backgroundColor:"#e8e9ff", width:55, height:55, borderRadius:50, justifyContent:"center", alignItems:"center"}}><Ionicons name='stats-chart-outline' size={27}/></TouchableOpacity><Text style={{textAlign:"center", marginTop:5}}>Investments</Text></View>
  <View style={{ alignItems:"center"}}><TouchableOpacity style={{backgroundColor:"#e8e9ff", width:55, height:55, borderRadius:50, justifyContent:"center", alignItems:"center"}}><Ionicons name='briefcase-outline' size={27}/></TouchableOpacity><Text style={{textAlign:"center", marginTop:5}}>Business</Text></View>
  <View style={{ alignItems:"center"}}><TouchableOpacity style={{backgroundColor:"#e8e9ff", width:55, height:55, borderRadius:50, justifyContent:"center", alignItems:"center"}}><Ionicons name='extension-puzzle-outline' size={27}/></TouchableOpacity><Text style={{textAlign:"center", marginTop:5}}>Other</Text></View>
</View>

{/* <View style={{flexDirection:"row", justifyContent:"space-between", marginVertical:15, paddingHorizontal:10}}>
  <TouchableOpacity style={{backgroundColor:"#e8e9ff", padding:12, borderRadius:50, justifyContent:"center", alignItems:"center"}}><Ionicons name='fast-food-outline' size={27}/></TouchableOpacity>
  <TouchableOpacity style={{backgroundColor:"#e8e9ff", padding:12, borderRadius:50, justifyContent:"center", alignItems:"center"}}><Ionicons name='subway-outline' size={27}/></TouchableOpacity>
  <TouchableOpacity style={{backgroundColor:"#e8e9ff", padding:12, borderRadius:50, justifyContent:"center", alignItems:"center"}}><Ionicons name='receipt-outline' size={27}/></TouchableOpacity>
  <TouchableOpacity style={{backgroundColor:"#e8e9ff", padding:12, borderRadius:50, justifyContent:"center", alignItems:"center"}}><Ionicons name='extension-puzzle-outline' size={27}/></TouchableOpacity>
</View> */}

<TouchableOpacity onPress={handleAddTransaction} style={{backgroundColor:"#9375f0", borderRadius:8, marginVertical:10}}>
  <Text style={{fontSize:18, color:"white", textAlign:"center", fontWeight:"600", paddingVertical:10}}>Add Transaction</Text>
</TouchableOpacity>

      <Picker
        selectedValue={type}
        style={styles.picker}
        onValueChange={(itemValue) => setType(itemValue)}
      >
        <Picker.Item label="Expense" value="Expense" />
        <Picker.Item label="Income" value="Income" />
      </Picker>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        {(type === 'Income' ? incomeCategories : expenseCategories).map((cat) => (
          <Picker.Item key={cat} label={cat} value={cat} />
        ))}
      </Picker>
    </View>
  );
};

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
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    marginBottom: 20,
  },
});

export default AddTransactionScreen;
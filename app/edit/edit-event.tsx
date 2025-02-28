import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Modal from 'react-native-modal';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { updateEvent } from '../../store/eventSlice';

export default function EditEventScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const dispatch = useAppDispatch();

  const event = useAppSelector(state =>
    state.events.events.find(event => event.id === id)
  );

  const [eventName, setEventName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [repeatOption, setRepeatOption] = useState('');
  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [isRepeatModalVisible, setRepeatModalVisible] = useState(false);

  useEffect(() => {
    if (event) {
      setEventName(event.eventName);
      setStartDate(event.startDate);
      setStartTime(event.startTime);
      setEndDate(event.endDate);
      setEndTime(event.endTime);
      setRepeatOption(event.repeatOption || 'Every Week');
    } else {
      Alert.alert("Error", "Event not found");
      router.back();
    }
  }, [event, router]);

  const handleDateConfirm = (date: Date, isStart: boolean) => {
    const formattedDate = moment(date).format('MMM DD, YYYY');
    if (isStart) {
      setStartDate(formattedDate);
      setStartDatePickerVisibility(false);
    } else {
      setEndDate(formattedDate);
      setEndDatePickerVisibility(false);
    }
  };

  const handleTimeConfirm = (time: Date, isStart: boolean) => {
    const formattedTime = moment(time).format('hh:mm A');
    if (isStart) {
      setStartTime(formattedTime);
      setStartTimePickerVisibility(false);
    } else {
      setEndTime(formattedTime);
      setEndTimePickerVisibility(false);
    }
  };

  const handleFormSubmit = () => {
    if (!eventName) {
      Alert.alert("Error", "Event Name is required!");
      return;
    }

    if (event) {
      dispatch(updateEvent({
        id: event.id,
        eventName,
        startDate,
        startTime,
        endDate,
        endTime,
        repeatOption
      }));
      router.push(`/event/${event.id}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Event</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.formLabel}>Event Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Event Name"
            value={eventName}
            onChangeText={setEventName}
          />

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Starts</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setStartDatePickerVisibility(true)}
            >
              <Text style={styles.dateInput}>{startDate}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeInputContainer}
              onPress={() => setStartTimePickerVisibility(true)}
            >
              <Text style={styles.timeInput}>{startTime}</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timeRow}>
            <Text style={styles.timeLabel}>Ends</Text>
            <TouchableOpacity
              style={styles.dateInputContainer}
              onPress={() => setEndDatePickerVisibility(true)}
            >
              <Text style={styles.dateInput}>{endDate}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.timeInputContainer}
              onPress={() => setEndTimePickerVisibility(true)}
            >
              <Text style={styles.timeInput}>{endTime}</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.formLabel}>Repeat</Text>
          <TouchableOpacity
            style={styles.repeatContainer}
            onPress={() => setRepeatModalVisible(true)}
          >
            <Text style={styles.repeatText}>{repeatOption}</Text>
            <Ionicons name="chevron-down" size={24} color="#333" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.saveButtonContainer}
            onPress={handleFormSubmit}
          >
            <LinearGradient
              colors={['#FFDA6A', '#FFC145']}
              style={styles.saveButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.saveButtonText}>UPDATE</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Repeat Modal */}
      <Modal
        isVisible={isRepeatModalVisible}
        onBackdropPress={() => setRepeatModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity onPress={() => { setRepeatOption('Every Day'); setRepeatModalVisible(false); }} style={styles.modalOption}>
            <Text style={styles.modalText}>Every Day</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setRepeatOption('Every Week'); setRepeatModalVisible(false); }} style={styles.modalOption}>
            <Text style={styles.modalText}>Every Week</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { setRepeatOption('Every Month'); setRepeatModalVisible(false); }} style={styles.modalOption}>
            <Text style={styles.modalText}>Every Month</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      {/* Date Time Pickers */}
      <DateTimePickerModal
        isVisible={isStartDatePickerVisible}
        mode="date"
        onConfirm={(date) => handleDateConfirm(date, true)}
        onCancel={() => setStartDatePickerVisibility(false)}
      />
      <DateTimePickerModal
        isVisible={isEndDatePickerVisible}
        mode="date"
        onConfirm={(date) => handleDateConfirm(date, false)}
        onCancel={() => setEndDatePickerVisibility(false)}
      />
      <DateTimePickerModal
        isVisible={isStartTimePickerVisible}
        mode="time"
        onConfirm={(time) => handleTimeConfirm(time, true)}
        onCancel={() => setStartTimePickerVisibility(false)}
      />
      <DateTimePickerModal
        isVisible={isEndTimePickerVisible}
        mode="time"
        onConfirm={(time) => handleTimeConfirm(time, false)}
        onCancel={() => setEndTimePickerVisibility(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  scrollContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  backIconButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  placeholder: {
    width: 40,
  },
  formContainer: {
    marginTop: 8,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  timeLabel: {
    width: 60,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  timeInputContainer: {
    flex: 1,
    marginLeft: 8,
  },
  dateInputContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  dateInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  timeInput: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#333',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  repeatContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  repeatText: {
    fontSize: 16,
    color: '#333',
  },
  saveButtonContainer: {
    marginTop: 16,
    marginBottom: 16,
  },
  saveButton: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 8,
    width: '100%',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 16,
  },
  modalOption: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalText: {
    fontSize: 16,
    color: '#333',
  },
});

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
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment';
import Modal from 'react-native-modal';
import { useRouter } from 'expo-router';
import { useAppDispatch } from '../store/hooks';
import { addEvent } from '../store/eventSlice';
import { nanoid } from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function App() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [selectedDate, setSelectedDate] = useState<number>(2);
  const [currentMonth, setCurrentMonth] = useState<string>('January 2025');
  const [eventName, setEventName] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('Jan 28, 2025');
  const [startTime, setStartTime] = useState<string>('03:00 PM');
  const [endDate, setEndDate] = useState<string>('Jan 30, 2025');
  const [endTime, setEndTime] = useState<string>('03:00 PM');
  const [repeatOption, setRepeatOption] = useState<string>('Every Week');
  const [startDateDay, setStartDateDay] = useState<number>(28);
  const [endDateDay, setEndDateDay] = useState<number>(30);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);
  const [isStartTimePickerVisible, setStartTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);
  const [isRepeatModalVisible, setRepeatModalVisible] = useState(false);

  const daysOfWeek = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const currentDay = 0;
  const calendarDays = [
    [null, null, null, 1, 2, 3, 4],
    [5, 6, 7, 8, 9, 10, 11],
    [12, 13, 14, 15, 16, 17, 18],
    [19, 20, 21, 22, 23, 24, 25],
    [26, 27, 28, 29, 30, 31, null]
  ];

  useEffect(() => {
    const startMoment = moment(startDate, 'MMM DD, YYYY');
    if (startMoment.isValid()) {
      setStartDateDay(startMoment.date());
      const monthYear = startMoment.format('MMMM YYYY');
      if (monthYear !== currentMonth) {
        setCurrentMonth(monthYear);
      }
    }

    const endMoment = moment(endDate, 'MMM DD, YYYY');
    if (endMoment.isValid()) {
      setEndDateDay(endMoment.date());
    }
  }, [startDate, endDate, currentMonth]);

  const handleNavigation = (direction: 'back' | 'forward') => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [month, year] = currentMonth.split(' ');
    const monthIndex = monthNames.indexOf(month);
    let newMonthIndex = direction === 'back' ? monthIndex - 1 : monthIndex + 1;
    let newYear = year;

    if (newMonthIndex < 0) {
      newMonthIndex = 11;
      newYear = `${parseInt(year) - 1}`;
    } else if (newMonthIndex > 11) {
      newMonthIndex = 0;
      newYear = `${parseInt(year) + 1}`;
    }

    const newMonth = monthNames[newMonthIndex];
    setCurrentMonth(`${newMonth} ${newYear}`);
  };

  const renderCalendarDay = (day: number | null) => {
    if (day === null) return <View style={styles.emptyDay} />;

    let dayStyle = styles.dayContainer;
    let textStyle = styles.dayText;

    if (day === currentDay) {
      dayStyle = styles.currentDayContainer;
      textStyle = styles.currentDayText;
    } else if (day === selectedDate) {
      dayStyle = styles.selectedDayContainer;
    } else if (day === startDateDay || day === endDateDay) {
      dayStyle = styles.eventDayContainer;
    }

    return (
      <TouchableOpacity
        key={day}
        style={dayStyle}
        onPress={() => {
          setSelectedDate(day);
          const [month, year] = currentMonth.split(' ');
          const newDate = moment(`${month} ${day}, ${year}`, 'MMMM D, YYYY').format('MMM DD, YYYY');
          setStartDate(newDate);
        }}
      >
        <Text style={textStyle}>{day}</Text>
      </TouchableOpacity>
    );
  };

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

  const handleFormSubmit = async () => {
    if (!eventName) {
      alert("Event Name is required!");
      return;
    }
    const newEvent = {
      id: nanoid(),
      eventName,
      startDate,
      startTime,
      endDate,
      endTime,
      repeatOption
    };

    dispatch(addEvent(newEvent));

    try {
      const storedEvents = await AsyncStorage.getItem('events');
      let events = storedEvents ? JSON.parse(storedEvents) : [];
      events.push(newEvent);
      await AsyncStorage.setItem('events', JSON.stringify(events));
    } catch (error) {
      console.error('Error saving event to AsyncStorage:', error);
    }

    router.push({
      //@ts-ignore
      pathname: `/event/${newEvent.id}`,
    });
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.calendarCard}>
          <View style={styles.monthNavigation}>
            <TouchableOpacity onPress={() => handleNavigation('back')}>
              <Ionicons name="chevron-back" size={24} color="#333" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{currentMonth}</Text>
            <TouchableOpacity onPress={() => handleNavigation('forward')}>
              <Ionicons name="chevron-forward" size={24} color="#333" />
            </TouchableOpacity>
          </View>
          <View style={styles.daysOfWeekRow}>
            {daysOfWeek.map(day => (
              <Text key={day} style={styles.dayOfWeekText}>{day}</Text>
            ))}
          </View>
          <View style={styles.calendarGrid}>
            {calendarDays.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.weekRow}>
                {week.map((day, dayIndex) => (
                  <View key={`${weekIndex}-${dayIndex}`}>
                    {renderCalendarDay(day)}
                  </View>
                ))}
              </View>
            ))}
          </View>
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

          <TouchableOpacity style={styles.createEventButton}>
            <View style={styles.createEventIcon}>
              <Text style={styles.plusIcon}>+</Text>
            </View>
            <Text style={styles.createEventText}>Create New Event</Text>
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
              <Text style={styles.saveButtonText}>SAVE</Text>
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
  calendarCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
  },
  daysOfWeekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  dayOfWeekText: {
    width: 40,
    textAlign: 'center',
    fontWeight: '500',
    color: '#666',
  },
  calendarGrid: {
    marginTop: 8,
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  dayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0F3F8',
  },
  currentDayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFDA6A',
  },
  eventDayContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF8E0',
  },
  emptyDay: {
    width: 40,
    height: 40,
  },
  dayText: {
    fontSize: 16,
    color: '#555',
  },
  currentDayText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
  },
  formContainer: {
    marginTop: 24,
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
  createEventButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  createEventIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFDA6A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  plusIcon: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  createEventText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  saveButtonContainer: {
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
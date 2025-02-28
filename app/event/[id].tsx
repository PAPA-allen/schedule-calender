import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch } from '../../store/hooks';
import { deleteEvent } from '../../store/eventSlice';

export default function EventScreen() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const loadEvents = async () => {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    };

    loadEvents();
  }, []);

  const handleEdit = (eventId: string) => {
    router.push({
      //@ts-ignore
      pathname: 'edit/edit-event',
      params: { id: eventId },
    });
  };

  const handleDelete = async (eventId: string) => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            const updatedEvents = events.filter((event) => event.id !== eventId);
            await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
            dispatch(deleteEvent(eventId));
            setEvents(updatedEvents);
          },
          style: 'destructive',
        },
      ]
    );
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
                <Text style={styles.headerTitle}>Event List</Text>
                <View style={styles.placeholder} />
              </View>

        {events.length === 0 ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>No events found</Text>
          </View>
        ) : (
          events.map((event) => (
            <View key={event.id} style={styles.eventCard}>
              <LinearGradient
                colors={['#FFDA6A', '#FFC145']}
                style={styles.eventHeader}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.eventTitle}>{event.eventName}</Text>
              </LinearGradient>

              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="calendar-outline" size={24} color="#FFDA6A" />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Date</Text>
                    <Text style={styles.detailText}>
                      {event.startDate === event.endDate
                        ? event.startDate
                        : `${event.startDate} - ${event.endDate}`}
                    </Text>
                  </View>
                </View>
                <View style={styles.detailRow}>
                  <View style={styles.detailIconContainer}>
                    <Ionicons name="time-outline" size={24} color="#FFDA6A" />
                  </View>
                  <View style={styles.detailTextContainer}>
                    <Text style={styles.detailLabel}>Time</Text>
                    <Text style={styles.detailText}>
                      {`${event.startTime} - ${event.endTime}`}
                    </Text>
                  </View>
                </View>
                {event.repeatOption && (
                  <View style={styles.detailRow}>
                    <View style={styles.detailIconContainer}>
                      <Ionicons name="repeat-outline" size={24} color="#FFDA6A" />
                    </View>
                    <View style={styles.detailTextContainer}>
                      <Text style={styles.detailLabel}>Repeats</Text>
                      <Text style={styles.detailText}>{event.repeatOption}</Text>
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.actionButtonsContainer}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.editButton]}
                  onPress={() => handleEdit(event.id)}
                >
                  <Ionicons name="create-outline" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Edit</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.deleteButton]}
                  onPress={() => handleDelete(event.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#FFF" />
                  <Text style={styles.actionButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
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
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  eventCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 24,
  },
  eventHeader: {
    padding: 20,
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFF',
    textAlign: 'center',
  },
  eventDetails: {
    padding: 20,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  detailIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  detailTextContainer: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 'auto',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 8,
  },
  editButton: {
    backgroundColor: '#4A90E2',
  },
  deleteButton: {
    backgroundColor: '#E25C5C',
  },
  actionButtonText: {
    color: '#FFF',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  backIconButton: {
    padding: 8,
  },
  placeholder: {
    width: 40,
  },
});

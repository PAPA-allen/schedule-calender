import React from 'react';
import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store } from '../store';

export default function Layout() {
  return (
    <Provider store={store}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen 
          name="index" 
        />
        <Stack.Screen 
          name="event/[id]" 
        />
        <Stack.Screen 
          name="edit-event" 
        />
      </Stack>
    </Provider>
  );
}
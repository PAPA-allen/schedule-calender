import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Event {
  id: string;
  eventName: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  repeatOption?: string;
}

interface EventsState {
  events: Event[];
}

const initialState: EventsState = {
  events: [],
};

export const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    addEvent: (state, action: PayloadAction<Event>) => {
      state.events.push(action.payload);
    },
    updateEvent: (state, action: PayloadAction<Event>) => {
      const index = state.events.findIndex(event => event.id === action.payload.id);
      if (index !== -1) {
        state.events[index] = action.payload;
      }
    },
    deleteEvent: (state, action: PayloadAction<string>) => {
      state.events = state.events.filter(event => event.id !== action.payload);
    },
  },
});

export const { addEvent, updateEvent, deleteEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
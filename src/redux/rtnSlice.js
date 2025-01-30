import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
    name: 'realTimeNotification',
    initialState: {
        notifications: [], // [1,2,3]
    },
    reducers: {
        setNotifications: (state, action) => {
            state.notifications = action.payload
            if (action.payload.type === 'like') {
                state.notifications.push(action.payload);
            } else if (action.payload.type === 'dislike') {
                state.notifications = state.notifications.filter((item) => item.userId !== action.payload.userId);
            }
        }
    }
});

export const { setNotifications } = rtnSlice.actions;
export default rtnSlice.reducer;
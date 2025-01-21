import { createSlice } from "@reduxjs/toolkit";
const campaignSlice = createSlice({
    name: 'campaign',
    initialState: {
        campaign: null,
    },
    reducers: {
        setCampaign: (state, action) => {
            state.campaign = action.payload;
        }
    }
});
export const { setCampaign } = campaignSlice.actions;
export default campaignSlice.reducer;

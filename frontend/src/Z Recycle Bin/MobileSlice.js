import { createSlice } from "@reduxjs/toolkit";

const mobileSlice = createSlice({
    name: "mobile",

    initialState:{
        mobile:[]
    },

    reducers:{
        setMobile:(state , action)=>{
            state.mobile = action.payload;
        },
        addMobile: (state, action) => {
      state.mobile.push(action.payload);
    },
        updateMobile:(state , action)=>{
            const index = state.mobile.findIndex(
                (m)=> m.mobile_id === action.payload.mobile_id
            );
            if(index !==-1){
                state.mobile[index]=action.payload;
            }
        },
        deleteMobile:(state , action) =>{
            state.mobile = state.mobile.filter(
                (m)=> m.mobile_id !== action.payload
            );
        }
    }
});

export const {setMobile, addMobile, updateMobile,deleteMobile}= mobileSlice.actions;
export default mobileSlice.reducer;
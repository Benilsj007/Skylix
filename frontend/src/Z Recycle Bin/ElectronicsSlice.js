import { createSlice } from "@reduxjs/toolkit";

const electronicsSlice = createSlice({
    name: "electronics",

    initialState:{
        electronics:[]
    },

    reducers:{
        setElectronics:(state , action)=>{
            state.electronics = action.payload;
        },
         addElectronics: (state, action) => {
      state.electronics.push(action.payload);
    },
        updateElectronics:(state , action)=>{
            const index = state.electronics.findIndex(
                (m)=> m.electronics_id === action.payload.electronics_id
            );
            if(index !==-1){
                state.electronics[index]=action.payload;
            }
        },
        deleteElectronics:(state , action) =>{
            state.electronics = state.electronics.filter(
                (m)=> m.electronics_id !== action.payload
            );
        }
    }
});

export const {setElectronics,addElectronics, updateElectronics,deleteElectronics}= electronicsSlice.actions;
export default electronicsSlice.reducer;
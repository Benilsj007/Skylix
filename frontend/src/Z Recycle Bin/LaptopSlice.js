import { createSlice } from "@reduxjs/toolkit";

const laptopSlice = createSlice({
    name: "laptop",

    initialState:{
        laptop:[]
    },

    reducers:{
        setLaptop:(state , action)=>{
            state.laptop = action.payload;
        },
         
    addLaptop: (state, action) => {
      state.laptop.push(action.payload);
    },
        updateLaptop:(state , action)=>{
            const index = state.laptop.findIndex(
                (m)=> m.laptop_id === action.payload.laptop_id
            );
            if(index !==-1){
                state.laptop[index]=action.payload;
            }
        },
        deleteLaptop:(state , action) =>{
            state.laptop = state.laptop.filter(
                (m)=> m.laptop_id !== action.payload
            );
        }
    }
});

export const {setLaptop, addLaptop, updateLaptop,deleteLaptop}= laptopSlice.actions;
export default laptopSlice.reducer;
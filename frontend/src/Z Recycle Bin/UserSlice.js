import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({

name:"user",

initialState:{
user:[]
},

reducers:{

setUser:(state,action)=>{
state.user = action.payload;
},

updateUser:(state,action)=>{
const index = state.user.findIndex(
(u)=>u.id === action.payload.id
);

if(index !== -1){
state.user[index] = action.payload;
}
},

deleteUser:(state,action)=>{
state.user = state.user.filter(
(u)=>u.id !== action.payload
);
}

}

});

export const { setUser, updateUser, deleteUser } = userSlice.actions;

export default userSlice.reducer;
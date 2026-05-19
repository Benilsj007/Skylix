import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./productSlice";
import userReducer from "./UserSlice";
import mobileReducer from "./MobileSlice";
import laptopReducer from "./LaptopSlice";
import electronicsReducer from "./ElectronicsSlice";

const store = configureStore({
reducer:{
products: productReducer,
user: userReducer,
mobile: mobileReducer,
laptop: laptopReducer,
electronics: electronicsReducer
}
});

export default store;
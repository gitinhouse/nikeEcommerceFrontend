import { configureStore } from '@reduxjs/toolkit';
import formSliceReducer from './FormSlice';

export const store = configureStore({
    reducer:{
        formslice:formSliceReducer
    },
})

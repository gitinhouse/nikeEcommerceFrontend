import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  
};

const FormSlice = createSlice({
  name: "formslice",
  initialState,
  reducers: {

  },
});

export const { formDataAdded, updateFormStatus, resetFormStatus } =  FormSlice.actions;
export default FormSlice.reducer;

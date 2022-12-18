import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
    name: "toolkit",
    initialState: {
        isLoading: true,
        category: [],
        product: [],
    },
    reducers: {
        setLoading(state, action) {
            state.isLoading = action.payload;
        },
        loadCategory(state, action) {
            state.category = action.payload;
        },
        loadProduct(state, action) {
            state.product = action.payload;
        }
    },
});

export default slice.reducer;

export const { loadCategory, loadProduct, setLoading } = slice.actions;
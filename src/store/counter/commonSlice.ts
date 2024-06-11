import { createSlice } from '@reduxjs/toolkit'

export const commonSlice = createSlice({
  name: 'counter',
  initialState: {
   dict: undefined
  },
  reducers: {
    fetchDict: (state, action) => {
      state.dict = action.payload;
    }
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { fetchDict } = commonSlice.actions

export default commonSlice.reducer
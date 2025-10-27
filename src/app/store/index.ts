import {configureStore} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';
import authReducer from '../../features/auth/slice/authSlice';


export const store = configureStore({
reducer: {
auth: authReducer,
},
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


// convenience hook file can re-export this
export const useAppDispatchTyped = () => useDispatch<AppDispatch>();
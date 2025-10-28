import React from 'react';

export const GestureHandlerRootView = ({ children }) => <>{children}</>;

export const PanGestureHandler = ({ children }) => <>{children}</>;
export const TapGestureHandler = ({ children }) => <>{children}</>;
export const LongPressGestureHandler = ({ children }) => <>{children}</>;
export const FlingGestureHandler = ({ children }) => <>{children}</>;

// Export other handlers as empty components if needed
export default {
  GestureHandlerRootView,
  PanGestureHandler,
  TapGestureHandler,
  LongPressGestureHandler,
  FlingGestureHandler,
};

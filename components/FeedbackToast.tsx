
import React, { useEffect } from 'react';
import {
  Animated,
  StyleSheet,
  Text,
} from 'react-native';

interface FeedbackToastProps {
  visible: boolean;
  message: string;
  type?: 'success' | 'error' | 'warning';
  duration?: number;
  onHide?: () => void;
}

export default function FeedbackToast({
  visible,
  message,
  type = 'error',
  duration = 3000,
  onHide,
}: FeedbackToastProps) {
  const opacity = React.useRef(new Animated.Value(0)).current;
  const onHideRef = React.useRef(onHide);

  useEffect(() => {
    onHideRef.current = onHide;
  }, [onHide]);

  useEffect(() => {
    if (!visible) {
      opacity.setValue(0);
      return;
    }

    Animated.timing(opacity, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          onHideRef.current?.();
        }
      });
    }, duration);

    return () => clearTimeout(timeout);
  }, [visible, message, duration, opacity]);

  if (!visible) {
    return null;
  }

  const backgroundColor = {
    success: '#166534',
    error: '#991B1B',
    warning: '#92400E',
  }[type];

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.container,
        { backgroundColor, opacity },
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 55,
    left: 16,
    right: 16,
    padding: 14,
    borderRadius: 8,
    zIndex: 999,
    elevation: 5,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
});

import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Modal, Animated, Image } from 'react-native';
import { Text } from 'react-native-paper';

interface BadgeUnlockModalProps {
  visible: boolean;
  badgeName: string;
  badgeImage: any;
  onDismiss: () => void;
}

const BadgeUnlockModal: React.FC<BadgeUnlockModalProps> = ({ visible, badgeName, badgeImage, onDismiss }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-dismiss after 3 seconds
      const timeout = setTimeout(() => {
        onDismiss();
      }, 3000);

      return () => clearTimeout(timeout);
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(0);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <Animated.View style={[styles.modalContent, { transform: [{ scale: scaleAnim }], opacity: opacityAnim }]}>
          <Image source={badgeImage} style={styles.badgeImage} resizeMode="contain" />
          <Text style={styles.badgeText}>🏆 You unlocked: {badgeName}!</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 10,
  },
  badgeImage: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  badgeText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default BadgeUnlockModal;

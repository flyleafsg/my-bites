import React from 'react';
import { View, Modal, Platform, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

type CalendarModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelectDate: (date: Date) => void;
  selectedDate: Date;
};

const CalendarModal: React.FC<CalendarModalProps> = ({
  visible,
  onClose,
  onSelectDate,
  selectedDate,
}) => {
  const isWeb = Platform.OS === 'web';

  const handleWebDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      onSelectDate(newDate);
    }
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.content}>
          {isWeb ? (
            <>
              <Text style={styles.label}>Pick a date</Text>
              <input
                type="date"
                defaultValue={selectedDate.toISOString().substring(0, 10)}
                onChange={handleWebDateChange}
                style={styles.webDateInput as React.CSSProperties}
              />
            </>
          ) : (
            // Mobile DateTimePicker
            <Text style={styles.label}>Mobile date picker will show here</Text>
          )}
          <Button onPress={onClose} style={styles.closeButton}>
            Cancel
          </Button>
        </View>
      </View>
    </Modal>
  );
};

export default CalendarModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 12,
  },
  webDateInput: {
    fontSize: 16,
    padding: 8,
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  closeButton: {
    marginTop: 16,
  },
});

import React from 'react';
import Modal from 'react-modal';
import styles from './ConfirmModal.module.scss';

const ConfirmModal = ({
  isOpen,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  hideCancel = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCancel}
      className={styles.modal}
      overlayClassName={styles.overlay}
      ariaHideApp={false}
    >
      <div className={styles.content}>
        <p className={styles.message}>{message}</p>
        <div className={styles.buttons}>
          {!hideCancel && (
            <button className={styles.cancel} onClick={onCancel}>
              {cancelText}
            </button>
          )}
          <button
            className={styles.confirm}
            onClick={() => {
              onConfirm && onConfirm();
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

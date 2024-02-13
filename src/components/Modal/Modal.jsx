import React, { useEffect } from 'react';
import s from './Modal.module.css';

export const Modal = ({ close, children }) => {
  useEffect(() => {
    const handleKeyDown = e => {
      if (e.key === 'Escape') {
        close();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close]);

  const handleClickOnBackdrop = e => {
    if (e.currentTarget === e.target) {
      close();
    }
  };

  return (
    <div className={s.Overlay} onClick={handleClickOnBackdrop}>
      <div className={s.modal}>{children}</div>
    </div>
  );
};

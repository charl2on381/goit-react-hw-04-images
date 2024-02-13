import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from './App.module.css';
import Searchbar from './Searchbar/Searchbar';
import { getPhotos } from './api/gallery';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { Modal } from './Modal/Modal';

const App = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [photos, setPhotos] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoader, setIsLoader] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState({});

  useEffect(() => {
    if (!query) return;
    const getData = async () => {
      try {
        setIsLoader(true);
        const data = await getPhotos(query, page);
        setPhotos(prev =>
          page === 1 ? [...data.results] : [...prev, ...data.results]
        );

        setTotalPages(data.total_pages);
      } catch (e) {
        console.log(e);
        toast.error('Sorry, problem connection to server!');
      } finally {
        setIsLoader(false);
      }
    };
    getData();
  }, [query, page]);

  const handleFormSubmit = query => {
    setQuery(query);
    setPage(1);
    setPhotos([]);
    setTotalPages(1);
  };

  const handleClickButton = e => {
    setPage(prev => prev + 1);
  };

  const handleToggleModal = () => {
    setShowModal(prev => !prev);
  };

  const handleOpenModal = img => {
    setModalContent(img);
    setShowModal(true);
    setIsLoader(true);
  };

  const handleToggleLoader = () => {
    setIsLoader(prev => !prev);
  };

  return (
    <div className={s.App}>
      <Searchbar onSubmit={handleFormSubmit} />
      {photos && <ImageGallery photos={photos} openModal={handleOpenModal} />}
      {totalPages > 1 && page < totalPages && !isLoader ? (
        <Button onClick={handleClickButton} />
      ) : (
        ''
      )}
      {isLoader && <Loader />}
      {showModal && (
        <Modal close={handleToggleModal}>
          {isLoader && <Loader color="white" />}
          <img
            className={s.ModalContent}
            src={modalContent.src}
            alt={modalContent.alt}
            onLoad={handleToggleLoader}
          />
        </Modal>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;

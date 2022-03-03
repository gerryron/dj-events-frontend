import { useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';
import { FaImages } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import dayjs from 'dayjs';
import { API_URL } from '@/config/index';
import Layout from '@/components/Layout';
import Modal from '@/components/Modal';
import styles from '@/styles/Form.module.css';
import 'react-toastify/dist/ReactToastify.css';
import ImageUpload from '@/components/ImageUpload';

export default function EditEventPage({ evt }) {
  const router = useRouter();
  const imageData = evt.attributes.image.data;
  const [imagePreview, setImagePreview] = useState(imageData
    ? imageData.attributes.formats.thumbnail.url : null);
  const [showModal, setShowModal] = useState(false);

  const [values, setValues] = useState({
    name: evt.attributes.name,
    performers: evt.attributes.performers,
    venue: evt.attributes.venue,
    address: evt.attributes.address,
    date: dayjs(evt.attributes.date).format('YYYY-MM-DD'),
    time: evt.attributes.time,
    description: evt.attributes.description,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // * Validation
    const hasEmptyFields = Object.values(values).some((element) => element === '');
    if (hasEmptyFields) {
      toast.error('Please fill in all fields');
    }

    const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: values }),
    });

    if (!res.ok) {
      toast.error('Something Went Wrong');
    } else {
      const responseData = await res.json();
      router.push(`/events/${responseData.data.attributes.slug}`);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: value });
  };

  const imageUploaded = async () => {
    const res = await fetch(`${API_URL}/api/events/${evt.id}?populate=*`);
    const { data } = await res.json();
    setImagePreview(data.attributes.image.data.attributes.formats.thumbnail.url);
    setShowModal(false);
  };

  return (
    <Layout title="Edit Event">
      <Link href="/events">Go back</Link>
      <h1>Edit Event</h1>
      <ToastContainer />
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <div>
            <label htmlFor="name">Event Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={values.name}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="performers">Performers</label>
            <input
              type="text"
              id="performers"
              name="performers"
              value={values.performers}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="venue">Venue</label>
            <input
              type="text"
              id="venue"
              name="venue"
              value={values.venue}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="address">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={values.address}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={values.date}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="time">Time</label>
            <input
              type="text"
              id="time"
              name="time"
              value={values.time}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div>
          <label htmlFor="description">Description</label>
          <textarea
            type="text"
            id="description"
            name="description"
            value={values.description}
            onChange={handleInputChange}
          />
        </div>

        <input type="submit" value="Edit Event" className="btn" />
      </form>

      <h2>Event Image</h2>
      {imagePreview ? (
        <Image src={imagePreview} height={100} width={170} />
      ) : (
        <div>
          <p>No Image Uploaded</p>
        </div>
      )}

      <div>
        <button
          type="button"
          className="btn-secondary"
          onClick={() => setShowModal(true)}
        >
          <FaImages />
          {' '}
          Set Image
        </button>
      </div>

      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <ImageUpload evtId={evt.id} imageUploaded={imageUploaded} />
      </Modal>

    </Layout>
  );
}

export async function getServerSideProps({ params: { id } }) {
  const res = await fetch(`${API_URL}/api/events/${id}?populate=*`);
  const { data } = await res.json();

  return {
    props: {
      evt: data,
    },
  };
}

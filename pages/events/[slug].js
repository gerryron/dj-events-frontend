import { FaPencilAlt, FaTimes } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';
import styles from '@/styles/Event.module.css';

export default function EventPage({ evt }) {
  const router = useRouter();
  const imageData = evt.attributes.image.data;

  const deleteEvent = async () => {
    if (confirm('Are you sure?')) {
      const res = await fetch(`${API_URL}/api/events/${evt.id}`, {
        method: 'DELETE',
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.message);
      } else {
        router.push('/events');
      }
    }
  };

  return (
    <Layout>
      <div className={styles.event}>
        <div className={styles.controls}>
          <Link href={`/events/edit/${evt.id}`}>
            <a>
              <FaPencilAlt />
              {' '}
              Edit Event
            </a>
          </Link>
          <a href="#" className={styles.delete} onClick={deleteEvent}>
            <FaTimes />
            {' '}
            Delete Event
          </a>
        </div>

        <span>
          {new Date(evt.attributes.date).toLocaleDateString('en-US')}
          {' '}
          at
          {' '}
          {evt.attributes.time}
        </span>
        <h1>{evt.attributes.name}</h1>
        <ToastContainer />
        {imageData && (
        <div className={styles.image}>
          <Image
            src={imageData.attributes.formats.medium.url}
            width={960}
            height={600}
          />
        </div>
        )}

        <h3>Performers:</h3>
        <p>{evt.attributes.performers}</p>
        <h3>Description:</h3>
        <p>{evt.attributes.description}</p>
        <h3>
          Venue:
          {' '}
          {evt.attributes.venue}
        </h3>
        <p>{evt.attributes.address}</p>

        <Link href="/events">
          <a className={styles.back}>
            {'<'}
            {' '}
            Go Back
          </a>
        </Link>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const res = await fetch(`${API_URL}/api/events?populate=*`);
  const { data } = await res.json();

  const paths = data.map((evt) => ({
    params: { slug: evt.attributes.slug },
  }));

  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params: { slug } }) {
  const res = await fetch(`${API_URL}/api/events?filters[slug][$eq]=${slug}&populate=*`);
  const { data } = await res.json();
  return {
    props: {
      evt: data[0],
    },
    revalidate: 1,
  };
}

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/styles/EventItem.module.css';

export default function EventItem({ evt }) {
  const imageData = evt.attributes.image.data;
  return (
    <div className={styles.event}>
      <div className={styles.img}>
        <Image
          src={imageData ? imageData.attributes.formats.thumbnail.url : '/images/event-default.png'}
          width={170}
          height={100}
        />
      </div>

      <div className={styles.info}>
        <span>
          {new Date(evt.attributes.date).toLocaleDateString('en-US')}
          {' '}
          at
          {' '}
          {evt.attributes.time}
        </span>
        <h3>
          {evt.attributes.name}
        </h3>
      </div>
      <div className={styles.link}>
        <Link href={`/events/${evt.attributes.slug}`}>
          <a className="btn">Details</a>
        </Link>
      </div>
    </div>
  );
}
import Link from 'next/link';
import EventItem from '@/components/EventItem';
import Layout from '@/components/Layout';
import { API_URL } from '@/config/index';

export default function Home({ events }) {
  const { data } = events;
  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {data.length === 0 && <h3>No events to show</h3>}

      {data.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}

      {data.length > 0 && (
        <Link href="/events">
          <a className="btn-secondary">View All Events</a>
        </Link>
      )}
    </Layout>
  );
}

export async function getStaticProps() {
  const res = await fetch(`${API_URL}/api/events?sort=date:ASC&pagination[limit]=3&populate=*`);
  const events = await res.json();

  return {
    props: { events },
    revalidate: 1,
  };
}

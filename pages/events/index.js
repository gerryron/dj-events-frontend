import EventItem from '@/components/EventItem';
import Layout from '@/components/Layout';
import { API_URL, PER_PAGE } from '@/config/index';
import Pagination from '@/components/Pagination';

export default function EventsPage({ events, page, total }) {
  return (
    <Layout>
      <h1>Upcoming Events</h1>
      {events.length === 0 && <h3>No events to show</h3>}

      {events.map((evt) => (
        <EventItem key={evt.id} evt={evt} />
      ))}

      <Pagination page={page} total={total} />
    </Layout>
  );
}

export async function getServerSideProps({ query: { page = 1 } }) {
  const start = +page === 1 ? 0 : (+page - 1) * PER_PAGE;

  const res = await fetch(`${API_URL}/api/events?sort=date:asc&pagination[limit]=${PER_PAGE}&pagination[start]=${start}&populate=*`);
  const { data, meta } = await res.json();

  return {
    props: {
      events: data,
      page: +page,
      total: meta.pagination.total,
    },
  };
}

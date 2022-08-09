import { getFeaturedEvents } from '../helpers/api-util'
import EventList from '../components/events/event-list'

function HomePage(props) {
  return (
    <div>
      <EventList items={props.events}></EventList>
    </div>
  )
}

export async function getStaticProps() {
  const featuredEvents = await getFeaturedEvents()
  return {
    props: {
      events: featuredEvents,
    },
    revalidate: 1800,
  }
}

export default HomePage

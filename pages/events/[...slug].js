import { useRouter } from 'next/router'
import useSWR from 'swr'
import { getFilteredEvents } from '../../helpers/api-util'
import EventList from '../../components/events/event-list'
import { Fragment, useEffect, useState } from 'react'
import ResultsTitle from '../../components/events/results-title'
import Button from '../../components/ui/button'
import ErrorAlert from '../../components/ui/error-alert'

function FilteredEventsPage(props) {
  const [loadedEvents, setLoadedEvents] = useState()
  const router = useRouter()
  const filterData = router.query.slug
  const { data, error } = useSWR(
    'https://csc561-skoch7-default-rtdb.firebaseio.com/events.json',
    (url) => fetch(url).then((res) => res.json())
  )

  useEffect(() => {
    if (data) {
      const events = []

      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        })
      }
      setLoadedEvents(events)
    }
  }, [data])

  if (!loadedEvents) {
    return <p className='center'>Loading...</p>
  }

  const filteredYear = +filterData[0]
  const filteredMonth = +filterData[1]

  if (
    isNaN(filteredYear) ||
    isNaN(filteredMonth) ||
    filteredYear > 2030 ||
    filteredYear < 2021 ||
    filteredMonth < 1 ||
    filteredMonth > 12 ||
    error
  ) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>Invalid filters. Please adjust your values!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div>
      </Fragment>
    )
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date)
    return (
      eventDate.getFullYear() === filteredYear &&
      eventDate.getMonth() === filteredMonth - 1
    )
  })

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events'>Show All Events</Button>
        </div>
      </Fragment>
    )
  }

  const date = new Date(filteredYear, filteredMonth - 1)

  return (
    <Fragment>
      <ResultsTitle date={date}></ResultsTitle>
      <EventList items={filteredEvents}></EventList>
    </Fragment>
  )
}

// export async function getServerSideProps(context) {
//   const { params } = context
//   const filterData = params.slug

//   const filteredYear = +filterData[0]
//   const filteredMonth = +filterData[1]

//   if (
//     isNaN(filteredYear) ||
//     isNaN(filteredMonth) ||
//     filteredYear > 2030 ||
//     filteredYear < 2021 ||
//     filteredMonth < 1 ||
//     filteredMonth > 12
//   ) {
//     return {
//       props: {
//         hasError: true,
//       },
//       // notFound: true,
//       // redirect: {
//       //   destination: '/error',
//       // },
//     }
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: filteredYear,
//     month: filteredMonth,
//   })

//   return {
//     props: {
//       events: filteredEvents,
//       date: {
//         year: filteredYear,
//         month: filteredMonth,
//       },
//     },
//   }
// }

export default FilteredEventsPage

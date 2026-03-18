import logging
from abc import ABC, abstractmethod
from datetime import datetime, timedelta
from events.models import Event, Hackathon, EventFetch

logger = logging.getLogger(__name__)


class EventFetcher(ABC):
    """Base class for event fetchers"""
    
    @abstractmethod
    def fetch_events(self):
        """Fetch events from external source. Returns (events, hackathons, status_message)"""
        pass
    
    def save_fetch_log(self, fetch_type, status, total_fetched, new_created, updated, error_message=''):
        """Save fetch operation log"""
        EventFetch.objects.create(
            fetch_type=fetch_type,
            status=status,
            total_fetched=total_fetched,
            new_created=new_created,
            updated=updated,
            error_message=error_message
        )


class DefaultEventFetcher(EventFetcher):
    """Default fetcher - can be extended with real API integration"""
    
    def fetch_events(self):
        """Placeholder for actual event fetching logic"""
        logger.info("DefaultEventFetcher: No real data source configured")
        return [], [], "No real data source"


class MockEventFetcher(EventFetcher):
    """Mock fetcher for testing purposes"""
    
    def fetch_events(self):
        """Returns mock events and hackathons"""
        now = datetime.now()
        
        mock_events = [
            {
                'title': 'Campus Coding Competition',
                'description': 'Annual coding competition for all students',
                'event_type': 'competition',
                'start_date': now + timedelta(days=7),
                'end_date': now + timedelta(days=7, hours=6),
                'location': 'Main Auditorium',
                'capacity': 200,
                'organizer': 'CS Department',
                'is_featured': True,
            },
            {
                'title': 'Tech Talk: AI in 2026',
                'description': 'Industry experts discuss latest AI trends',
                'event_type': 'seminar',
                'start_date': now + timedelta(days=3),
                'end_date': now + timedelta(days=3, hours=2),
                'location': 'Conference Hall A',
                'capacity': 150,
                'organizer': 'Tech Club',
                'is_featured': False,
            },
            {
                'title': 'Freshers Cultural Fest',
                'description': 'Annual cultural event for new students',
                'event_type': 'fest',
                'start_date': now + timedelta(days=14),
                'end_date': now + timedelta(days=15),
                'location': 'Sports Ground',
                'capacity': 1000,
                'organizer': 'Student Council',
                'is_featured': True,
            },
        ]
        
        mock_hackathons = [
            {
                'title': 'Campus24 Hackathon',
                'description': '24-hour hackathon to build innovative solutions',
                'difficulty': 'intermediate',
                'start_date': now + timedelta(days=21),
                'end_date': now + timedelta(days=21, hours=24),
                'location': 'Innovation Lab',
                'max_team_size': 4,
                'min_team_size': 2,
                'prizes': [
                    {'place': 1, 'amount': 50000},
                    {'place': 2, 'amount': 30000},
                    {'place': 3, 'amount': 20000},
                ],
                'organizer': 'Tech Club',
                'is_featured': True,
            },
            {
                'title': 'Web Development Challenge',
                'description': 'Build web applications with React and Django',
                'difficulty': 'beginner',
                'start_date': now + timedelta(days=10),
                'end_date': now + timedelta(days=17),
                'location': 'Online',
                'max_team_size': 3,
                'min_team_size': 1,
                'prizes': [
                    {'place': 1, 'amount': 25000},
                    {'place': 2, 'amount': 15000},
                ],
                'organizer': 'Web Dev Club',
                'is_featured': False,
            },
        ]
        
        events_created = 0
        events_updated = 0
        hackathons_created = 0
        hackathons_updated = 0
        
        # Process events
        for event_data in mock_events:
            obj, created = Event.objects.update_or_create(
                title=event_data['title'],
                defaults=event_data
            )
            if created:
                events_created += 1
            else:
                events_updated += 1
        
        # Process hackathons
        for hackathon_data in mock_hackathons:
            obj, created = Hackathon.objects.update_or_create(
                title=hackathon_data['title'],
                defaults=hackathon_data
            )
            if created:
                hackathons_created += 1
            else:
                hackathons_updated += 1
        
        # Log fetch operation
        self.save_fetch_log(
            'events',
            'success',
            events_created + events_updated,
            events_created,
            events_updated
        )
        
        self.save_fetch_log(
            'hackathons',
            'success',
            hackathons_created + hackathons_updated,
            hackathons_created,
            hackathons_updated
        )
        
        logger.info(f"Mock fetcher: Created {events_created} events, {hackathons_created} hackathons")
        return mock_events, mock_hackathons, "Mock data loaded successfully"

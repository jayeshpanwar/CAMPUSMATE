from django.core.management.base import BaseCommand
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Fetch events and hackathons from configured sources'
    
    def add_arguments(self, parser):
        parser.add_argument(
            '--source',
            type=str,
            default='mock',
            help='Fetcher source: mock, default, or custom'
        )
    
    def handle(self, *args, **options):
        source = options['source'].lower()
        
        try:
            if source == 'mock':
                from events.tasks.fetchers import MockEventFetcher
                fetcher = MockEventFetcher()
            elif source == 'default':
                from events.tasks.fetchers import DefaultEventFetcher
                fetcher = DefaultEventFetcher()
            else:
                self.stdout.write(
                    self.style.ERROR(f'Unknown source: {source}')
                )
                return
            
            self.stdout.write(
                self.style.SUCCESS(f'Starting fetch from {source} source...')
            )
            
            events, hackathons, message = fetcher.fetch_events()
            
            self.stdout.write(
                self.style.SUCCESS(f'Fetch completed: {message}')
            )
            self.stdout.write(
                self.style.SUCCESS(f'Events: {len(events)}, Hackathons: {len(hackathons)}')
            )
            
        except Exception as e:
            logger.error(f"Error fetching events: {e}")
            self.stdout.write(
                self.style.ERROR(f'Error: {str(e)}')
            )

import logging
from apscheduler.schedulers.background import BackgroundScheduler
from django.conf import settings

logger = logging.getLogger(__name__)

scheduler = None


def fetch_events_task():
    """Task to fetch events from external sources"""
    try:
        from .fetchers import MockEventFetcher
        fetcher = MockEventFetcher()
        events, hackathons, message = fetcher.fetch_events()
        logger.info(f"Event fetch completed: {message}")
    except Exception as e:
        logger.error(f"Error fetching events: {e}")


def start_scheduler():
    """Start the APScheduler for scheduled tasks"""
    global scheduler
    
    if scheduler and scheduler.running:
        return
    
    try:
        scheduler = BackgroundScheduler()
        
        # Schedule event fetching at 2 AM daily
        scheduler.add_job(
            fetch_events_task,
            'cron',
            hour=2,
            minute=0,
            id='fetch_events',
            name='Fetch events and hackathons',
            replace_existing=True
        )
        
        scheduler.start()
        logger.info("Event scheduler started successfully")
    except Exception as e:
        logger.warning(f"Could not start scheduler: {e}")


def stop_scheduler():
    """Stop the scheduler"""
    global scheduler
    
    if scheduler and scheduler.running:
        scheduler.shutdown()
        logger.info("Event scheduler stopped")

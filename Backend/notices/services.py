from datetime import timedelta

from django.utils import timezone

from chat.models import ChatMessage

from .models import Notice


def dispatch_due_reminders():
    """Create chat reminder messages for notices whose reminder window has started."""
    now = timezone.now()
    due_notices = Notice.objects.select_related("target_group", "created_by").filter(
        reminder_sent=False,
        end_time__isnull=False,
        target_group__isnull=False,
    )

    for notice in due_notices:
        remind_at = notice.end_time - timedelta(minutes=notice.remind_before_minutes or 0)
        if remind_at <= now <= notice.end_time:
            end_time_label = timezone.localtime(notice.end_time).strftime("%b %d, %Y %I:%M %p")
            ChatMessage.objects.create(
                group=notice.target_group,
                sender=notice.created_by,
                content=f"Reminder: '{notice.title}' closes at {end_time_label}. {notice.content}",
            )
            notice.reminder_sent = True
            notice.save(update_fields=["reminder_sent", "updated_at"])